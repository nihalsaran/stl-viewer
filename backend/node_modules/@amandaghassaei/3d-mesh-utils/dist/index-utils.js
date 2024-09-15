/**
 * Make hash key for edge.
 * @param index1 - Index of first vertex.
 * @param index2 - Index of second vertex.
 * @returns - Hash key for edge.
 */
export function makeEdgeHash(index1, index2) {
    return `${Math.min(index1, index2)},${Math.max(index1, index2)}`;
}
/**
 * Make hash key for triangle face.
 * @param index1 - Index of first vertex.
 * @param index2 - Index of second vertex.
 * @param index3 - Index of third vertex.
 * @returns - Hash key for triangle face.
 */
export function makeTriangleFaceHash(index1, index2, index3) {
    const min = Math.min(index1, index2, index3);
    const max = Math.max(index1, index2, index3);
    const sum = index1 + index2 + index3;
    return `${min},${sum - min - max},${max}`;
}
let tempArray = [];
/**
 * Make hash key for face with any number of vertices.
 * @param facesIndices - Array of vertex indices.
 * @returns - Hash key for face.
 */
export function makeFaceHash(facesIndices) {
    const length = facesIndices.length;
    tempArray.length = length;
    for (let i = 0; i < length; i++) {
        tempArray[i] = facesIndices[i];
    }
    tempArray.sort((a, b) => (a - b));
    return tempArray.join(',');
}
//# sourceMappingURL=index-utils.js.map