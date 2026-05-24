/**
 * ICSE Class 9 Mathematics — Curriculum Skeleton
 * Source: Selina Concise Mathematics Class 9 (ICSE)
 * 28 chapters × 4 sub-topics = 112 Topic docs + 28 NcertChapter docs
 *
 * Run: node config/seedIcseMath9Curriculum.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";
import { Topic } from "../models/index.js";

const BOARD = "ICSE";
const GRADE = "9";
const SUBJECT = "Mathematics";

const chapters = [
  {
    chapterId: "icse_math9_ch1", chapterNumber: 1,
    chapterName: "Rational and Irrational Numbers",
    subchapters: [
      { id: "icse_math9_ch1_s1", title: "Rational Numbers — definition, representation, operations" },
      { id: "icse_math9_ch1_s2", title: "Irrational Numbers — definition and identification" },
      { id: "icse_math9_ch1_s3", title: "Surds — addition, subtraction, multiplication, division" },
      { id: "icse_math9_ch1_s4", title: "Rationalisation of denominators" },
    ],
    topics: [
      { topicId: "icse_math9_ch1_rational_numbers",  name: "Rational Numbers",            chapterNumber: 1 },
      { topicId: "icse_math9_ch1_irrational_numbers", name: "Irrational Numbers",          chapterNumber: 1 },
      { topicId: "icse_math9_ch1_surds_operations",  name: "Surds and Operations",         chapterNumber: 1 },
      { topicId: "icse_math9_ch1_rationalization",   name: "Rationalisation of Surds",     chapterNumber: 1 },
    ],
  },
  {
    chapterId: "icse_math9_ch2", chapterNumber: 2,
    chapterName: "Compound Interest (Without Using Formula)",
    subchapters: [
      { id: "icse_math9_ch2_s1", title: "Concept of compound interest vs simple interest" },
      { id: "icse_math9_ch2_s2", title: "Yearly compounding by repeated SI" },
      { id: "icse_math9_ch2_s3", title: "Half-yearly and quarterly compounding" },
      { id: "icse_math9_ch2_s4", title: "Word problems on compound interest without formula" },
    ],
    topics: [
      { topicId: "icse_math9_ch2_ci_concept",      name: "Concept of Compound Interest",      chapterNumber: 2 },
      { topicId: "icse_math9_ch2_ci_yearly",       name: "Yearly Compounding",                chapterNumber: 2 },
      { topicId: "icse_math9_ch2_ci_half_yearly",  name: "Half-Yearly Compounding",           chapterNumber: 2 },
      { topicId: "icse_math9_ch2_ci_problems",     name: "CI Problems (Without Formula)",     chapterNumber: 2 },
    ],
  },
  {
    chapterId: "icse_math9_ch3", chapterNumber: 3,
    chapterName: "Compound Interest (Using Formula)",
    subchapters: [
      { id: "icse_math9_ch3_s1", title: "The compound interest formula A = P(1 + r/n)^(nt)" },
      { id: "icse_math9_ch3_s2", title: "Applications — finding P, R, T given others" },
      { id: "icse_math9_ch3_s3", title: "Growth and Decay problems" },
      { id: "icse_math9_ch3_s4", title: "Word problems using CI formula" },
    ],
    topics: [
      { topicId: "icse_math9_ch3_ci_formula",              name: "The CI Formula",                    chapterNumber: 3 },
      { topicId: "icse_math9_ch3_ci_formula_applications", name: "CI Formula Applications",           chapterNumber: 3 },
      { topicId: "icse_math9_ch3_ci_growth_decay",         name: "Growth and Decay",                  chapterNumber: 3 },
      { topicId: "icse_math9_ch3_ci_formula_problems",     name: "CI Formula Word Problems",          chapterNumber: 3 },
    ],
  },
  {
    chapterId: "icse_math9_ch4", chapterNumber: 4,
    chapterName: "Expansions",
    subchapters: [
      { id: "icse_math9_ch4_s1", title: "Basic expansions using distributive property" },
      { id: "icse_math9_ch4_s2", title: "Algebraic identities: (a+b)², (a-b)², (a+b)(a-b)" },
      { id: "icse_math9_ch4_s3", title: "Special products: (a+b)³, (a-b)³, (a+b+c)²" },
      { id: "icse_math9_ch4_s4", title: "Applications of expansions in simplification" },
    ],
    topics: [
      { topicId: "icse_math9_ch4_expansion_basics",        name: "Basic Expansions",               chapterNumber: 4 },
      { topicId: "icse_math9_ch4_algebraic_identities",    name: "Algebraic Identities",           chapterNumber: 4 },
      { topicId: "icse_math9_ch4_special_products",        name: "Special Products (Cubes)",       chapterNumber: 4 },
      { topicId: "icse_math9_ch4_expansion_applications",  name: "Applications of Expansions",     chapterNumber: 4 },
    ],
  },
  {
    chapterId: "icse_math9_ch5", chapterNumber: 5,
    chapterName: "Factorisation",
    subchapters: [
      { id: "icse_math9_ch5_s1", title: "Common factors and grouping" },
      { id: "icse_math9_ch5_s2", title: "Factorising using algebraic identities" },
      { id: "icse_math9_ch5_s3", title: "Factorising quadratic expressions" },
      { id: "icse_math9_ch5_s4", title: "Factorising cubic polynomials" },
    ],
    topics: [
      { topicId: "icse_math9_ch5_factoring_basics",      name: "Common Factors and Grouping",     chapterNumber: 5 },
      { topicId: "icse_math9_ch5_factoring_identities",  name: "Factorising with Identities",     chapterNumber: 5 },
      { topicId: "icse_math9_ch5_factoring_quadratics",  name: "Factorising Quadratics",          chapterNumber: 5 },
      { topicId: "icse_math9_ch5_factoring_polynomials", name: "Factorising Cubic Polynomials",   chapterNumber: 5 },
    ],
  },
  {
    chapterId: "icse_math9_ch6", chapterNumber: 6,
    chapterName: "Simultaneous Linear Equations",
    subchapters: [
      { id: "icse_math9_ch6_s1", title: "Substitution method" },
      { id: "icse_math9_ch6_s2", title: "Elimination method" },
      { id: "icse_math9_ch6_s3", title: "Graphical method" },
      { id: "icse_math9_ch6_s4", title: "Word problems on simultaneous equations" },
    ],
    topics: [
      { topicId: "icse_math9_ch6_sle_substitution",  name: "Substitution Method",                chapterNumber: 6 },
      { topicId: "icse_math9_ch6_sle_elimination",   name: "Elimination Method",                 chapterNumber: 6 },
      { topicId: "icse_math9_ch6_sle_graphical",     name: "Graphical Method",                   chapterNumber: 6 },
      { topicId: "icse_math9_ch6_sle_word_problems", name: "Word Problems on SLE",               chapterNumber: 6 },
    ],
  },
  {
    chapterId: "icse_math9_ch7", chapterNumber: 7,
    chapterName: "Indices (Exponents)",
    subchapters: [
      { id: "icse_math9_ch7_s1", title: "Laws of indices — product, quotient, power rules" },
      { id: "icse_math9_ch7_s2", title: "Negative and zero indices" },
      { id: "icse_math9_ch7_s3", title: "Fractional indices and surds connection" },
      { id: "icse_math9_ch7_s4", title: "Problems using laws of indices" },
    ],
    topics: [
      { topicId: "icse_math9_ch7_laws_of_indices",   name: "Laws of Indices",                    chapterNumber: 7 },
      { topicId: "icse_math9_ch7_negative_indices",  name: "Negative and Zero Indices",          chapterNumber: 7 },
      { topicId: "icse_math9_ch7_fractional_indices", name: "Fractional Indices",                chapterNumber: 7 },
      { topicId: "icse_math9_ch7_indices_problems",  name: "Indices Problems",                   chapterNumber: 7 },
    ],
  },
  {
    chapterId: "icse_math9_ch8", chapterNumber: 8,
    chapterName: "Logarithms",
    subchapters: [
      { id: "icse_math9_ch8_s1", title: "Definition of logarithm and relation to exponents" },
      { id: "icse_math9_ch8_s2", title: "Laws of logarithms — product, quotient, power" },
      { id: "icse_math9_ch8_s3", title: "Solving logarithmic equations" },
      { id: "icse_math9_ch8_s4", title: "Applications — common and natural logarithms" },
    ],
    topics: [
      { topicId: "icse_math9_ch8_log_definition",   name: "Definition of Logarithm",             chapterNumber: 8 },
      { topicId: "icse_math9_ch8_log_laws",         name: "Laws of Logarithms",                  chapterNumber: 8 },
      { topicId: "icse_math9_ch8_log_equations",    name: "Logarithmic Equations",               chapterNumber: 8 },
      { topicId: "icse_math9_ch8_log_applications", name: "Applications of Logarithms",          chapterNumber: 8 },
    ],
  },
  {
    chapterId: "icse_math9_ch9", chapterNumber: 9,
    chapterName: "Triangles",
    subchapters: [
      { id: "icse_math9_ch9_s1", title: "Congruence of triangles — concept and criteria overview" },
      { id: "icse_math9_ch9_s2", title: "SAS, ASA, AAS, SSS, RHS criteria" },
      { id: "icse_math9_ch9_s3", title: "Properties of triangles — angle sum, exterior angle" },
      { id: "icse_math9_ch9_s4", title: "Problems on triangle congruence" },
    ],
    topics: [
      { topicId: "icse_math9_ch9_triangle_congruence",  name: "Congruence of Triangles",         chapterNumber: 9 },
      { topicId: "icse_math9_ch9_congruence_criteria",  name: "Congruence Criteria",             chapterNumber: 9 },
      { topicId: "icse_math9_ch9_triangle_properties",  name: "Properties of Triangles",         chapterNumber: 9 },
      { topicId: "icse_math9_ch9_triangle_problems",    name: "Triangle Congruence Problems",    chapterNumber: 9 },
    ],
  },
  {
    chapterId: "icse_math9_ch10", chapterNumber: 10,
    chapterName: "Isosceles Triangles",
    subchapters: [
      { id: "icse_math9_ch10_s1", title: "Properties of isosceles triangles" },
      { id: "icse_math9_ch10_s2", title: "Theorems on isosceles triangles (base angles)" },
      { id: "icse_math9_ch10_s3", title: "Equilateral triangle properties" },
      { id: "icse_math9_ch10_s4", title: "Problems on isosceles and equilateral triangles" },
    ],
    topics: [
      { topicId: "icse_math9_ch10_isosceles_properties", name: "Isosceles Triangle Properties", chapterNumber: 10 },
      { topicId: "icse_math9_ch10_isosceles_theorems",   name: "Isosceles Triangle Theorems",   chapterNumber: 10 },
      { topicId: "icse_math9_ch10_equilateral_triangle", name: "Equilateral Triangle",           chapterNumber: 10 },
      { topicId: "icse_math9_ch10_isosceles_problems",   name: "Isosceles Triangle Problems",    chapterNumber: 10 },
    ],
  },
  {
    chapterId: "icse_math9_ch11", chapterNumber: 11,
    chapterName: "Inequalities",
    subchapters: [
      { id: "icse_math9_ch11_s1", title: "Basic inequality concepts — greater/less than relations in geometry" },
      { id: "icse_math9_ch11_s2", title: "Triangle inequality theorem — sum of two sides > third side" },
      { id: "icse_math9_ch11_s3", title: "Angle-side relationship theorems in triangles" },
      { id: "icse_math9_ch11_s4", title: "Problems applying triangle inequalities" },
    ],
    topics: [
      { topicId: "icse_math9_ch11_inequality_basics",    name: "Inequality Basics",              chapterNumber: 11 },
      { topicId: "icse_math9_ch11_triangle_inequalities", name: "Triangle Inequality Theorem",   chapterNumber: 11 },
      { topicId: "icse_math9_ch11_inequality_theorems",  name: "Angle-Side Relationship",        chapterNumber: 11 },
      { topicId: "icse_math9_ch11_inequality_problems",  name: "Inequality Problems",            chapterNumber: 11 },
    ],
  },
  {
    chapterId: "icse_math9_ch12", chapterNumber: 12,
    chapterName: "Mid-Point and Its Converse (Intercept Theorem)",
    subchapters: [
      { id: "icse_math9_ch12_s1", title: "Mid-point theorem — line joining midpoints of two sides" },
      { id: "icse_math9_ch12_s2", title: "Converse of mid-point theorem" },
      { id: "icse_math9_ch12_s3", title: "Intercept theorem (equal intercepts)" },
      { id: "icse_math9_ch12_s4", title: "Problems on mid-point and intercept theorems" },
    ],
    topics: [
      { topicId: "icse_math9_ch12_midpoint_theorem",  name: "Mid-Point Theorem",               chapterNumber: 12 },
      { topicId: "icse_math9_ch12_converse_midpoint", name: "Converse of Mid-Point Theorem",   chapterNumber: 12 },
      { topicId: "icse_math9_ch12_intercept_theorem", name: "Intercept Theorem",               chapterNumber: 12 },
      { topicId: "icse_math9_ch12_midpoint_problems", name: "Mid-Point Theorem Problems",      chapterNumber: 12 },
    ],
  },
  {
    chapterId: "icse_math9_ch13", chapterNumber: 13,
    chapterName: "Pythagoras Theorem",
    subchapters: [
      { id: "icse_math9_ch13_s1", title: "Statement and proof of Pythagoras theorem" },
      { id: "icse_math9_ch13_s2", title: "Converse of Pythagoras theorem" },
      { id: "icse_math9_ch13_s3", title: "Applications — finding unknown sides" },
      { id: "icse_math9_ch13_s4", title: "Word problems on Pythagoras theorem" },
    ],
    topics: [
      { topicId: "icse_math9_ch13_pythagoras_theorem",      name: "Pythagoras Theorem",         chapterNumber: 13 },
      { topicId: "icse_math9_ch13_pythagoras_converse",     name: "Converse of Pythagoras",     chapterNumber: 13 },
      { topicId: "icse_math9_ch13_pythagoras_applications", name: "Pythagoras Applications",    chapterNumber: 13 },
      { topicId: "icse_math9_ch13_pythagoras_problems",     name: "Pythagoras Problems",        chapterNumber: 13 },
    ],
  },
  {
    chapterId: "icse_math9_ch14", chapterNumber: 14,
    chapterName: "Rectilinear Figures",
    subchapters: [
      { id: "icse_math9_ch14_s1", title: "Properties of quadrilaterals — angle sum, types" },
      { id: "icse_math9_ch14_s2", title: "Parallelogram theorems — opposite sides and angles" },
      { id: "icse_math9_ch14_s3", title: "Special quadrilaterals — rectangle, rhombus, square, trapezium" },
      { id: "icse_math9_ch14_s4", title: "Problems on rectilinear figures" },
    ],
    topics: [
      { topicId: "icse_math9_ch14_quadrilateral_properties",  name: "Quadrilateral Properties",   chapterNumber: 14 },
      { topicId: "icse_math9_ch14_parallelogram_theorems",    name: "Parallelogram Theorems",      chapterNumber: 14 },
      { topicId: "icse_math9_ch14_special_quadrilaterals",    name: "Special Quadrilaterals",      chapterNumber: 14 },
      { topicId: "icse_math9_ch14_rectilinear_problems",      name: "Rectilinear Figure Problems", chapterNumber: 14 },
    ],
  },
  {
    chapterId: "icse_math9_ch15", chapterNumber: 15,
    chapterName: "Construction of Polygons",
    subchapters: [
      { id: "icse_math9_ch15_s1", title: "Basic geometric constructions — perpendicular bisector, angle bisector" },
      { id: "icse_math9_ch15_s2", title: "Construction of triangles given various conditions" },
      { id: "icse_math9_ch15_s3", title: "Construction of quadrilaterals" },
      { id: "icse_math9_ch15_s4", title: "Construction of regular polygons" },
    ],
    topics: [
      { topicId: "icse_math9_ch15_basic_constructions",         name: "Basic Constructions",          chapterNumber: 15 },
      { topicId: "icse_math9_ch15_triangle_construction",       name: "Triangle Construction",        chapterNumber: 15 },
      { topicId: "icse_math9_ch15_quadrilateral_construction",  name: "Quadrilateral Construction",   chapterNumber: 15 },
      { topicId: "icse_math9_ch15_polygon_construction",        name: "Regular Polygon Construction", chapterNumber: 15 },
    ],
  },
  {
    chapterId: "icse_math9_ch16", chapterNumber: 16,
    chapterName: "Area Theorems (Proof and Use)",
    subchapters: [
      { id: "icse_math9_ch16_s1", title: "Area of a parallelogram on same base and between same parallels" },
      { id: "icse_math9_ch16_s2", title: "Area of triangle — half that of parallelogram (same base, parallels)" },
      { id: "icse_math9_ch16_s3", title: "Proofs of area theorems" },
      { id: "icse_math9_ch16_s4", title: "Problems using area theorems" },
    ],
    topics: [
      { topicId: "icse_math9_ch16_area_parallelogram",    name: "Area of Parallelogram Theorem",  chapterNumber: 16 },
      { topicId: "icse_math9_ch16_area_triangle",         name: "Area of Triangle Theorem",       chapterNumber: 16 },
      { topicId: "icse_math9_ch16_area_theorems_proof",   name: "Area Theorems — Proofs",         chapterNumber: 16 },
      { topicId: "icse_math9_ch16_area_theorem_problems", name: "Area Theorem Problems",          chapterNumber: 16 },
    ],
  },
  {
    chapterId: "icse_math9_ch17", chapterNumber: 17,
    chapterName: "Circle",
    subchapters: [
      { id: "icse_math9_ch17_s1", title: "Circle — centre, radius, diameter, chord, arc, sector, segment" },
      { id: "icse_math9_ch17_s2", title: "Chord properties — perpendicular from centre, equal chords" },
      { id: "icse_math9_ch17_s3", title: "Arc properties — angle subtended at centre and circumference" },
      { id: "icse_math9_ch17_s4", title: "Problems on circle theorems" },
    ],
    topics: [
      { topicId: "icse_math9_ch17_circle_basics",   name: "Circle Basics and Terminology",       chapterNumber: 17 },
      { topicId: "icse_math9_ch17_chord_properties", name: "Chord Properties",                   chapterNumber: 17 },
      { topicId: "icse_math9_ch17_arc_properties",  name: "Arc and Angle Properties",             chapterNumber: 17 },
      { topicId: "icse_math9_ch17_circle_problems", name: "Circle Theorem Problems",              chapterNumber: 17 },
    ],
  },
  {
    chapterId: "icse_math9_ch18", chapterNumber: 18,
    chapterName: "Statistics",
    subchapters: [
      { id: "icse_math9_ch18_s1", title: "Data collection — primary vs secondary, raw data" },
      { id: "icse_math9_ch18_s2", title: "Frequency distribution — tally, class intervals, grouped data" },
      { id: "icse_math9_ch18_s3", title: "Graphical representation — bar graphs, histograms, frequency polygons" },
      { id: "icse_math9_ch18_s4", title: "Reading and interpreting statistical graphs" },
    ],
    topics: [
      { topicId: "icse_math9_ch18_data_collection",         name: "Data Collection",              chapterNumber: 18 },
      { topicId: "icse_math9_ch18_frequency_distribution",  name: "Frequency Distribution",       chapterNumber: 18 },
      { topicId: "icse_math9_ch18_graphical_representation", name: "Graphical Representation",    chapterNumber: 18 },
      { topicId: "icse_math9_ch18_statistics_problems",     name: "Statistics Problems",           chapterNumber: 18 },
    ],
  },
  {
    chapterId: "icse_math9_ch19", chapterNumber: 19,
    chapterName: "Mean and Median",
    subchapters: [
      { id: "icse_math9_ch19_s1", title: "Mean — arithmetic mean for raw and grouped data" },
      { id: "icse_math9_ch19_s2", title: "Median — for ungrouped and grouped data" },
      { id: "icse_math9_ch19_s3", title: "Mode — for ungrouped and grouped data" },
      { id: "icse_math9_ch19_s4", title: "Problems on measures of central tendency" },
    ],
    topics: [
      { topicId: "icse_math9_ch19_mean_calculation",           name: "Mean Calculation",             chapterNumber: 19 },
      { topicId: "icse_math9_ch19_median_calculation",         name: "Median Calculation",           chapterNumber: 19 },
      { topicId: "icse_math9_ch19_mode_calculation",           name: "Mode Calculation",             chapterNumber: 19 },
      { topicId: "icse_math9_ch19_central_tendency_problems",  name: "Central Tendency Problems",    chapterNumber: 19 },
    ],
  },
  {
    chapterId: "icse_math9_ch20", chapterNumber: 20,
    chapterName: "Area and Perimeter of Plane Figures",
    subchapters: [
      { id: "icse_math9_ch20_s1", title: "Area of triangles, quadrilaterals, special polygons" },
      { id: "icse_math9_ch20_s2", title: "Perimeter of plane figures" },
      { id: "icse_math9_ch20_s3", title: "Area and circumference of a circle" },
      { id: "icse_math9_ch20_s4", title: "Word problems on area and perimeter" },
    ],
    topics: [
      { topicId: "icse_math9_ch20_area_plane_figures",       name: "Area of Plane Figures",         chapterNumber: 20 },
      { topicId: "icse_math9_ch20_perimeter_plane_figures",  name: "Perimeter of Plane Figures",    chapterNumber: 20 },
      { topicId: "icse_math9_ch20_circle_area_perimeter",    name: "Circle Area and Circumference", chapterNumber: 20 },
      { topicId: "icse_math9_ch20_area_perimeter_problems",  name: "Area and Perimeter Problems",   chapterNumber: 20 },
    ],
  },
  {
    chapterId: "icse_math9_ch21", chapterNumber: 21,
    chapterName: "Solids: Surface Area and Volume",
    subchapters: [
      { id: "icse_math9_ch21_s1", title: "Surface area and volume of cuboid and cylinder" },
      { id: "icse_math9_ch21_s2", title: "Surface area and volume of cone and pyramid" },
      { id: "icse_math9_ch21_s3", title: "Surface area and volume of sphere and hemisphere" },
      { id: "icse_math9_ch21_s4", title: "Combined solid problems" },
    ],
    topics: [
      { topicId: "icse_math9_ch21_cuboid_cylinder",  name: "Cuboid and Cylinder",                  chapterNumber: 21 },
      { topicId: "icse_math9_ch21_cone_pyramid",     name: "Cone and Pyramid",                     chapterNumber: 21 },
      { topicId: "icse_math9_ch21_sphere_hemisphere", name: "Sphere and Hemisphere",               chapterNumber: 21 },
      { topicId: "icse_math9_ch21_solid_problems",   name: "Combined Solid Problems",               chapterNumber: 21 },
    ],
  },
  {
    chapterId: "icse_math9_ch22", chapterNumber: 22,
    chapterName: "Trigonometrical Ratios",
    subchapters: [
      { id: "icse_math9_ch22_s1", title: "Definition of sin, cos, tan, cosec, sec, cot" },
      { id: "icse_math9_ch22_s2", title: "Trigonometric ratios of complementary angles" },
      { id: "icse_math9_ch22_s3", title: "Using trigonometric tables" },
      { id: "icse_math9_ch22_s4", title: "Problems on trigonometric ratios" },
    ],
    topics: [
      { topicId: "icse_math9_ch22_trig_ratios_definition",    name: "Trig Ratios — Definition",    chapterNumber: 22 },
      { topicId: "icse_math9_ch22_trig_ratios_complementary", name: "Complementary Angle Ratios",  chapterNumber: 22 },
      { topicId: "icse_math9_ch22_trig_tables_use",           name: "Using Trig Tables",            chapterNumber: 22 },
      { topicId: "icse_math9_ch22_trig_ratios_problems",      name: "Trig Ratio Problems",          chapterNumber: 22 },
    ],
  },
  {
    chapterId: "icse_math9_ch23", chapterNumber: 23,
    chapterName: "Trigonometrical Ratios of Standard Angles",
    subchapters: [
      { id: "icse_math9_ch23_s1", title: "Values of trig ratios at 0°, 30°, 45°" },
      { id: "icse_math9_ch23_s2", title: "Values of trig ratios at 60°, 90°" },
      { id: "icse_math9_ch23_s3", title: "Fundamental identities — sin²θ + cos²θ = 1 etc." },
      { id: "icse_math9_ch23_s4", title: "Problems using standard angle values" },
    ],
    topics: [
      { topicId: "icse_math9_ch23_standard_angles_0_30_45",    name: "Standard Angles 0°, 30°, 45°",  chapterNumber: 23 },
      { topicId: "icse_math9_ch23_standard_angles_60_90",      name: "Standard Angles 60°, 90°",       chapterNumber: 23 },
      { topicId: "icse_math9_ch23_trig_standard_identities",   name: "Trigonometric Identities",       chapterNumber: 23 },
      { topicId: "icse_math9_ch23_standard_angles_problems",   name: "Standard Angles Problems",       chapterNumber: 23 },
    ],
  },
  {
    chapterId: "icse_math9_ch24", chapterNumber: 24,
    chapterName: "Solution of Right Triangles",
    subchapters: [
      { id: "icse_math9_ch24_s1", title: "Solving a right triangle given a side and an angle" },
      { id: "icse_math9_ch24_s2", title: "Finding unknown sides using trig ratios" },
      { id: "icse_math9_ch24_s3", title: "Finding unknown angles using inverse trig" },
      { id: "icse_math9_ch24_s4", title: "Word problems on solution of right triangles" },
    ],
    topics: [
      { topicId: "icse_math9_ch24_right_triangle_solution", name: "Solving a Right Triangle",    chapterNumber: 24 },
      { topicId: "icse_math9_ch24_finding_sides",           name: "Finding Unknown Sides",       chapterNumber: 24 },
      { topicId: "icse_math9_ch24_finding_angles",          name: "Finding Unknown Angles",      chapterNumber: 24 },
      { topicId: "icse_math9_ch24_right_triangle_problems", name: "Right Triangle Problems",     chapterNumber: 24 },
    ],
  },
  {
    chapterId: "icse_math9_ch25", chapterNumber: 25,
    chapterName: "Complementary Angles",
    subchapters: [
      { id: "icse_math9_ch25_s1", title: "Complementary angles in trigonometry — sin θ = cos(90−θ)" },
      { id: "icse_math9_ch25_s2", title: "Identities involving complementary angles" },
      { id: "icse_math9_ch25_s3", title: "Applications and simplifications using complementary angles" },
      { id: "icse_math9_ch25_s4", title: "Problems on complementary angle identities" },
    ],
    topics: [
      { topicId: "icse_math9_ch25_complementary_trig",         name: "Complementary Trig Ratios",    chapterNumber: 25 },
      { topicId: "icse_math9_ch25_complementary_identities",   name: "Complementary Identities",     chapterNumber: 25 },
      { topicId: "icse_math9_ch25_complementary_applications", name: "Complementary Applications",   chapterNumber: 25 },
      { topicId: "icse_math9_ch25_complementary_problems",     name: "Complementary Angle Problems",  chapterNumber: 25 },
    ],
  },
  {
    chapterId: "icse_math9_ch26", chapterNumber: 26,
    chapterName: "Co-ordinate Geometry",
    subchapters: [
      { id: "icse_math9_ch26_s1", title: "Cartesian plane — axes, quadrants, origin" },
      { id: "icse_math9_ch26_s2", title: "Plotting and reading co-ordinates" },
      { id: "icse_math9_ch26_s3", title: "Distance and mid-point formulas" },
      { id: "icse_math9_ch26_s4", title: "Co-ordinate geometry problems" },
    ],
    topics: [
      { topicId: "icse_math9_ch26_cartesian_plane",    name: "Cartesian Plane",               chapterNumber: 26 },
      { topicId: "icse_math9_ch26_plotting_points",    name: "Plotting Co-ordinates",         chapterNumber: 26 },
      { topicId: "icse_math9_ch26_distance_midpoint",  name: "Distance and Mid-Point",        chapterNumber: 26 },
      { topicId: "icse_math9_ch26_coordinate_problems", name: "Co-ordinate Geometry Problems", chapterNumber: 26 },
    ],
  },
  {
    chapterId: "icse_math9_ch27", chapterNumber: 27,
    chapterName: "Graphical Solution (Linear Equations)",
    subchapters: [
      { id: "icse_math9_ch27_s1", title: "Drawing straight-line graphs from equations" },
      { id: "icse_math9_ch27_s2", title: "Solving a single linear equation graphically" },
      { id: "icse_math9_ch27_s3", title: "Solving simultaneous equations graphically (point of intersection)" },
      { id: "icse_math9_ch27_s4", title: "Word problems solved by graphical method" },
    ],
    topics: [
      { topicId: "icse_math9_ch27_linear_graphs",          name: "Linear Graphs",                  chapterNumber: 27 },
      { topicId: "icse_math9_ch27_graphical_equations",    name: "Graphical Linear Equations",     chapterNumber: 27 },
      { topicId: "icse_math9_ch27_simultaneous_graphical", name: "Simultaneous Eqns (Graphical)",  chapterNumber: 27 },
      { topicId: "icse_math9_ch27_graphical_problems",     name: "Graphical Method Problems",      chapterNumber: 27 },
    ],
  },
  {
    chapterId: "icse_math9_ch28", chapterNumber: 28,
    chapterName: "Distance Formula",
    subchapters: [
      { id: "icse_math9_ch28_s1", title: "Distance formula — derivation from Pythagoras" },
      { id: "icse_math9_ch28_s2", title: "Applications — finding distance between two points" },
      { id: "icse_math9_ch28_s3", title: "Testing collinearity of three points" },
      { id: "icse_math9_ch28_s4", title: "Word problems using distance formula" },
    ],
    topics: [
      { topicId: "icse_math9_ch28_distance_formula",      name: "Distance Formula",              chapterNumber: 28 },
      { topicId: "icse_math9_ch28_distance_applications", name: "Distance Formula Applications", chapterNumber: 28 },
      { topicId: "icse_math9_ch28_collinearity",          name: "Collinearity of Points",        chapterNumber: 28 },
      { topicId: "icse_math9_ch28_distance_problems",     name: "Distance Formula Problems",     chapterNumber: 28 },
    ],
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected — seeding ICSE Math 9 curriculum...");

  let chaptersUpserted = 0;
  let topicsUpserted = 0;

  for (const ch of chapters) {
    // Upsert NcertChapter
    await NcertChapter.findOneAndUpdate(
      { chapterId: ch.chapterId },
      {
        $set: {
          chapterId:  ch.chapterId,
          number:     ch.chapterNumber,
          title:      ch.chapterName,
          subject:    SUBJECT,
          grade:      GRADE,
          board:      BOARD,
          subchapters: ch.subchapters,
        },
      },
      { upsert: true, new: true }
    );
    chaptersUpserted++;

    // Upsert Topics
    for (const t of ch.topics) {
      await Topic.findOneAndUpdate(
        { topicId: t.topicId },
        {
          topicId: t.topicId,
          name: t.name,
          subject: SUBJECT,
          grade: GRADE,
          examBoard: BOARD,
          chapterId: ch.chapterId,
          chapterNumber: t.chapterNumber,
          examFrequency: 0.75,
          isActive: true,
        },
        { upsert: true, new: true }
      );
      topicsUpserted++;
    }
    console.log(`  ✓ Ch${ch.chapterNumber}: ${ch.chapterName} (${ch.topics.length} topics)`);
  }

  console.log(`\nDone — ${chaptersUpserted} chapters, ${topicsUpserted} topics upserted.`);
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
