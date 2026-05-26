/**
 * Algorithm registry — all sort algorithms exposed by the visualizer in
 * one ordered array. Imported by VisualizerShell + the sorting-sandbox
 * mode of ProTopicView.
 *
 * Search + linked-list algorithms have different parameter shapes (they
 * need a `target` or `operation`), so they're not in this registry; they
 * get wired into their own visualizer modes.
 */
import { bubbleSortDef }     from "./bubbleSort.js";
import { insertionSortDef }  from "./insertionSort.js";
import { selectionSortDef }  from "./selectionSort.js";
import { mergeSortDef }      from "./mergeSort.js";
import { quickSortDef }      from "./quickSort.js";

export const sortAlgorithms = [
  bubbleSortDef,
  insertionSortDef,
  selectionSortDef,
  mergeSortDef,
  quickSortDef,
];
