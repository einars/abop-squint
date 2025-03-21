import * as squint_core from 'squint-cljs/core.js';
var regl = createREGL();
var frag = "\nprecision mediump float;\nuniform vec4 color;\nvoid main() {\n  gl_FragColor = color;\n}\n  ";
var vert = "\nprecision mediump float;\nattribute vec2 position;\nvoid main() {\n  gl_Position = vec4(position, 0, 1);\n}\n  ";
var draw_triangle = regl(({ "frag": frag, "vert": vert, "attributes": ({ "position": regl.buffer([[-2, -2], [4, -2], [4, 4]]) }), "uniforms": ({ "color": regl.prop("color") }), "count": 3 }));
var frame = function (frame) {
const time1 = squint_core.get(frame, "tick");
regl.clear(({ "color": [0, 0, 0, 0], "depth": 1 }));
return draw_triangle(({ "color": [Math.cos((time1) * (0.01)), Math.sin((time1) * (0.008)), Math.cos((time1) * (0.03)), 1] }));;
};
var main = function () {
console.log("Booting up");
return regl.frame(frame);
};
main();

export { regl, frag, vert, draw_triangle, frame, main }
