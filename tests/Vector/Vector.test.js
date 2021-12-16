const Vector = require('../../transpiled/modules/physics/Vector.js');

describe("Vector module", () => {
    it("Converting a length 1 vector to a unit vector should return itself", () => {
        const v = {x: 1, y: 0, z: 0};
        const v2 = Vector.unitVector(v);
        expect(v).toEqual(v2);
    })
})


