import * as squint_core from 'squint-cljs/core.js';
var regl = createREGL(".gl-canvas");
var Tau = (Math.PI) * (2);
var angle_90 = (Tau) / (4);
var angle_60 = (Tau) / (6);
var square_island = ({ "me": ["F", "-", "F", "-", "F", "-", "F"], "F": ["F", "-", "F", "+", "F", "+", "F", "F", "-", "F", "-", "F", "+", "F"] });
var bobo = ({ "name": "Bobo", "me": ["F", "-", "F", "-", "F", "-", "F"], "F": "FF-F-F-F-F-F+F" });
var fig1_9b = ({ "name": "Fig 1.9b", "me": ["F", "-", "F", "-", "F", "-", "F"], "F": "FF-F-F-F-FF" });
var fig1_9c = ({ "name": "Fig 1.9c", "me": ["F", "-", "F", "-", "F", "-", "F"], "F": "FF-F+F-F-FF" });
var fig1_10a = ({ "name": "Fig 1.10a", "me": ["F1"], "F1": ["F1", "+", "FR", "+"], "FR": ["-", "F1", "-", "FR"] });
var fig1_10b = ({ "name": "Fig 1.10b", "angle": angle_60, "me": ["F1"], "F1": ["FR", "+", "F1", "+", "FR"], "FR": ["F1", "-", "FR", "-", "F1"] });
var rebase_0 = function (pts) {
const min_x1 = squint_core.apply(Math.min, squint_core.mapv(squint_core.first, pts));
const min_y2 = squint_core.apply(Math.min, squint_core.mapv(squint_core.second, pts));
return squint_core.mapv((function (p__1148) {
const vec__36 = p__1148;
const x7 = squint_core.nth(vec__36, 0, null);
const y8 = squint_core.nth(vec__36, 1, null);
return [(x7) - (min_x1), (y8) - (min_y2)];;
}), pts);;
};
var koch_step = function (koch) {
let current1 = squint_core.get(koch, "me");
let accum2 = [];
while(true){
if (squint_core.not(current1)) {
return squint_core.assoc(koch, "me", accum2)} else {
const temp__23717__auto__3 = squint_core.get(koch, squint_core.first(current1));
if (squint_core.truth_(temp__23717__auto__3)) {
const replacement4 = temp__23717__auto__3;
let G__5 = squint_core.next(current1);
let G__6 = squint_core.into(accum2, replacement4);
current1 = G__5;
accum2 = G__6;
continue;
;} else {
let G__7 = squint_core.next(current1);
let G__8 = squint_core.conj(accum2, squint_core.first(current1));
current1 = G__7;
accum2 = G__8;
continue;
};};;break;
}
;
};
var move = function (p__1149, angle) {
const vec__14 = p__1149;
const x5 = squint_core.nth(vec__14, 0, null);
const y6 = squint_core.nth(vec__14, 1, null);
return [(x5) + (Math.cos(angle)), (y6) + (Math.sin(angle))];;
};
var materialize = function (koch, turn_angle) {
let koch1 = squint_core.get(koch, "me");
let pos2 = [0, 0];
let facing3 = 0;
let accum4 = [[0, 0]];
while(true){
const npos5 = move(pos2, facing3);
const nkoch6 = squint_core.next(koch1);
const G__11507 = squint_core.first(koch1);
switch (G__11507) {case "F":
let G__9 = nkoch6;
let G__10 = npos5;
let G__11 = facing3;
let G__12 = squint_core.conj(accum4, npos5);
koch1 = G__9;
pos2 = G__10;
facing3 = G__11;
accum4 = G__12;
continue;

break;
case "F1":
let G__13 = nkoch6;
let G__14 = npos5;
let G__15 = facing3;
let G__16 = squint_core.conj(accum4, npos5);
koch1 = G__13;
pos2 = G__14;
facing3 = G__15;
accum4 = G__16;
continue;

break;
case "FR":
let G__17 = nkoch6;
let G__18 = npos5;
let G__19 = facing3;
let G__20 = squint_core.conj(accum4, npos5);
koch1 = G__17;
pos2 = G__18;
facing3 = G__19;
accum4 = G__20;
continue;

break;
case "+":
let G__21 = nkoch6;
let G__22 = pos2;
let G__23 = (facing3) + (turn_angle);
let G__24 = accum4;
koch1 = G__21;
pos2 = G__22;
facing3 = G__23;
accum4 = G__24;
continue;

break;
case "-":
let G__25 = nkoch6;
let G__26 = pos2;
let G__27 = (facing3) - (turn_angle);
let G__28 = accum4;
koch1 = G__25;
pos2 = G__26;
facing3 = G__27;
accum4 = G__28;
continue;

break;
default:
return rebase_0(accum4)};;;;break;
}
;
};
var padded_ortho_projection = function (w, h) {
const m1 = mat4.create();
const padding2 = 5;
mat4.ortho(m1, -padding2, (padding2) + (w), -padding2, (padding2) + (h), -10, 10);
return m1;;
};
var best_projection = function (pts) {
const max_x1 = squint_core.apply(Math.max, squint_core.mapv(squint_core.first, pts));
const max_y2 = squint_core.apply(Math.max, squint_core.mapv(squint_core.second, pts));
const max3 = Math.max(max_x1, max_y2);
return padded_ortho_projection(max3, max3);;
};
var frag = "\nprecision mediump float;\nuniform vec4 color;\nvoid main() {\n  gl_FragColor = color;\n}\n  ";
var vert = "\nprecision mediump float;\nuniform mat4 projection;\nattribute vec2 position;\nvoid main() {\n  gl_Position = projection * vec4(position, 0, 1);\n}\n  ";
var continuous_line = regl(({ "frag": frag, "vert": vert, "uniforms": ({ "color": [1, 0, 0, 1], "projection": regl.prop("projection") }), "attributes": ({ "position": regl.prop("points") }), "elements": (function (ctx, props, batchid) {
return squint_core.mapv((function (_PERCENT_1) {
return squint_core.list(_PERCENT_1, (_PERCENT_1 + 1));
}), squint_core.range((squint_core.count(squint_core.get(props, "points")) - 1)));
}) }));
var get_koch = function (rules, generation) {
return squint_core.nth(squint_core.iterate(koch_step, rules), generation);
};
var draw_triangle = regl(({ "frag": frag, "vert": vert, "attributes": ({ "position": regl.buffer([[-2, -2], [4, -2], [4, 4]]) }), "uniforms": ({ "color": regl.prop("color") }), "count": 3 }));
var main = function () {
console.log("Booting up");
const vec__14 = [bobo, 4];
const algo5 = squint_core.nth(vec__14, 0, null);
const iterations6 = squint_core.nth(vec__14, 1, null);
const k7 = materialize(get_koch(algo5, iterations6), squint_core.get(algo5, "angle", angle_90));
const projection8 = best_projection(k7);
regl.frame((function () {
regl.clear(({ "color": [1, 1, 1, 1], "depth": 1 }));
return continuous_line(({ "points": k7, "projection": projection8 }));;
}));
return document.querySelector(".text").innerHTML = squint_core.str(squint_core.get(algo5, "name"), ", ", iterations6, " iterācijas, ", squint_core.count(k7), " segmenti");
;;
};
main();

export { continuous_line, frag, materialize, regl, padded_ortho_projection, square_island, fig1_10a, angle_90, vert, get_koch, draw_triangle, angle_60, rebase_0, best_projection, main, fig1_9b, fig1_10b, bobo, move, koch_step, fig1_9c, Tau }
