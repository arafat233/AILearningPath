import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch11 = "Exploring Some Geometric Themes";
const ch12 = "Tales by Dots and Lines";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"8", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math8_ch11_ap_q1","math8_ch11_angles_polygons","Sum of interior angles of n-sided polygon:",[c("(n−2)×180°"),m("n×180"),g("360"),e("Random")],"Formula.",["Standard formula."],"(n-2)×180.","medium",ch11),
  Q("math8_ch11_ap_q2","math8_ch11_angles_polygons","Pentagon (5 sides): sum?",[c("540°"),m("180°"),g("360°"),e("720°")],"(5−2)×180.",["3×180=540."],"Apply formula.","medium",ch11),
  Q("math8_ch11_ap_q3","math8_ch11_angles_polygons","Hexagon (6 sides): sum?",[c("720°"),m("540°"),g("360°"),e("900°")],"(6−2)×180.",["4×180=720."],"Formula.","medium",ch11),
  Q("math8_ch11_ap_q4","math8_ch11_angles_polygons","Each angle of regular pentagon:",[c("108°"),m("90°"),g("120°"),e("60°")],"540/5.",["540/5=108."],"Sum/n.","hard",ch11),
  Q("math8_ch11_ap_q5","math8_ch11_angles_polygons","Each angle of regular hexagon:",[c("120°"),m("108°"),g("60°"),e("90°")],"720/6.",["720/6=120."],"Sum/n.","hard",ch11),
  Q("math8_ch11_ap_q6","math8_ch11_angles_polygons","Triangle sum:",[c("180°"),m("360°"),g("90°"),e("270°")],"Standard.",["(3-2)×180=180."],"180.","easy",ch11),
  Q("math8_ch11_ap_q7","math8_ch11_angles_polygons","Quadrilateral sum:",[c("360°"),m("180°"),g("540°"),e("Random")],"(4-2)×180.",["360°."],"360°.","easy",ch11),
  Q("math8_ch11_ap_q8","math8_ch11_angles_polygons","Exterior angles of any polygon sum to:",[c("360°"),m("180°"),g("720°"),e("Random")],"Theorem.",["Sum of exterior angles always 360°."],"360°.","hard",ch11),
  Q("math8_ch11_pt_q1","math8_ch11_polygons_types","3-sided polygon = ?",[c("Triangle"),m("Quadrilateral"),g("Pentagon"),e("Random")],"3 = triangle.",["3 sides = triangle."],"3 = triangle.","easy",ch11),
  Q("math8_ch11_pt_q2","math8_ch11_polygons_types","4-sided polygon = ?",[c("Quadrilateral"),m("Triangle"),g("Pentagon"),e("Random")],"4 = quadrilateral.",["4 sides."],"4 = quad.","easy",ch11),
  Q("math8_ch11_pt_q3","math8_ch11_polygons_types","5 = pentagon, 6 = ?",[c("Hexagon"),m("Heptagon"),g("Septagon"),e("Random")],"Greek.",["Hexa = 6."],"Hexagon.","medium",ch11),
  Q("math8_ch11_pt_q4","math8_ch11_polygons_types","7-sided polygon:",[c("Heptagon"),m("Hexagon"),g("Octagon"),e("Random")],"Hepta = 7.",["Heptagon."],"Heptagon.","hard",ch11),
  Q("math8_ch11_pt_q5","math8_ch11_polygons_types","Octagon has __ sides.",[c("8"),m("7"),g("6"),e("9")],"Octa.",["8 sides."],"8.","easy",ch11),
  Q("math8_ch11_pt_q6","math8_ch11_polygons_types","9-sided polygon:",[c("Nonagon"),m("Decagon"),g("Octagon"),e("Random")],"Nona.",["9 = nonagon."],"Nonagon.","hard",ch11),
  Q("math8_ch11_pt_q7","math8_ch11_polygons_types","Decagon has __ sides.",[c("10"),m("9"),g("11"),e("12")],"Deca.",["10."],"10.","easy",ch11),
  Q("math8_ch11_pt_q8","math8_ch11_polygons_types","Regular polygon has…",[c("Equal sides AND equal angles"),e("Just sides equal"),m("Just angles equal"),g("Random")],"Definition.",["Both equal."],"Both equal.","medium",ch11),
  Q("math8_ch11_sr_q1","math8_ch11_symmetry_review","Square: lines of symmetry?",[c("4"),m("2"),g("8"),e("1")],"V+H+2 diagonals.",["4."],"4.","medium",ch11),
  Q("math8_ch11_sr_q2","math8_ch11_symmetry_review","Rectangle: lines of symmetry?",[c("2"),m("4"),g("1"),e("0")],"V+H mid.",["2."],"2.","medium",ch11),
  Q("math8_ch11_sr_q3","math8_ch11_symmetry_review","Circle: lines of symmetry?",[c("Infinite"),m("4"),g("8"),e("None")],"Any diameter.",["Infinite."],"Infinite.","medium",ch11),
  Q("math8_ch11_sr_q4","math8_ch11_symmetry_review","Equilateral triangle rotational order:",[c("3"),m("1"),g("6"),e("Inf")],"120° rotations.",["360/120=3."],"3.","medium",ch11),
  Q("math8_ch11_sr_q5","math8_ch11_symmetry_review","Letter 'H' has…",[c("Both line and point symmetry"),e("Only line"),m("Only point"),g("None")],"Multiple types.",["V+H lines, 180° rotation."],"Both.","hard",ch11),
  Q("math8_ch11_sr_q6","math8_ch11_symmetry_review","Square rotational order:",[c("4"),m("2"),g("8"),e("1")],"90° rotations.",["360/90=4."],"4.","medium",ch11),
  Q("math8_ch11_sr_q7","math8_ch11_symmetry_review","Rectangle rotational order:",[c("2"),m("4"),g("1"),e("Inf")],"180° matches.",["180°."],"2.","hard",ch11),
  Q("math8_ch11_sr_q8","math8_ch11_symmetry_review","Letter 'F' has __ symmetries:",[c("None"),m("1 line"),g("2 lines"),e("Rotational")],"F not symmetric.",["No matching fold."],"None.","medium",ch11),
  Q("math8_ch11_tr_q1","math8_ch11_transformations","Translation = ?",[c("Sliding"),e("Flipping"),m("Rotating"),g("Resizing")],"Slide.",["Move all points same amount."],"Slide.","easy",ch11),
  Q("math8_ch11_tr_q2","math8_ch11_transformations","Reflection = ?",[c("Flipping"),e("Sliding"),m("Rotating"),g("Resizing")],"Mirror.",["Flip across line."],"Flip.","easy",ch11),
  Q("math8_ch11_tr_q3","math8_ch11_transformations","Rotation = ?",[c("Turning around a point"),e("Sliding"),m("Flipping"),g("Resizing")],"Turn.",["Around fixed center."],"Turn.","easy",ch11),
  Q("math8_ch11_tr_q4","math8_ch11_transformations","Which transformations preserve size?",[c("Translation, rotation, reflection"),e("Scaling"),m("Just translation"),g("None")],"Rigid motions.",["Size unchanged."],"Rigid 3.","medium",ch11),
  Q("math8_ch11_tr_q5","math8_ch11_transformations","Scaling changes…",[c("Size"),e("Shape"),m("Position only"),g("Nothing")],"Size.",["Bigger or smaller."],"Size.","medium",ch11),
  Q("math8_ch11_tr_q6","math8_ch11_transformations","Reflection produces…",[c("Mirror image"),e("Same image"),m("Bigger"),g("Random")],"Mirror.",["Mirror flipped."],"Mirror.","medium",ch11),
  Q("math8_ch11_tr_q7","math8_ch11_transformations","Translation preserves…",[c("Shape, size, orientation"),e("Just shape"),m("Size only"),g("Nothing")],"Everything except position.",["Just slides."],"All but position.","medium",ch11),
  Q("math8_ch11_tr_q8","math8_ch11_transformations","Spinning a top is a…",[c("Rotation"),e("Translation"),m("Reflection"),g("Random")],"Spinning = rotating.",["Around axis."],"Rotation.","easy",ch11),

  Q("math8_ch12_gi_q1","math8_ch12_graph_theory_intro","Graph (network) has…",[c("Vertices and edges"),e("Just lines"),m("Charts"),g("Random")],"Definition.",["Dots + lines."],"V + E.","medium",ch12),
  Q("math8_ch12_gi_q2","math8_ch12_graph_theory_intro","Vertices are…",[c("Dots / points"),e("Lines"),m("Random"),g("Curves")],"Nodes.",["Points in graph."],"Dots.","easy",ch12),
  Q("math8_ch12_gi_q3","math8_ch12_graph_theory_intro","Edges are…",[c("Connections between vertices"),e("Dots"),m("Random"),g("Curves only")],"Lines.",["Lines connecting dots."],"Lines.","easy",ch12),
  Q("math8_ch12_gi_q4","math8_ch12_graph_theory_intro","Friendship graph:",[c("People = vertices, friendships = edges"),e("Random"),m("Just friends"),g("None")],"Example.",["Model real relations."],"Real example.","medium",ch12),
  Q("math8_ch12_gi_q5","math8_ch12_graph_theory_intro","Degree of a vertex = ?",[c("Number of edges connected"),e("Distance"),m("Random"),g("Color")],"Edge count.",["How many edges meet at vertex."],"Edge count.","hard",ch12),
  Q("math8_ch12_gi_q6","math8_ch12_graph_theory_intro","Connected graph: all vertices…",[c("Reachable via edges"),e("Same color"),m("Isolated"),g("Random")],"Path exists.",["Path between any two."],"All reachable.","hard",ch12),
  Q("math8_ch12_gi_q7","math8_ch12_graph_theory_intro","Graph vs chart:",[c("Different things"),e("Same"),m("Random"),g("Chart includes graph")],"Different.",["Graph = vertices/edges. Chart = bar/pie."],"Different.","medium",ch12),
  Q("math8_ch12_gi_q8","math8_ch12_graph_theory_intro","Used in maps, networks, family trees. Example:",[c("Internet, cities"),e("Random"),m("Just math"),g("Cannot")],"Real applications.",["Network = graph."],"Networks.","easy",ch12),
  Q("math8_ch12_pa_q1","math8_ch12_paths","Path is…",[c("Sequence of edges"),e("Random"),m("Just one edge"),g("Vertices only")],"Definition.",["Connected sequence."],"Sequence.","medium",ch12),
  Q("math8_ch12_pa_q2","math8_ch12_paths","Simple path:",[c("No repeated vertices"),e("Repeated"),m("Random"),g("Any")],"Simple.",["No revisits."],"No repeats.","hard",ch12),
  Q("math8_ch12_pa_q3","math8_ch12_paths","Cycle is a path…",[c("That returns to start"),e("Random"),m("Open"),g("None")],"Closed.",["End at start."],"Closed loop.","hard",ch12),
  Q("math8_ch12_pa_q4","math8_ch12_paths","Length of path = ?",[c("Number of edges"),e("Vertices"),m("Random"),g("Distance")],"Edge count.",["Edges in path."],"Edges.","medium",ch12),
  Q("math8_ch12_pa_q5","math8_ch12_paths","From A to B via C is a path of length…",[c("2"),m("1"),g("3"),e("0")],"2 edges.",["A-C, C-B."],"2.","medium",ch12),
  Q("math8_ch12_pa_q6","math8_ch12_paths","Shortest path = ?",[c("Path with fewest edges"),e("Most edges"),m("Random"),g("Longest")],"Minimum.",["Optimization."],"Minimum.","medium",ch12),
  Q("math8_ch12_pa_q7","math8_ch12_paths","Routing in maps uses…",[c("Shortest path algorithms"),e("Random"),m("Long paths"),g("None")],"Path optimization.",["GPS = path."],"Path optimize.","medium",ch12),
  Q("math8_ch12_pa_q8","math8_ch12_paths","Disconnected graphs have…",[c("No path between some vertices"),e("Single path"),m("All paths"),g("None")],"Components.",["Some unreachable."],"Disconnected.","hard",ch12),
  Q("math8_ch12_eu_q1","math8_ch12_euler","Eulerian circuit visits…",[c("Each edge exactly once, returns to start"),e("Each vertex"),m("Random"),g("Some edges")],"Definition.",["All edges, once."],"All edges once.","hard",ch12),
  Q("math8_ch12_eu_q2","math8_ch12_euler","Euler path requires…",[c("All vertices even degree OR exactly 2 odd"),e("Random"),m("All odd"),g("None odd")],"Theorem.",["Degree condition."],"Even/2 odd.","hard",ch12),
  Q("math8_ch12_eu_q3","math8_ch12_euler","Königsberg bridges famous problem:",[c("No Euler path"),e("Has Euler"),m("Random"),g("Cannot solve")],"4 vertices, all odd.",["More than 2 odd → no path."],"No.","hard",ch12),
  Q("math8_ch12_eu_q4","math8_ch12_euler","If all vertices have even degree, graph has…",[c("Euler circuit"),e("No path"),m("Random"),g("Tree")],"Closed Euler.",["All even = Euler circuit."],"All even.","hard",ch12),
  Q("math8_ch12_eu_q5","math8_ch12_euler","Even degree means…",[c("Even number of edges at vertex"),e("Random"),m("Just 2"),g("Odd")],"Definition.",["Edge count is even."],"Even edges.","medium",ch12),
  Q("math8_ch12_eu_q6","math8_ch12_euler","Euler used graph theory to solve…",[c("Königsberg bridges"),e("Map coloring"),m("Pyramids"),g("Random")],"Classic.",["Famous puzzle."],"Bridges.","hard",ch12),
  Q("math8_ch12_eu_q7","math8_ch12_euler","Eulerian path uses each edge…",[c("Once"),e("Twice"),m("Random"),g("Skips")],"Once.",["Use each once."],"Once.","medium",ch12),
  Q("math8_ch12_eu_q8","math8_ch12_euler","Euler's theorem applies to:",[c("Connected graphs"),e("Disconnected"),m("Random"),g("All")],"Connected.",["Must be connected."],"Connected.","medium",ch12),
  Q("math8_ch12_tr_q1","math8_ch12_trees","Tree is a graph with…",[c("No cycles, all connected"),e("Many cycles"),m("Random"),g("Disconnected")],"Definition.",["Connected + acyclic."],"Acyclic + connected.","medium",ch12),
  Q("math8_ch12_tr_q2","math8_ch12_trees","Family tree example:",[c("Tree (no cycles)"),e("Cycle"),m("Random"),g("None")],"Hierarchical.",["No cycles in family."],"Yes.","easy",ch12),
  Q("math8_ch12_tr_q3","math8_ch12_trees","Tree with n vertices has __ edges.",[c("n−1"),m("n"),g("n²"),e("Random")],"Tree property.",["n-1 always."],"n−1.","hard",ch12),
  Q("math8_ch12_tr_q4","math8_ch12_trees","Tree examples in real life:",[c("Family tree, organization chart"),e("Random"),m("Internet"),g("Cycles")],"Hierarchical.",["Linear hierarchy."],"Family/org.","easy",ch12),
  Q("math8_ch12_tr_q5","math8_ch12_trees","Adding any edge to tree creates…",[c("Cycle"),e("New tree"),m("Random"),g("Disconnect")],"By definition.",["Tree minimal."],"Cycle.","hard",ch12),
  Q("math8_ch12_tr_q6","math8_ch12_trees","Removing any edge from tree:",[c("Disconnects graph"),e("Stays tree"),m("Random"),g("Creates cycle")],"Critical edges.",["Each edge essential."],"Disconnects.","hard",ch12),
  Q("math8_ch12_tr_q7","math8_ch12_trees","Trees are used in…",[c("File systems, decision trees"),e("Random"),m("Just family"),g("None")],"Many applications.",["Computer science, biology, etc."],"CS + bio.","medium",ch12),
  Q("math8_ch12_tr_q8","math8_ch12_trees","Root of tree:",[c("Top vertex (in rooted tree)"),e("Bottom"),m("Random"),g("Any")],"Special vertex.",["Starting point."],"Root.","medium",ch12),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 8 Math v2 questions (Ch11-12).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
