import * as squint_core from 'squint-cljs/core.js';
import * as str from 'squint-cljs/string.js';
var regl = createREGL(".gl-canvas");
var Tau = (Math.PI) * (2);
var _STAR_points = squint_core.atom(null);
var _STAR_projection = squint_core.atom(null);
var split_into_two = function (s) {
const temp__23828__auto__1 = s.indexOf(":");
if (squint_core.truth_(temp__23828__auto__1)) {
const pos2 = temp__23828__auto__1;
return [str.trim(s.substring(0, pos2)), str.trim(s.substring((pos2 + 1)))];;};;
};
var fig__GT_str = function (fig) {
return str.join(squint_core.mapv((function (p__6) {
const vec__14 = p__6;
const k5 = squint_core.nth(vec__14, 0, null);
const v6 = squint_core.nth(vec__14, 1, null);
return squint_core.str(k5, ": ", ((squint_core.truth_(squint_core.seq_QMARK_(v6))) ? (squint_core.apply(squint_core.str, v6)) : (squint_core.str(v6))), "\n");;
}), fig));
};
var parse_line_and_collect = function (accum, line) {
const temp__23828__auto__1 = str.trim(line);
if (squint_core.truth_(temp__23828__auto__1)) {
const s2 = temp__23828__auto__1;
const vec__36 = split_into_two(s2);
const k7 = squint_core.nth(vec__36, 0, null);
const v8 = squint_core.nth(vec__36, 1, null);
const G__79 = k7;
if (("name") === (G__79)) {
return squint_core.assoc(accum, "name", v8)} else {
if (("iterations") === (G__79)) {
return squint_core.assoc(accum, "iterations", squint_core.parse_long(v8))} else {
if (("angle") === (G__79)) {
return squint_core.assoc(accum, "angle", squint_core.parse_long(v8))} else {
if (("me") === (G__79)) {
return squint_core.assoc(accum, "me", squint_core.into([], v8))} else {
if ((null) === (G__79)) {
return accum} else {
if ("else") {
return squint_core.assoc(accum, k7, v8)} else {
return null}}}}}};;;;};;
};
var str__GT_fig = function (s) {
return squint_core.reduce(parse_line_and_collect, ({  }), str.split_lines(s));
};
var known_figures = [({ "name": "Fig 1.6 Quadratic Koch island", "angle": 90, "iterations": 3, "me": "F-F-F-F", "F": "F-F+F+FF-F-F+F" }), ({ "name": "Fig 1.9a", "angle": 90, "iterations": 3, "me": "F-F-F-F", "F": "FF-F-F-F-F-F+F" }), ({ "name": "Fig 1.9b", "angle": 90, "iterations": 4, "me": "F-F-F-F", "F": "FF-F-F-F-FF" }), ({ "name": "Fig 1.9c", "angle": 90, "iterations": 3, "me": ["F", "-", "F", "-", "F", "-", "F"], "F": "FF-F+F-F-FF" }), ({ "name": "Fig 1.10a Dragon curve", "angle": 90, "iterations": 12, "me": "L", "L": "L+R+", "R": "-L-R" }), ({ "name": "Fig 1.10b Sierpinski gasket", "angle": 60, "iterations": 7, "me": "L", "L": "R+L+R", "R": "L-R-L" }), ({ "name": "Fig 1.11a hex Gosper", "angle": 60, "iterations": 4, "me": "L", "L": "L+R++R-L--LL-R+", "R": "-L+RR++R+L--L-R" }), ({ "name": "Fig 1.11b generic Gosper", "angle": 90, "iterations": 2, "me": "R", "L": "LL-R-R+L+L-R-RL+R+LLR-L+R+LL+R-LR-R-L+L+RR-", "R": "+LL-R-R+L+LR+L-RR-L-R+LRR-L-RL+L+R-R-L+L+RR" })];
var rebase_0 = function (pts) {
const min_x1 = squint_core.apply(Math.min, squint_core.mapv(squint_core.first, pts));
const min_y2 = squint_core.apply(Math.min, squint_core.mapv(squint_core.second, pts));
return squint_core.mapv((function (p__8) {
const vec__36 = p__8;
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
var move = function (p__9, angle) {
const vec__14 = p__9;
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
const G__107 = squint_core.first(koch1);
switch (G__107) {case "F":
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
case "L":
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
case "R":
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
var load_figure_BANG_ = function (fig) {
return document.querySelector("textarea").value = fig__GT_str(fig);
;
};
var set_figure_BANG_ = function (fig) {
const iterations1 = squint_core.get(fig, "iterations", 3);
const angle2 = (Tau) * (squint_core.get(fig, "angle", 90)) * (1 / 360);
const k3 = materialize(get_koch(fig, iterations1), angle2);
squint_core.reset_BANG_(_STAR_points, k3);
squint_core.reset_BANG_(_STAR_projection, best_projection(k3));
return document.querySelector(".text").innerHTML = squint_core.str(squint_core.get(fig, "name"), ", ", iterations1, " iterations, ", squint_core.count(k3), " segments");
;;
};
var build_menu_BANG_ = function (figures) {
const root1 = document.querySelector(".menu");
for (let G__2 of squint_core.iterable(figures)) {
const f3 = G__2;
const b4 = document.createElement("button");
const on_click5 = (function (e) {
e.preventDefault();
load_figure_BANG_(f3);
return set_figure_BANG_(f3);
});
b4.type = "button";
b4.className = "outline";
b4.innerHTML = squint_core.get(f3, "name");
b4.addEventListener("click", on_click5);
root1.appendChild(b4)
}return null;;
};
var enable_run_BANG_ = function () {
const b1 = document.querySelector(".run");
const textarea2 = document.querySelector("textarea");
const on_click3 = (function (e) {
e.preventDefault();
return set_figure_BANG_(str__GT_fig(textarea2.value));
});
return b1.addEventListener("click", on_click3);;
};
var main = function () {
console.log("Booting up");
build_menu_BANG_(known_figures);
enable_run_BANG_();
set_figure_BANG_(squint_core.nth(known_figures, 6));
return regl.frame((function () {
regl.clear(({ "color": [1, 1, 1, 1], "depth": 1 }));
if (squint_core.truth_((() => {
const and__24249__auto__1 = squint_core.deref(_STAR_points);
if (squint_core.truth_(and__24249__auto__1)) {
return squint_core.deref(_STAR_projection)} else {
return and__24249__auto__1};
})())) {
return continuous_line(({ "points": squint_core.deref(_STAR_points), "projection": squint_core.deref(_STAR_projection) }));};;
}));
};
main();

export { continuous_line, frag, load_figure_BANG_, materialize, regl, padded_ortho_projection, split_into_two, _STAR_points, parse_line_and_collect, vert, get_koch, draw_triangle, rebase_0, best_projection, main, known_figures, build_menu_BANG_, enable_run_BANG_, move, koch_step, _STAR_projection, set_figure_BANG_, fig__GT_str, str__GT_fig, Tau }
