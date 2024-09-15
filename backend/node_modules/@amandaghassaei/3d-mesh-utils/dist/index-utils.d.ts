/**
 * Make hash key for edge.
 * @param index1 - Index of first vertex.
 * @param index2 - Index of second vertex.
 * @returns - Hash key for edge.
 */
export declare function makeEdgeHash(index1: number, index2: number): string;
/**
 * Make hash key for triangle face.
 * @param index1 - Index of first vertex.
 * @param index2 - Index of second vertex.
 * @param index3 - Index of third vertex.
 * @returns - Hash key for triangle face.
 */
export declare function makeTriangleFaceHash(index1: number, index2: number, index3: number): string;
/**
 * Make hash key for face with any number of vertices.
 * @param facesIndices - Array of vertex indices.
 * @returns - Hash key for face.
 */
export declare function makeFaceHash(facesIndices: number[]): string;
