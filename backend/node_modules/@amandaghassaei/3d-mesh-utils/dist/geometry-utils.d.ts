import type { BoundingBox, FloatArray } from './types';
/**
 * Returns the bounding box of the mesh.
 */
export declare function calcBoundingBox(mesh: {
    vertices: FloatArray;
}): BoundingBox;
/**
 * Returns the edges in the mesh data (without duplicates).
 * Assumes mesh contains indexed faces.
 * Vertices are grouped into faces of any size: [[f01, f0b, f0c], [f1a, f1b, f1c, f1d], ...]
 */
export declare function calcEdgesIndicesFromNestedIndexedFaces(mesh: {
    facesIndices: number[][];
}): number[];
/**
 * Returns the edges in the mesh data (without duplicates).
 * Assumes mesh contains indexed faces.
 * Assumes flat list of triangle faces: [f0a, f0b, f0c, f1a, f1b, f1c, ...]
 */
export declare function calcEdgesIndicesFromIndexedFaces(mesh: {
    facesIndices: Uint32Array | number[];
}): number[];
/**
 * Returns the edges in the mesh data (without duplicates).
 * Assumes mesh vertices are groups in sets of three to a face (triangle mesh).
 */
export declare function calcEdgesIndicesFromNonIndexedFaces(mesh: {
    vertices: FloatArray;
}): Uint32Array;
/**
 * Scales vertex positions (in place, unless target provided) to unit bounding box and centers around origin.
 * Assumes all vertex positions are used in mesh.
 */
export declare function scaleVerticesToUnitBoundingBox(mesh: {
    vertices: FloatArray;
    boundingBox: BoundingBox;
}, target?: FloatArray): void;
/**
 * Merge coincident vertices and index faces.
 */
export declare function mergeVertices(mesh: {
    vertices: FloatArray;
    uvs?: FloatArray;
    vertexNormals?: FloatArray;
    vertexColors?: FloatArray;
}): {
    verticesMerged: Float32Array;
    uvsMerged: FloatArray | undefined;
    vertexNormalsMerged: FloatArray | undefined;
    vertexColorsMerged: FloatArray | undefined;
    facesIndexed: Uint32Array;
};
