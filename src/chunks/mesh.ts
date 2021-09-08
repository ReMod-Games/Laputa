import { Mesh, VertexData } from "https://esm.sh/@babylonjs/core@5.0.0-alpha.42";

function createMesh(customMesh: Mesh) {
    const positions = [ -5, 2, -3, -7, -2, -3, -3, -2, -3, 5, 2, 3, 7, -2, 3, 3, -2, 3 ];
    const indices = [ 0, 1, 2, 3, 4, 5 ];

    //Empty array to contain calculated values or normals added
    const normals: number[] = [];

    //Calculations of normals added
    VertexData.ComputeNormals(positions, indices, normals);

    const vertexData = new VertexData();

    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals; //Assignment of normal to vertexData added

    vertexData.applyToMesh(customMesh);
}
