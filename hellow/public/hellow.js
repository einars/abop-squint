import * as squint_core from 'squint-cljs/core.js';
var regl = createREGL(".gl-canvas");
var square_island = ({ "me": ["F", "-", "F", "-", "F", "-", "F"], "F": ["F", "-", "F", "+", "F", "+", "F", "F", "-", "F", "-", "F", "+", "F"] });
var bobo = ({ "me": ["F", "-", "F", "-", "F", "-", "F"], "F": "FF-F-F-F-F-F+F" });
var fig1_9b = ({ "me": ["F", "-", "F", "-", "F", "-", "F"], "F": "FF-F-F-F-FF" });
var fig1_9c = ({ "me": ["F", "-", "F", "-", "F", "-", "F"], "F": "FF-F+F-F-FF" });
var fig1_10a = ({ "me": ["F1"], "F1": ["F1", "+", "FR", "+"], "FR": ["-", "F1", "-", "FR"] });
var koch_step = function (koch) {
let current1 = squint_core.get(koch, "me");
let accum2 = [];
while(true){
if (squint_core.not(current1)) {
return squint_core.assoc(koch, "me", accum2)} else {
const temp__23717__auto__3 = squint_core.get(koch, squint_core.first(current1));
if (squint_core.truth_(temp__23717__auto__3)) {
const transf4 = temp__23717__auto__3;
let G__5 = squint_core.next(current1);
let G__6 = squint_core.apply(squint_core.conj, accum2, transf4);
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
var move = function (p__709, facing) {
const vec__14 = p__709;
const x5 = squint_core.nth(vec__14, 0, null);
const y6 = squint_core.nth(vec__14, 1, null);
const pred__7107 = squint_core._EQ_;
const expr__7118 = facing;
if (squint_core.truth_(pred__7107("up", expr__7118))) {
return [x5, (y6 + 1)]} else {
if (squint_core.truth_(pred__7107("dn", expr__7118))) {
return [x5, (y6 - 1)]} else {
if (squint_core.truth_(pred__7107("rt", expr__7118))) {
return [(x5 + 1), y6]} else {
if (squint_core.truth_(pred__7107("lt", expr__7118))) {
return [(x5 - 1), y6]} else {
throw new IllegalArgumentException(squint_core.str("No matching clause: ", expr__7118))}}}};;;
};
var rot_left = ({ "up": "lt", "lt": "dn", "dn": "rt", "rt": "up" });
var rot_right = ({ "up": "rt", "rt": "dn", "dn": "lt", "lt": "up" });
var scale_down = function (line) {
const min_x1 = squint_core.apply(squint_core.min, squint_core.map(squint_core.first, line));
const max_x2 = squint_core.apply(squint_core.max, squint_core.map(squint_core.first, line));
const min_y3 = squint_core.apply(squint_core.min, squint_core.map(squint_core.second, line));
const max_y4 = squint_core.apply(squint_core.max, squint_core.map(squint_core.second, line));
const scale5 = squint_core.max((max_x2) - (min_x1), (max_y4) - (min_y3));
const scale6 = (scale5) / (2);
squint_core.println(squint_core.mapv((function (p__712) {
const vec__710 = p__712;
const x11 = squint_core.nth(vec__710, 0, null);
const y12 = squint_core.nth(vec__710, 1, null);
return squint_core.list((x11) / (scale6), (y12) / (scale6));;
}), line));
return squint_core.mapv((function (p__713) {
const vec__1316 = p__713;
const x17 = squint_core.nth(vec__1316, 0, null);
const y18 = squint_core.nth(vec__1316, 1, null);
return squint_core.list((0.95) * ((((x17) - (min_x1)) / (scale6)) - (1)), (0.95) * ((((y18) - (min_y3)) / (scale6)) - (1)));;
}), line);;
};
var materialize = function (koch) {
squint_core.println("materializing", squint_core.count(squint_core.get(koch, "me")));
let koch1 = squint_core.get(koch, "me");
let pos2 = [0, 0];
let facing3 = "lt";
let accum4 = [[0, 0]];
while(true){
const pred__7145 = squint_core._EQ_;
const expr__7156 = squint_core.first(koch1);
if (squint_core.truth_(pred__7145("F", expr__7156))) {
let G__7 = squint_core.next(koch1);
let G__8 = move(pos2, facing3);
let G__9 = facing3;
let G__10 = squint_core.conj(accum4, move(pos2, facing3));
koch1 = G__7;
pos2 = G__8;
facing3 = G__9;
accum4 = G__10;
continue;
} else {
if (squint_core.truth_(pred__7145("F1", expr__7156))) {
let G__11 = squint_core.next(koch1);
let G__12 = move(pos2, facing3);
let G__13 = facing3;
let G__14 = squint_core.conj(accum4, move(pos2, facing3));
koch1 = G__11;
pos2 = G__12;
facing3 = G__13;
accum4 = G__14;
continue;
} else {
if (squint_core.truth_(pred__7145("FR", expr__7156))) {
let G__15 = squint_core.next(koch1);
let G__16 = move(pos2, facing3);
let G__17 = facing3;
let G__18 = squint_core.conj(accum4, move(pos2, facing3));
koch1 = G__15;
pos2 = G__16;
facing3 = G__17;
accum4 = G__18;
continue;
} else {
if (squint_core.truth_(pred__7145("+", expr__7156))) {
let G__19 = squint_core.next(koch1);
let G__20 = pos2;
let G__21 = squint_core.get(rot_right, facing3);
let G__22 = accum4;
koch1 = G__19;
pos2 = G__20;
facing3 = G__21;
accum4 = G__22;
continue;
} else {
if (squint_core.truth_(pred__7145("-", expr__7156))) {
let G__23 = squint_core.next(koch1);
let G__24 = pos2;
let G__25 = squint_core.get(rot_left, facing3);
let G__26 = accum4;
koch1 = G__23;
pos2 = G__24;
facing3 = G__25;
accum4 = G__26;
continue;
} else {
return scale_down(accum4)}}}}};;;break;
}
;
};
var frag = "\nprecision mediump float;\nuniform vec4 color;\nvoid main() {\n  gl_FragColor = color;\n}\n  ";
var vert = "\nprecision mediump float;\nattribute vec2 position;\nvoid main() {\n  gl_Position = vec4(position, 0, 1);\n}\n  ";
var slow_single_line = regl(({ "frag": frag, "vert": vert, "uniforms": ({ "color": [1, 0, 0, 1] }), "attributes": ({ "position": regl.prop("points") }), "elements": (function (ctx, props, batchid) {
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
regl.clear(({ "color": [1, 1, 1, 1], "depth": 1 }));
return slow_single_line(({ "points": materialize(get_koch(fig1_10a, 12)) }));
};
main();

export { frag, materialize, regl, square_island, fig1_10a, vert, get_koch, draw_triangle, rot_left, main, fig1_9b, bobo, move, rot_right, koch_step, fig1_9c, scale_down, slow_single_line }
