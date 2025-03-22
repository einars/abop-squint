(ns hellow)

(def regl (js/createREGL ".gl-canvas"))


(def square-island {:me [:F :- :F :- :F :- :F]
                    :F [:F :- :F :+ :F :+ :F :F :- :F :- :F :+ :F]})
(def bobo {:me [:F :- :F :- :F :- :F]
           :F "FF-F-F-F-F-F+F"})

(def fig1-9b {:me [:F :- :F :- :F :- :F]
              :F "FF-F-F-F-FF"})

(def fig1-9c {:me [:F :- :F :- :F :- :F]
              :F "FF-F+F-F-FF"})

(def fig1-10a {:me [:F1]
               :F1 [:F1 :+ :FR :+]
               :FR [:- :F1 :- :FR]})

(defn koch-step [koch]
  (loop [current (:me koch), accum []]
    (if-not current
      (assoc koch :me accum)
      (if-let [transf (get koch (first current))]
        (recur (next current) (apply conj accum transf))
        (recur (next current) (conj accum (first current)))))))



(defn move [[x y] facing]
  (condp = facing
    :up [x (inc y)]
    :dn [x (dec y)]
    :rt [(inc x) y]
    :lt [(dec x) y]))

(def rot-left 
  {:up :lt
   :lt :dn
   :dn :rt
   :rt :up})

(def rot-right
  {:up :rt
   :rt :dn
   :dn :lt
   :lt :up})

(defn scale-down [line]
  (let [min-x (apply min (map first line))
        max-x (apply max (map first line))
        min-y (apply min (map second line))
        max-y (apply max (map second line))
        scale (max 
                (- max-x min-x) 
                (- max-y min-y))
        scale (/ scale 2)
        ]
    (println (mapv (fn [[x y]] (list (/ x scale) (/ y scale))) line))
    (mapv (fn [[x y]] (list 
                        (* 0.95 (- (/ (- x min-x) scale) 1))
                        (* 0.95 (- (/ (- y min-y) scale) 1)))) line)
    ))


(defn materialize [koch]
  (println "materializing" (count (:me koch)))
  (loop [koch (:me koch), pos [0 0], facing :lt, accum [[0 0]]]
    (condp = (first koch)
      :F (recur (next koch) (move pos facing) facing (conj accum (move pos facing)))
      :F1 (recur (next koch) (move pos facing) facing (conj accum (move pos facing)))
      :FR (recur (next koch) (move pos facing) facing (conj accum (move pos facing)))
      :+ (recur (next koch) pos (get rot-right facing) accum)
      :- (recur (next koch) pos (get rot-left facing) accum)
      (scale-down accum))))


(def frag "
precision mediump float;
uniform vec4 color;
void main() {
  gl_FragColor = color;
}
  ")

(def vert "
precision mediump float;
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0, 1);
}
  ")

(def slow-single-line []
  (regl
    {:frag frag
     :vert vert
     :uniforms {:color [1 0 0 1 ]}
     :attributes {:position (regl/prop "points") }
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
  (regl/clear {:color [1, 1, 1, 1]
               :depth 1 })
  #_(slow-single-line {:points (materialize (get-koch square-island 3))})
  #_(slow-single-line {:points (materialize (get-koch bobo 4))})
  #_(slow-single-line {:points (materialize (get-koch fig1-9b 4))})
  #_(slow-single-line {:points (materialize (get-koch fig1-9c 4))})
  (slow-single-line {:points (materialize (get-koch fig1-10a 12))})

  #_(regl/frame frame))

(main)
