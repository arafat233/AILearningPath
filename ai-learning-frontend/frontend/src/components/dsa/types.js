/**
 * Type docs for the DSA visualizers. Plain JSDoc — no TS compile step.
 * Editors with TS server (VSCode default) will still get hints.
 *
 * Unifies the shapes from both source projects (dsa-visualizer 2 and
 * dsalearn) into one. Optional fields cover the union — a sort step won't
 * use `pointers`, a binary-search step won't use `comparisons`/`swaps`.
 */

/**
 * @typedef {(
 *   | 'compare'   | 'swap'      | 'sorted'    | 'overwrite'
 *   | 'highlight' | 'found'     | 'not-found'
 *   | 'pointer'   | 'insert'    | 'delete'    | 'pivot'
 *   | 'traverse'  | 'visit'     | 'push'      | 'pop'
 * )} StepType
 */

/**
 * One animation frame. The visualizer plays a sequence of these.
 *
 * @typedef {object} AnimationStep
 * @property {StepType} type
 * @property {string}   explanation       Human-readable description.
 * @property {string=}  detail            Optional extra context.
 * @property {number}   codeLine          1-indexed line to highlight (-1 = none).
 * @property {number[]=} indices          Affected indices in the structure.
 * @property {number[]=} array            Snapshot of the array at this step.
 * @property {number=}  comparisons       Cumulative compare count (sort).
 * @property {number=}  swaps             Cumulative swap count (sort).
 * @property {Object<string, number>=} pointers  Named pointers e.g. { L: 0, R: 5, mid: 2 }.
 * @property {Object<string, unknown>=} extra    Visualizer-specific payload.
 */

/**
 * Top-level algorithm definition consumed by VisualizerShell.
 *
 * @typedef {object} AlgorithmDef
 * @property {string} id
 * @property {string} name
 * @property {string} code             Source code shown in the editor panel.
 * @property {{ best: string, average: string, worst: string }} timeComplexity
 * @property {string} spaceComplexity
 * @property {string} description
 * @property {(arr: number[]) => AnimationStep[]} generate
 */

// Re-export an empty object so this file is a real ES module and can be
// imported with `import {} from './types.js'` if anyone wants to do that.
export {};
