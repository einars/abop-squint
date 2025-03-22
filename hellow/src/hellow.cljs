
(def regl (js/createREGL ".gl-canvas"))

(def Tau (* js/Math.PI 2))
(def angle-90 (/ Tau 4))
(def angle-60 (/ Tau 6))


(def square-island {:me [:F :- :F :- :F :- :F]
                    :F [:F :- :F :+ :F :+ :F :F :- :F :- :F :+ :F]})
(def bobo {:name "Bobo"
           :me [:F :- :F :- :F :- :F]
           :F "FF-F-F-F-F-F+F"})

(def fig1-9b {:name "Fig 1.9b"
              :me [:F :- :F :- :F :- :F]
              :F "FF-F-F-F-FF"})

(def fig1-9c {:name "Fig 1.9c"
              :me [:F :- :F :- :F :- :F]
              :F "FF-F+F-F-FF"})

(def fig1-10a {:name "Fig 1.10a"
               :me [:F1]
               :F1 [:F1 :+ :FR :+]
               :FR [:- :F1 :- :FR]})


(def fig1-10b {:name "Fig 1.10b"
               :angle angle-60
               :me [:F1]
               :F1 [:FR :+ :F1 :+ :FR]
               :FR [:F1 :- :FR :- :F1]})

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
        :F1 (recur nkoch npos facing (conj accum npos))
        :FR (recur nkoch npos facing (conj accum npos))
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

(defn main[]
  (js/console.log "Booting up")
  (let [;[algo iterations] [fig1-10a 13]
        ;[algo iterations] [square-island 3]
        [algo iterations] [bobo 4]
        ;[algo iterations] [fig1-9b 4]
        ;[algo iterations] [fig1-9c 3]
        ;[algo iterations] [fig1-9c 4]
        ;[algo iterations] [fig1-10b 7]
        k (materialize (get-koch algo iterations) (:angle algo angle-90))

        projection (best-projection k)
        ]
    (regl/frame #(do
                   (regl/clear {:color [1, 1, 1, 1]
                                :depth 1 })
                   (continuous-line {:points k
                                     :projection projection })))
    (set! (.-innerHTML (js/document.querySelector ".text")) (str (:name algo) ", " iterations " iterācijas, " (count k) " segmenti"))
    ))

(main)
