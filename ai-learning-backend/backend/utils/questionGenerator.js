import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const save = (name, data) => {
  const dir = path.join(__dirname, "../../data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), JSON.stringify(data, null, 2));
  console.log(`✅ ${name} — ${data.length} questions`);
};

const diff = (i, total) => i < total*0.35 ? "easy" : i < total*0.7 ? "medium" : "hard";
const ds   = (d) => d==="easy" ? 0.2+Math.random()*0.2 : d==="medium" ? 0.45+Math.random()*0.25 : 0.72+Math.random()*0.25;
const gcd  = (a, b) => b===0 ? a : gcd(b, a%b);
const rand = (min, max) => Math.floor(Math.random()*(max-min+1))+min;

// ── 1. QUADRATIC EQUATIONS ──────────────────────────────
const quadratic = () => {
  const qs = [];
  for (let i=0; i<400; i++) {
    const x1=rand(1,9), x2=rand(1,9), b=-(x1+x2), c=x1*x2, d=diff(i,400);
    qs.push({ topic:"Quadratic Equations", difficulty:d, difficultyScore:ds(d), expectedTime:d==="easy"?18:d==="medium"?28:45,
      questionText:`Solve: x² ${b>=0?"+":""}${b}x ${c>=0?"+":""}${c} = 0`,
      options:[{text:`x = ${x1}, ${x2}`,type:"correct",logicTag:"correct_factorization"},{text:`x = ${x1+1}, ${x2}`,type:"concept_error",logicTag:"wrong_factor"},{text:`x = ${-x1}, ${-x2}`,type:"calculation_error",logicTag:"sign_flip"},{text:`x = ${x1}`,type:"partial_logic",logicTag:"one_root_only"}],
      solutionSteps:[`(x - ${x1})(x - ${x2}) = 0`,`x = ${x1} or x = ${x2}`],
      shortcut:"Find two numbers: multiply to c, add to b (with sign)." });
  }
  for (let i=0; i<100; i++) {
    const b=rand(1,8), c=b*b+rand(1,5);
    qs.push({ topic:"Quadratic Equations", difficulty:"medium", difficultyScore:0.6, expectedTime:25,
      questionText:`Nature of roots: x² + ${b}x + ${c} = 0`,
      options:[{text:"No real roots",type:"correct",logicTag:"D_negative"},{text:"Two equal roots",type:"concept_error",logicTag:"D_zero"},{text:"Two distinct roots",type:"calculation_error",logicTag:"D_positive"},{text:"Cannot determine",type:"partial_logic",logicTag:"incomplete"}],
      solutionSteps:[`D = ${b}² - 4(${c}) = ${b*b-4*c}`,"Since D < 0 → no real roots"],
      shortcut:"D<0=no real roots, D=0=equal roots, D>0=two roots" });
  }
  return qs;
};

// ── 2. LINEAR EQUATIONS ─────────────────────────────────
const linear = () => {
  const qs = [];
  for (let i=0; i<350; i++) {
    const x=rand(1,15), b=rand(1,10), c=2*x+b, d=diff(i,350);
    qs.push({ topic:"Linear Equations", difficulty:d, difficultyScore:ds(d), expectedTime:18,
      questionText:`Solve: 2x + ${b} = ${c}`,
      options:[{text:`x = ${x}`,type:"correct",logicTag:"correct"},{text:`x = ${x+b}`,type:"concept_error",logicTag:"added_instead"},{text:`x = ${c/2}`,type:"calculation_error",logicTag:"forgot_subtract"},{text:`x = ${2*x}`,type:"partial_logic",logicTag:"no_divide"}],
      solutionSteps:[`2x = ${c} - ${b} = ${c-b}`,`x = ${(c-b)/2}`],
      shortcut:"Move constants right (flip sign), then divide by coefficient." });
  }
  return qs;
};

// ── 3. REAL NUMBERS ─────────────────────────────────────
const realNumbers = () => {
  const pairs=[[12,18],[15,25],[8,12],[36,48],[24,36],[14,21],[16,24],[30,45],[18,27],[20,30]];
  return pairs.flatMap(([a,b]) => {
    const h=gcd(a,b), l=(a*b)/h;
    return [
      { topic:"Real Numbers", difficulty:"easy", difficultyScore:0.25, expectedTime:20,
        questionText:`Find HCF of ${a} and ${b}`,
        options:[{text:`${h}`,type:"correct"},{text:`${l}`,type:"concept_error",logicTag:"gave_lcm"},{text:`${h+1}`,type:"calculation_error"},{text:`${a*b}`,type:"partial_logic"}],
        solutionSteps:[`Prime factorize ${a} and ${b}`,`HCF = ${h}`], shortcut:`HCF × LCM = ${a} × ${b} = ${a*b}` },
      { topic:"Real Numbers", difficulty:"medium", difficultyScore:0.5, expectedTime:25,
        questionText:`Find LCM of ${a} and ${b}`,
        options:[{text:`${l}`,type:"correct"},{text:`${h}`,type:"concept_error",logicTag:"gave_hcf"},{text:`${a*b}`,type:"calculation_error"},{text:`${l+a}`,type:"partial_logic"}],
        solutionSteps:[`LCM = (${a} × ${b}) / HCF = ${a*b} / ${h} = ${l}`], shortcut:"LCM = (a × b) / HCF" },
      { topic:"Real Numbers", difficulty:"hard", difficultyScore:0.78, expectedTime:35,
        questionText:`If HCF(${a}, ${b}) = ${h}, find LCM(${a}, ${b})`,
        options:[{text:`${l}`,type:"correct"},{text:`${a*b}`,type:"concept_error"},{text:`${l-h}`,type:"calculation_error"},{text:`${h*2}`,type:"partial_logic"}],
        solutionSteps:[`HCF × LCM = ${a} × ${b}`,`LCM = ${a*b} / ${h} = ${l}`], shortcut:"Always: HCF × LCM = product of numbers" },
    ];
  });
};

// ── 4. POLYNOMIALS ──────────────────────────────────────
const polynomials = () => {
  const qs = [];
  for (let i=0; i<200; i++) {
    const r=rand(1,8), d=diff(i,200);
    qs.push({ topic:"Polynomials", difficulty:d, difficultyScore:ds(d), expectedTime:20,
      questionText:`If p(x) = x² - ${2*r}x + ${r*r}, find the zero`,
      options:[{text:`${r}`,type:"correct"},{text:`${r+1}`,type:"concept_error"},{text:`${-r}`,type:"calculation_error"},{text:"0",type:"partial_logic"}],
      solutionSteps:[`p(x) = (x - ${r})²`,`Zero: x = ${r}`],
      shortcut:"If p(a)=0 then a is a zero — substitute and check." });
  }
  for (let i=0; i<100; i++) {
    const a=rand(1,5), b=rand(1,8);
    qs.push({ topic:"Polynomials", difficulty:"medium", difficultyScore:0.55, expectedTime:25,
      questionText:`For polynomial ax²+bx+c with zeroes α,β: product of zeroes = ?`,
      options:[{text:"c/a",type:"correct",logicTag:"product_formula"},{text:"-b/a",type:"concept_error",logicTag:"sum_formula"},{text:"b/a",type:"calculation_error"},{text:"-c/a",type:"partial_logic"}],
      solutionSteps:["Product of zeroes = c/a","Sum of zeroes = -b/a"],
      shortcut:"Sum = -b/a, Product = c/a — memorise both." });
  }
  return qs;
};

// ── 5. ARITHMETIC PROGRESSIONS ─────────────────────────
const ap = () => {
  const qs = [];
  for (let i=0; i<250; i++) {
    const a=rand(1,10), d=rand(1,5), n=rand(3,15), an=a+(n-1)*d, Sn=(n*(2*a+(n-1)*d))/2, diff_=diff(i,250);
    qs.push({ topic:"Arithmetic Progressions", difficulty:diff_, difficultyScore:ds(diff_), expectedTime:22,
      questionText:`AP: a=${a}, d=${d}. Find ${n}th term`,
      options:[{text:`${an}`,type:"correct"},{text:`${a+n*d}`,type:"concept_error",logicTag:"used_n_not_n_minus_1"},{text:`${an+d}`,type:"calculation_error"},{text:`${Sn}`,type:"partial_logic",logicTag:"gave_sum"}],
      solutionSteps:[`an = a + (n-1)d = ${a} + (${n}-1)(${d}) = ${an}`],
      shortcut:"an = a + (n-1)d — remember (n-1) not n!" });
  }
  for (let i=0; i<100; i++) {
    const a=rand(1,10), d=rand(1,5), n=rand(4,12), Sn=(n*(2*a+(n-1)*d))/2;
    qs.push({ topic:"Arithmetic Progressions", difficulty:"medium", difficultyScore:0.58, expectedTime:30,
      questionText:`AP: a=${a}, d=${d}, n=${n}. Find sum Sn`,
      options:[{text:`${Sn}`,type:"correct"},{text:`${Sn+d}`,type:"calculation_error"},{text:`${n*(a+(n-1)*d)}`,type:"concept_error"},{text:`${a+(n-1)*d}`,type:"partial_logic",logicTag:"gave_nth_term"}],
      solutionSteps:[`Sn = n/2 × [2a + (n-1)d]`,`= ${n}/2 × [${2*a} + ${(n-1)*d}]`,`= ${Sn}`],
      shortcut:"Sn = n/2 × (2a + (n-1)d)  OR  n/2 × (first + last)" });
  }
  return qs;
};

// ── 6. TRIGONOMETRY ─────────────────────────────────────
const trigonometry = () => {
  const vals=[{a:0,s:"0",c:"1",t:"0"},{a:30,s:"1/2",c:"√3/2",t:"1/√3"},{a:45,s:"1/√2",c:"1/√2",t:"1"},{a:60,s:"√3/2",c:"1/2",t:"√3"},{a:90,s:"1",c:"0",t:"undefined"}];
  const qs = [];
  for (let i=0; i<300; i++) {
    const v=vals[rand(0,4)], fn=["sin","cos","tan"][rand(0,2)], correct=v[fn[0]], d=diff(i,300);
    const wrong=vals[(vals.indexOf(v)+1)%vals.length][fn[0]];
    qs.push({ topic:"Trigonometry", difficulty:d, difficultyScore:ds(d), expectedTime:15,
      questionText:`Find ${fn}(${v.a}°)`,
      options:[{text:correct,type:"correct"},{text:wrong,type:"concept_error"},{text:v[fn==="sin"?"cos":"sin"],type:"calculation_error",logicTag:"swapped_ratio"},{text:"0",type:"partial_logic"}],
      solutionSteps:[`SOH-CAH-TOA: ${fn}(${v.a}°) = ${correct}`],
      shortcut:"SOH=Sin/Opp/Hyp, CAH=Cos/Adj/Hyp, TOA=Tan/Opp/Adj" });
  }
  // Identity questions
  for (let i=0; i<80; i++) {
    qs.push({ topic:"Trigonometry", difficulty:"medium", difficultyScore:0.6, expectedTime:20,
      questionText:"If sin²θ + cos²θ = 1, find 1 + tan²θ",
      options:[{text:"sec²θ",type:"correct"},{text:"cosec²θ",type:"concept_error"},{text:"1",type:"calculation_error"},{text:"tan²θ",type:"partial_logic"}],
      solutionSteps:["Divide sin²θ + cos²θ = 1 by cos²θ","1 + tan²θ = sec²θ"],
      shortcut:"Three identities: sin²+cos²=1, 1+tan²=sec², 1+cot²=cosec²" });
  }
  return qs;
};

// ── 7. COORDINATE GEOMETRY ──────────────────────────────
const coordinateGeometry = () => {
  const qs = [];
  const pts=[[0,0,3,4],[1,1,4,5],[0,3,4,0],[2,3,5,7],[-1,2,3,5],[1,-1,4,3]];
  pts.forEach(([x1,y1,x2,y2]) => {
    const d=Math.round(Math.sqrt((x2-x1)**2+(y2-y1)**2)*100)/100;
    const mx=(x1+x2)/2, my=(y1+y2)/2;
    qs.push({ topic:"Coordinate Geometry", difficulty:"easy", difficultyScore:0.3, expectedTime:20,
      questionText:`Distance between (${x1},${y1}) and (${x2},${y2})?`,
      options:[{text:`${d}`,type:"correct"},{text:`${d+1}`,type:"calculation_error"},{text:`${Math.abs(x2-x1)+Math.abs(y2-y1)}`,type:"concept_error",logicTag:"used_manhattan"},{text:`${d*2}`,type:"partial_logic"}],
      solutionSteps:[`d = √[(${x2}-${x1})² + (${y2}-${y1})²]`,`= √[${(x2-x1)**2} + ${(y2-y1)**2}] = ${d}`],
      shortcut:"Distance = √[(x₂-x₁)² + (y₂-y₁)²]" });
    qs.push({ topic:"Coordinate Geometry", difficulty:"medium", difficultyScore:0.55, expectedTime:25,
      questionText:`Midpoint of (${x1},${y1}) and (${x2},${y2})?`,
      options:[{text:`(${mx}, ${my})`,type:"correct"},{text:`(${mx+1}, ${my})`,type:"calculation_error"},{text:`(${x1+x2}, ${y1+y2})`,type:"concept_error",logicTag:"forgot_divide"},{text:`(${mx}, ${y1})`,type:"partial_logic"}],
      solutionSteps:[`M = ((${x1}+${x2})/2, (${y1}+${y2})/2) = (${mx}, ${my})`],
      shortcut:"Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)" });
  });
  for (let i=0; i<80; i++) {
    const m=rand(1,5), c=rand(0,8);
    qs.push({ topic:"Coordinate Geometry", difficulty:"hard", difficultyScore:0.8, expectedTime:40,
      questionText:`Find slope of line: y = ${m}x + ${c}`,
      options:[{text:`${m}`,type:"correct"},{text:`${c}`,type:"concept_error",logicTag:"gave_intercept"},{text:`${m+1}`,type:"calculation_error"},{text:`-${m}`,type:"partial_logic"}],
      solutionSteps:[`y = mx + c → slope m = ${m}`],
      shortcut:"In y = mx + c, m is slope, c is y-intercept." });
  }
  return qs;
};

// ── 8. TRIANGLES ────────────────────────────────────────
const triangles = () => [
  ...[[3,4,5],[5,12,13],[8,15,17],[6,8,10]].flatMap(([a,b,c]) => [
    { topic:"Triangles", difficulty:"easy", difficultyScore:0.25, expectedTime:18,
      questionText:`In right triangle, if legs are ${a} and ${b}, find hypotenuse`,
      options:[{text:`${c}`,type:"correct"},{text:`${a+b}`,type:"concept_error",logicTag:"added_sides"},{text:`${c+1}`,type:"calculation_error"},{text:`${Math.round(Math.sqrt(a*a+b*b+1))}`,type:"partial_logic"}],
      solutionSteps:[`h² = ${a}² + ${b}² = ${a*a+b*b}`,`h = ${c}`],
      shortcut:"Pythagoras: h² = a² + b²" },
    { topic:"Triangles", difficulty:"medium", difficultyScore:0.55, expectedTime:28,
      questionText:`Triangles ABC ~ DEF with sides in ratio 2:3. If AB=6, find DE`,
      options:[{text:"9",type:"correct"},{text:"4",type:"concept_error"},{text:"12",type:"calculation_error"},{text:"3",type:"partial_logic"}],
      solutionSteps:["Similar triangles: sides in same ratio","DE/AB = 3/2","DE = 6 × 3/2 = 9"],
      shortcut:"Similar triangles: all corresponding sides in same ratio." },
  ]),
  ...Array.from({length:80},(_,i)=>({
    topic:"Triangles", difficulty:diff(i,80), difficultyScore:ds(diff(i,80)), expectedTime:25,
    questionText:"Basic Proportionality Theorem: if DE ∥ BC, then AD/DB = ?",
    options:[{text:"AE/EC",type:"correct"},{text:"AB/AC",type:"concept_error"},{text:"DE/BC",type:"calculation_error"},{text:"AD/AB",type:"partial_logic"}],
    solutionSteps:["BPT: if DE∥BC, line divides sides proportionally","AD/DB = AE/EC"],
    shortcut:"BPT: parallel line divides two sides in same ratio." })),
];

// ── 9. CIRCLES ──────────────────────────────────────────
const circles = () => [
  ...Array.from({length:150},(_,i)=>{
    const r=rand(3,12), d=diff(i,150);
    return { topic:"Circles", difficulty:d, difficultyScore:ds(d), expectedTime:20,
      questionText:`Find area of circle with radius ${r} cm (use π=3.14)`,
      options:[{text:`${(3.14*r*r).toFixed(2)} cm²`,type:"correct"},{text:`${(2*3.14*r).toFixed(2)} cm²`,type:"concept_error",logicTag:"gave_circumference"},{text:`${(3.14*r).toFixed(2)} cm²`,type:"calculation_error"},{text:`${(3.14*r*r*2).toFixed(2)} cm²`,type:"partial_logic"}],
      solutionSteps:[`Area = πr² = 3.14 × ${r}² = ${(3.14*r*r).toFixed(2)} cm²`],
      shortcut:"Area = πr², Circumference = 2πr — don't mix them up!" };
  }),
  ...Array.from({length:100},(_,i)=>({
    topic:"Circles", difficulty:"medium", difficultyScore:0.6, expectedTime:25,
    questionText:"A tangent to a circle is perpendicular to the radius at the point of contact. This means angle OAT =",
    options:[{text:"90°",type:"correct"},{text:"45°",type:"concept_error"},{text:"180°",type:"calculation_error"},{text:"60°",type:"partial_logic"}],
    solutionSteps:["Tangent-radius theorem: angle between tangent and radius = 90°"],
    shortcut:"Tangent ⊥ Radius at point of contact — always 90°." })),
];

// ── 10. SURFACE AREAS & VOLUMES ─────────────────────────
const surfaceVolumes = () => {
  const qs = [];
  [[3,5],[4,6],[2,7],[5,10]].forEach(([r,h]) => {
    const csa=Math.round(2*3.14*r*h*100)/100, tsa=Math.round(2*3.14*r*(r+h)*100)/100, vol=Math.round(3.14*r*r*h*100)/100;
    qs.push(
      { topic:"Surface Areas & Volumes", difficulty:"easy", difficultyScore:0.3, expectedTime:22,
        questionText:`CSA of cylinder: r=${r}cm, h=${h}cm (π=3.14)`,
        options:[{text:`${csa} cm²`,type:"correct"},{text:`${tsa} cm²`,type:"concept_error",logicTag:"gave_tsa"},{text:`${vol} cm³`,type:"calculation_error",logicTag:"gave_volume"},{text:`${csa*2} cm²`,type:"partial_logic"}],
        solutionSteps:[`CSA = 2πrh = 2 × 3.14 × ${r} × ${h} = ${csa} cm²`],
        shortcut:"CSA=2πrh (no circles), TSA=2πr(r+h) (with both circles)" },
      { topic:"Surface Areas & Volumes", difficulty:"medium", difficultyScore:0.55, expectedTime:28,
        questionText:`Volume of cylinder: r=${r}cm, h=${h}cm (π=3.14)`,
        options:[{text:`${vol} cm³`,type:"correct"},{text:`${csa} cm²`,type:"concept_error",logicTag:"gave_csa"},{text:`${vol*2} cm³`,type:"calculation_error"},{text:`${Math.round(3.14*r*r)} cm³`,type:"partial_logic"}],
        solutionSteps:[`V = πr²h = 3.14 × ${r}² × ${h} = ${vol} cm³`],
        shortcut:"Volume = πr²h — same formula as area of circle × height" });
  });
  for (let i=0; i<80; i++) {
    const l=rand(3,10);
    qs.push({ topic:"Surface Areas & Volumes", difficulty:"hard", difficultyScore:0.8, expectedTime:40,
      questionText:`A sphere has radius ${l}cm. Find its volume (π=3.14)`,
      options:[{text:`${Math.round(4/3*3.14*l*l*l*100)/100} cm³`,type:"correct"},{text:`${Math.round(4*3.14*l*l*100)/100} cm²`,type:"concept_error",logicTag:"gave_surface"},{text:`${Math.round(3.14*l*l*l)} cm³`,type:"calculation_error"},{text:`${Math.round(2/3*3.14*l*l*l*100)/100} cm³`,type:"partial_logic"}],
      solutionSteps:[`V = (4/3)πr³ = (4/3) × 3.14 × ${l}³ = ${Math.round(4/3*3.14*l*l*l*100)/100} cm³`],
      shortcut:"Sphere: V=(4/3)πr³, SA=4πr² — note the 4/3 fraction!" });
  }
  return qs;
};

// ── 11. STATISTICS ──────────────────────────────────────
const statistics = () => {
  const sets=[[2,4,6,8,10,6,6],[3,5,7,9,11,7,7],[10,20,30,40,50,30,30],[1,3,5,7,9,5,5],[4,8,12,16,20,12,12]];
  return sets.flatMap(([...vals]) => {
    const data=vals.slice(0,5), mean_=vals[5], median_=vals[6];
    const str=data.join(", ");
    return [
      { topic:"Statistics", difficulty:"easy", difficultyScore:0.25, expectedTime:20,
        questionText:`Find mean of: ${str}`,
        options:[{text:`${mean_}`,type:"correct"},{text:`${median_}`,type:"concept_error",logicTag:"gave_median"},{text:`${mean_+1}`,type:"calculation_error"},{text:`${data[0]}`,type:"partial_logic"}],
        solutionSteps:[`Sum = ${data.reduce((a,b)=>a+b,0)}`,`Mean = ${data.reduce((a,b)=>a+b,0)}/${data.length} = ${mean_}`],
        shortcut:"Mean = Sum ÷ Count" },
      { topic:"Statistics", difficulty:"medium", difficultyScore:0.55, expectedTime:25,
        questionText:`Find median of: ${[...data].sort((a,b)=>a-b).join(", ")}`,
        options:[{text:`${median_}`,type:"correct"},{text:`${mean_}`,type:"concept_error",logicTag:"gave_mean"},{text:`${data[0]}`,type:"calculation_error"},{text:`${data[data.length-1]}`,type:"partial_logic"}],
        solutionSteps:["Arrange in order: "+[...data].sort((a,b)=>a-b).join(", "),"Middle value = "+median_],
        shortcut:"Median = middle value after sorting. For even count, average of two middles." },
    ];
  });
};

// ── 12. PROBABILITY ─────────────────────────────────────
const probability = () => [
  { topic:"Probability", difficulty:"easy", difficultyScore:0.2, expectedTime:15,
    questionText:"A fair coin is tossed. P(heads) = ?",
    options:[{text:"1/2",type:"correct"},{text:"1",type:"concept_error"},{text:"0",type:"calculation_error"},{text:"2/3",type:"partial_logic"}],
    solutionSteps:["Favourable = 1 (heads)","Total = 2","P = 1/2"], shortcut:"P(event) = Favourable / Total outcomes" },
  { topic:"Probability", difficulty:"easy", difficultyScore:0.2, expectedTime:15,
    questionText:"A die is rolled once. P(getting 6) = ?",
    options:[{text:"1/6",type:"correct"},{text:"1",type:"concept_error"},{text:"6/6",type:"calculation_error"},{text:"1/3",type:"partial_logic"}],
    solutionSteps:["Favourable = 1 (only 6)","Total = 6","P = 1/6"] },
  { topic:"Probability", difficulty:"medium", difficultyScore:0.5, expectedTime:20,
    questionText:"A card is drawn from 52 cards. P(King) = ?",
    options:[{text:"1/13",type:"correct"},{text:"1/52",type:"concept_error"},{text:"4/52",type:"partial_logic",logicTag:"unsimplified"},{text:"1/4",type:"calculation_error"}],
    solutionSteps:["Kings = 4","P = 4/52 = 1/13"] },
  { topic:"Probability", difficulty:"medium", difficultyScore:0.55, expectedTime:22,
    questionText:"Two coins tossed. P(both heads) = ?",
    options:[{text:"1/4",type:"correct"},{text:"1/2",type:"concept_error"},{text:"3/4",type:"calculation_error"},{text:"1/8",type:"partial_logic"}],
    solutionSteps:["Sample space: HH, HT, TH, TT (4 outcomes)","Favourable = 1 (HH)","P = 1/4"] },
  { topic:"Probability", difficulty:"hard", difficultyScore:0.75, expectedTime:30,
    questionText:"A bag has 3 red, 5 blue, 2 green balls. P(NOT red) = ?",
    options:[{text:"7/10",type:"correct"},{text:"3/10",type:"concept_error",logicTag:"gave_red_prob"},{text:"1/2",type:"calculation_error"},{text:"5/10",type:"partial_logic"}],
    solutionSteps:["Total = 10","NOT red = 5+2 = 7","P = 7/10"] },
  { topic:"Probability", difficulty:"hard", difficultyScore:0.8, expectedTime:35,
    questionText:"P(A)=0.3, P(B)=0.4, A and B mutually exclusive. P(A or B) = ?",
    options:[{text:"0.7",type:"correct"},{text:"0.12",type:"concept_error",logicTag:"multiplied_probs"},{text:"0.1",type:"calculation_error"},{text:"0.5",type:"partial_logic"}],
    solutionSteps:["Mutually exclusive: P(A∪B) = P(A) + P(B)","= 0.3 + 0.4 = 0.7"],
    shortcut:"Mutually exclusive events: P(A or B) = P(A) + P(B)" },
];

// ── 13. APPLICATIONS OF TRIGONOMETRY ───────────────────
const appsTrig = () => [
  ...[[30,10],[45,20],[60,15],[30,50],[45,100]].flatMap(([angle,d])=>{
    const rad=angle*Math.PI/180, h=Math.round(d*Math.tan(rad)*100)/100;
    return [
      { topic:"Applications of Trigonometry", difficulty:"medium", difficultyScore:0.58, expectedTime:35,
        questionText:`A tower casts a shadow ${d}m. Angle of elevation = ${angle}°. Height?`,
        options:[{text:`${h}m`,type:"correct"},{text:`${d}m`,type:"concept_error",logicTag:"gave_shadow"},{text:`${h*2}m`,type:"calculation_error"},{text:`${Math.round(d/Math.tan(rad)*100)/100}m`,type:"partial_logic"}],
        solutionSteps:[`tan(${angle}°) = height/shadow`,`height = ${d} × tan(${angle}°) = ${h}m`],
        shortcut:"tan(angle) = opposite/adjacent = height/shadow" },
    ];
  }),
  ...Array.from({length:80},()=>({
    topic:"Applications of Trigonometry", difficulty:"hard", difficultyScore:0.82, expectedTime:50,
    questionText:"From top of 75m building, angle of depression to a car = 30°. Distance of car from building?",
    options:[{text:"75√3 m",type:"correct"},{text:"75 m",type:"concept_error"},{text:"25√3 m",type:"calculation_error"},{text:"75/√3 m",type:"partial_logic"}],
    solutionSteps:["Angle of depression = angle of elevation from car","tan(30°) = 75/d","d = 75/tan(30°) = 75/(1/√3) = 75√3 m"],
    shortcut:"Angle of depression from top = angle of elevation from bottom (alternate interior angles)." })),
];

// ── 14. AREAS RELATED TO CIRCLES ───────────────────────
const areasCircles = () =>
  [[7,60],[14,90],[21,120],[7,180],[14,45]].flatMap(([r,angle])=>{
    const area=Math.round(angle/360*3.14*r*r*100)/100;
    const arc=Math.round(angle/360*2*3.14*r*100)/100;
    return [
      { topic:"Areas Related to Circles", difficulty:"medium", difficultyScore:0.6, expectedTime:30,
        questionText:`Area of sector: r=${r}cm, angle=${angle}° (π=3.14)`,
        options:[{text:`${area} cm²`,type:"correct"},{text:`${arc} cm`,type:"concept_error",logicTag:"gave_arc_length"},{text:`${area*2} cm²`,type:"calculation_error"},{text:`${Math.round(3.14*r*r*100)/100} cm²`,type:"partial_logic",logicTag:"full_circle"}],
        solutionSteps:[`Area = (θ/360) × πr² = (${angle}/360) × 3.14 × ${r}² = ${area} cm²`],
        shortcut:"Sector area = (angle/360) × πr² — fraction of full circle area." },
      { topic:"Areas Related to Circles", difficulty:"hard", difficultyScore:0.78, expectedTime:40,
        questionText:`Arc length: r=${r}cm, angle=${angle}° (π=3.14)`,
        options:[{text:`${arc} cm`,type:"correct"},{text:`${area} cm²`,type:"concept_error",logicTag:"gave_area"},{text:`${arc*2} cm`,type:"calculation_error"},{text:`${Math.round(2*3.14*r*100)/100} cm`,type:"partial_logic",logicTag:"full_circumference"}],
        solutionSteps:[`Arc = (θ/360) × 2πr = (${angle}/360) × 2 × 3.14 × ${r} = ${arc} cm`],
        shortcut:"Arc length = (angle/360) × 2πr" },
    ];
  });

// ── RUN ALL ─────────────────────────────────────────────
const allGenerators = [
  ["quadratic_equations.json",          quadratic],
  ["linear_equations.json",             linear],
  ["real_numbers.json",                 realNumbers],
  ["polynomials.json",                  polynomials],
  ["arithmetic_progressions.json",      ap],
  ["trigonometry.json",                 trigonometry],
  ["coordinate_geometry.json",          coordinateGeometry],
  ["triangles.json",                    triangles],
  ["circles.json",                      circles],
  ["surface_areas_volumes.json",        surfaceVolumes],
  ["statistics.json",                   statistics],
  ["probability.json",                  probability],
  ["applications_trigonometry.json",    appsTrig],
  ["areas_related_to_circles.json",     areasCircles],
];

let total = 0;
for (const [filename, gen] of allGenerators) {
  const data = gen();
  save(filename, data);
  total += data.length;
}
console.log(`\n🔥 Grand total: ${total} questions across ${allGenerators.length} topics`);
console.log(`\n📥 Import all to MongoDB:`);
console.log(`  cd data && for f in *.json; do mongoimport --db ai_learning --collection questions --file "$f" --jsonArray; done`);
