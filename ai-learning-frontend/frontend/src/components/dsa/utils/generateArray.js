/**
 * Random integer array in the visualizer-friendly range (20..300).
 * Values are deliberately bounded so bar heights are visible at any size.
 */
export const generateRandomArray = (size) =>
  Array.from({ length: size }, () => Math.floor(Math.random() * 280) + 20);
