(ns abop.hellow
  (:require ["regl" :as regl]))

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

(defn draw-triangle []
  (regl/regl
    {:frag frag
     :vert vert
     :position [[-2 -2]
                [4 -2]
                [4 4] ]
     :uniforms (regl/prop "color")
     :count 3
     }))

(defn main[]
  (js/console.log "Booting up")
  (draw-triangle {
                  :color [13 170 55]
                  }))

(main)
