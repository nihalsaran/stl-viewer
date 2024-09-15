import { makeEdgeHash } from './index-utils';
/**
 * Returns the bounding box of the mesh.
 */
export function calcBoundingBox(mesh) {
    const { vertices } = mesh;
    const numVertices = vertices.length / 3;
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < numVertices; i++) {
        min[0] = Math.min(min[0], vertices[3 * i]);
        min[1] = Math.min(min[1], vertices[3 * i + 1]);
        min[2] = Math.min(min[2], vertices[3 * i + 2]);
        max[0] = Math.max(max[0], vertices[3 * i]);
        max[1] = Math.max(max[1], vertices[3 * i + 1]);
        max[2] = Math.max(max[2], vertices[3 * i + 2]);
    }
    return { min, max };
}
/**
 * Returns the edges in the mesh data (without duplicates).
 * Assumes mesh contains indexed faces.
 * Vertices are grouped into faces of any size: [[f01, f0b, f0c], [f1a, f1b, f1c, f1d], ...]
 */
export function calcEdgesIndicesFromNestedIndexedFaces(mesh) {
    const { facesIndices } = mesh;
    // Handle edges on indexed faces.
    const numFaces = facesIndices.length;
    // Use hash to calc edges.
    const edgesHash = {};
    const edges = [];
    for (let i = 0; i < numFaces; i++) {
        const face = facesIndices[i];
        const numVertices = face.length;
        for (let j = 0; j < numVertices; j++) {
            const index1 = face[j];
            const index2 = face[(j + 1) % numVertices];
            const key = makeEdgeHash(index1, index2);
            // Only add each edge once.
            if (edgesHash[key] === undefined) {
                edgesHash[key] = true;
                edges.push(index1, index2);
            }
        }
    }
    return edges;
}
/**
 * Returns the edges in the mesh data (without duplicates).
 * Assumes mesh contains indexed faces.
 * Assumes flat list of triangle faces: [f0a, f0b, f0c, f1a, f1b, f1c, ...]
 */
export function calcEdgesIndicesFromIndexedFaces(mesh) {
    const { facesIndices } = mesh;
    // Handle edges on indexed faces.
    const numFaces = facesIndices.length / 3;
    // Use hash to calc edges.
    const edgesHash = {};
    const edgeIndices = [];
    for (let i = 0; i < numFaces; i++) {
        for (let j = 0; j < 3; j++) {
            const index1 = facesIndices[3 * i + j];
            const index2 = facesIndices[3 * i + (j + 1) % 3];
            const key = makeEdgeHash(index1, index2);
            // Only add each edge once.
            if (edgesHash[key] === undefined) {
                edgesHash[key] = true;
                edgeIndices.push(index1, index2);
            }
        }
    }
    return edgeIndices;
}
/**
 * Returns the edges in the mesh data (without duplicates).
 * Assumes mesh vertices are groups in sets of three to a face (triangle mesh).
 */
export function calcEdgesIndicesFromNonIndexedFaces(mesh) {
    const { vertices } = mesh;
    const numVertices = vertices.length / 3;
    // Vertices are grouped in sets of three to a face.
    const numFaces = numVertices / 3;
    const edges = new Uint32Array(6 * numFaces);
    for (let i = 0; i < numFaces; i++) {
        const index = 3 * i;
        for (let j = 0; j < 3; j++) {
            const edgeIndex = 6 * i + 2 * j;
            edges[edgeIndex] = index + j;
            edges[edgeIndex + 1] = index + (j + 1) % 3;
        }
    }
    return edges;
}
/**
 * Scales vertex positions (in place, unless target provided) to unit bounding box and centers around origin.
 * Assumes all vertex positions are used in mesh.
 */
export function scaleVerticesToUnitBoundingBox(mesh, target = mesh.vertices) {
    const { vertices, boundingBox } = mesh;
    const { min, max } = boundingBox;
    const diff = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
    const center = [(max[0] + min[0]) / 2, (max[1] + min[1]) / 2, (max[2] + min[2]) / 2];
    const scale = Math.max(diff[0], diff[1], diff[2]);
    const numNodes = vertices.length / 3;
    for (let i = 0; i < numNodes; i++) {
        for (let j = 0; j < 3; j++) {
            // Uniform scale.
            target[3 * i + j] = (vertices[3 * i + j] - center[j]) / scale;
        }
    }
}
/**
 * Merge coincident vertices and index faces.
 */
export function mergeVertices(mesh) {
    const { vertices, uvs, vertexNormals, vertexColors } = mesh;
    const numFaces = vertices.length / 9;
    const previousIndexMap = []; // Map from old vertex index to new vertex index.
    const facesIndexed = new Uint32Array(numFaces * 3);
    // Use hash to merge vertices.
    const vertexHash = {};
    for (let i = 0; i < numFaces; i++) {
        for (let j = 0; j < 3; j++) {
            const vertexIndex = 3 * i + j;
            const positionX = vertices[3 * vertexIndex];
            const positionY = vertices[3 * vertexIndex + 1];
            const positionZ = vertices[3 * vertexIndex + 2];
            let key = `${positionX},${positionY},${positionZ}`;
            if (uvs) {
                const uvX = uvs[2 * vertexIndex];
                const uvY = uvs[2 * vertexIndex + 1];
                key += `|${uvX},${uvY}`;
            }
            if (vertexNormals) {
                const normalX = vertexNormals[3 * vertexIndex];
                const normalY = vertexNormals[3 * vertexIndex + 1];
                const normalZ = vertexNormals[3 * vertexIndex + 2];
                key += `|${normalX},${normalY},${normalZ}`;
            }
            if (vertexColors) {
                const colorR = vertexColors[3 * vertexIndex];
                const colorG = vertexColors[3 * vertexIndex + 1];
                const colorB = vertexColors[3 * vertexIndex + 2];
                key += `|${colorR},${colorG},${colorB}`;
            }
            const faceIndex = 3 * i;
            let mergedVertexIndex = vertexHash[key];
            if (mergedVertexIndex !== undefined) {
                facesIndexed[faceIndex + j] = mergedVertexIndex;
            }
            else {
                // Add new vertex.
                mergedVertexIndex = previousIndexMap.length;
                facesIndexed[faceIndex + j] = mergedVertexIndex;
                vertexHash[key] = mergedVertexIndex;
                previousIndexMap.push(vertexIndex);
            }
        }
    }
    const numMergedVertices = previousIndexMap.length;
    const verticesMerged = new Float32Array(numMergedVertices * 3);
    for (let i = 0; i < numMergedVertices; i++) {
        const previousIndex = previousIndexMap[i];
        verticesMerged[3 * i] = vertices[3 * previousIndex];
        verticesMerged[3 * i + 1] = vertices[3 * previousIndex + 1];
        verticesMerged[3 * i + 2] = vertices[3 * previousIndex + 2];
    }
    let uvsMerged;
    if (uvs) {
        uvsMerged = new Float32Array(numMergedVertices * 2);
        for (let i = 0; i < numMergedVertices; i++) {
            const previousIndex = previousIndexMap[i];
            uvsMerged[2 * i] = uvs[2 * previousIndex];
            uvsMerged[2 * i + 1] = uvs[2 * previousIndex + 1];
        }
    }
    let vertexNormalsMerged;
    if (vertexNormals) {
        vertexNormalsMerged = new Float32Array(numMergedVertices * 3);
        for (let i = 0; i < numMergedVertices; i++) {
            const previousIndex = previousIndexMap[i];
            vertexNormalsMerged[3 * i] = vertexNormals[3 * previousIndex];
            vertexNormalsMerged[3 * i + 1] = vertexNormals[3 * previousIndex + 1];
            vertexNormalsMerged[3 * i + 2] = vertexNormals[3 * previousIndex + 2];
        }
    }
    let vertexColorsMerged;
    if (vertexColors) {
        vertexColorsMerged = new Float32Array(numMergedVertices * 3);
        for (let i = 0; i < numMergedVertices; i++) {
            const previousIndex = previousIndexMap[i];
            vertexColorsMerged[3 * i] = vertexColors[3 * previousIndex];
            vertexColorsMerged[3 * i + 1] = vertexColors[3 * previousIndex + 1];
            vertexColorsMerged[3 * i + 2] = vertexColors[3 * previousIndex + 2];
        }
    }
    return {
        verticesMerged,
        uvsMerged,
        vertexNormalsMerged,
        vertexColorsMerged,
        facesIndexed,
    };
}
//# sourceMappingURL=geometry-utils.js.map