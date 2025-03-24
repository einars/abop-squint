(ns hellow
  (:require ["squint-cljs/string.js" :as str]))

(def regl (js/createREGL ".gl-canvas"))

(def Tau (* js/Math.PI 2))

(def *figure (atom nil))
(def *points (atom nil))
(def *projection (atom nil))


(defn split-into-two
  "Can't use str/split(s, re, limit) as limit splits all and drops the rest of the splits"
  [s]
  (when-let [pos (.indexOf s ":")]
    [(str/trim (.substring s 0 pos)) (str/trim (.substring s (inc pos)))]))



(defn fig->str [fig]
  (str/join (mapv (fn [[k v]] (str k ": " (if (seq? v) (apply str v) (str v)) "\n")) fig)))

(defn parse-line-and-collect [accum line]
  (when-let [s (str/trim line)]
    (let [[k v] (split-into-two s)]
      (case k
        "name" (assoc accum :name v)
        "iterations" (assoc accum :iterations (parse-long v))
        "angle" (assoc accum :angle (parse-long v))
        "me" (assoc accum :me (into [] v))
        nil accum
        (assoc accum k v)))))

(defn str->fig [s]
  (reduce parse-line-and-collect {} (str/split-lines s)))

(def known-figures  
  [{:name "Fig 1.6 Quadratic Koch island"
    :angle 90
    :iterations 3
    :me "F-F-F-F"
    :F "F-F+F+FF-F-F+F" }
   {:name "Fig 1.9a"
    :angle 90
    :iterations 3
    :me "F-F-F-F"
    :F "FF-F-F-F-F-F+F"}

   {:name "Fig 1.9b"
    :angle 90
    :iterations 4
    :me "F-F-F-F"
    :F "FF-F-F-F-FF"}

   {:name "Fig 1.9c"
    :angle 90
    :iterations 3
    :me [:F :- :F :- :F :- :F]
    :F "FF-F+F-F-FF"}

   {:name "Fig 1.10a Dragon curve"
    :angle 90
    :iterations 12
    :me "L"
    :L "L+R+"
    :R "-L-R"}

   {:name "Fig 1.10b Sierpinski gasket"
    :angle 60
    :iterations 7
    :me "L"
    :L "R+L+R"
    :R "L-R-L"}

   {:name "Fig 1.11a hex Gosper"
    :angle 60
    :iterations 4
    :me "L"
    :L "L+R++R-L--LL-R+"
    :R "-L+RR++R+L--L-R"
    }

   {:name "Fig 1.11b generic Gosper"
    :angle 90
    :iterations 2
    :me "-R"
    :L "LL-R-R+L+L-R-RL+R+LLR-L+R+LL+R-LR-R-L+L+RR-"
    :R "+LL-R-R+L+LR+L-RR-L-R+LRR-L-RL+L+R-R-L+L+RR"
    }

   ])

(defn rebase-0 [pts]
  (let [min-x (apply js/Math.min (mapv first pts))
        min-y (apply js/Math.min (mapv second pts))]
    (mapv (fn [[x y]] [(- x min-x) (- y min-y)]) pts)))


(defn koch-step [koch]
  (loop [current (:me koch), accum []]
    (if-not current
      (assoc koch :me accum)
      (if-let [replacement (get koch (first current))]
        (recur (next current) (into accum replacement))
        (recur (next current) (conj accum (first current)))))))



(defn move [[x y] angle]
  [(+ x (js/Math.cos angle))
   (+ y (js/Math.sin angle))])


(defn materialize [koch turn-angle]
  (loop [koch (:me koch), pos [0 0], facing 0.0, accum [[0 0]]]
    (let [npos (move pos facing)
          nkoch (next koch)]
      (case (first koch)
        :F (recur nkoch npos facing (conj accum npos))
        :L (recur nkoch npos facing (conj accum npos))
        :R (recur nkoch npos facing (conj accum npos))
        :+ (recur nkoch pos (+ facing turn-angle) accum)
        :- (recur nkoch pos (- facing turn-angle) accum)
        (rebase-0 accum)))))

(defn padded-ortho-projection [w h]
  (let [m (js/mat4.create)
        padding 5]
    ; 0 0 — bottom left
    (js/mat4.ortho m (- padding) (+ padding w) (- padding) (+ padding h) -10 10)
    m))

(defn best-projection [pts]
  (let [max-x (apply js/Math.max (mapv first pts))
        max-y (apply js/Math.max (mapv second pts))
        max (js/Math.max max-x max-y)]
    (padded-ortho-projection max max)))


(def frag "
precision mediump float;
uniform vec4 color;
void main() {
  gl_FragColor = color;
}
  ")

(def vert "
precision mediump float;
uniform mat4 projection;
attribute vec2 position;
void main() {
  gl_Position = projection * vec4(position, 0, 1);
}
  ")

(def continuous-line []
  (regl
    {:frag frag
     :vert vert
     :uniforms {:color [1 0 0 1 ]
                :projection (regl/prop "projection")}
     :attributes {:position (regl/prop "points") 
                  }
     :elements (fn [ctx props batchid]
                 (mapv #(list % (inc %)) (range (dec (count (:points props))))))
     }))

(defn get-koch [rules generation]
  (nth (iterate koch-step rules) generation))

(def draw-triangle
  (regl
    {:frag frag
     :vert vert
     :attributes{:position (regl/buffer [[-2 -2]
                                         [4 -2]
                                         [4 4] ])}
     :uniforms {:color (regl/prop "color")}
     :count 3 }))

(defn load-figure! [fig]
  (set! (.-value (js/document.querySelector "textarea")) (fig->str fig)))

(defn set-figure! [fig]
  (let [iterations (:iterations fig 3)
        angle (* Tau (:angle fig 90) (/ 360))
        k (materialize (get-koch fig iterations) angle)]
    (reset! *points k)
    (reset! *projection (best-projection k))
    (set! (.-innerHTML (js/document.querySelector ".text")) (str (:name fig) ", " iterations " iterations, " (count k) " segments"))))

(defn build-menu! [figures]
  (let [root (js/document.querySelector ".menu")]
    (doseq [f figures]
      (let [b (js/document.createElement "button")
            on-click (fn [e] 
                       (.preventDefault e)
                       (load-figure! f)
                       (set-figure! f))
            ]
        (set! (.-type b) "button")
        (set! (.-className b) "outline")
        (set! (.-innerHTML b) (:name f))
        (.addEventListener b "click" on-click)
        (.appendChild root b)))))

(defn enable-run! []
  (let [b (js/document.querySelector ".run")
        textarea (js/document.querySelector "textarea")
        on-click (fn [e]
                   (.preventDefault e)
                   (set-figure! (str->fig (.-value textarea))))]
    (.addEventListener b "click" on-click)))



(defn main[]
  (js/console.log "Booting up")

  (build-menu! known-figures)
  (enable-run!)
  (set-figure! (nth known-figures 6))

  (regl/frame #(do
                 (regl/clear {:color [1, 1, 1, 1]
                              :depth 1 })
                 (when (and @*points @*projection)
                   (continuous-line {:points @*points
                                     :projection @*projection }))))
  )

(main)
