(ns hellow)

(def regl (js/createREGL))

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

(def draw-triangle
  (regl
    {:frag frag
     :vert vert
     :attributes{
                 :position (regl/buffer [[-2 -2]
                                         [4 -2]
                                         [4 4] ])
                 }
     :uniforms {:color (regl/prop "color")
                }
     :count 3
     }))

(defn frame[frame]
  (let [time (:tick frame)]
    (regl/clear {
                 :color [0, 0, 0, 0]
                 :depth 1
                 })
    (draw-triangle {
                    :color [(js/Math.cos (* time 0.01))
                            (js/Math.sin (* time 0.008))
                            (js/Math.cos (* time 0.03))
                            1]
                    })))

(defn main[]
  (js/console.log "Booting up")

  (regl/frame frame))

(main)
