const Vector = require('../../transpiled/modules/physics/Vector');
const ForceMap = require('../../transpiled/modules/physics/ForceMap')

let shared =
    {
        nodes:  [
            { id: 0, ri: { x: 1, y: 0, z: 0 } },
            { id: 1, ri: { x: 0, y: 0, z: 0 } },
            { id: 2, ri: { x: 0, y: 1, z: 0 }
            }]
    };

let params = [1, Math.PI / 2, 0, 2];

describe("Valence angle interaction", () => {
    it("Object at origin should return 0 force", () => {
        const d = shared.nodes[1]
        const actions = ForceMap.valenceAngle(d, shared, params);
        const fa = actions[0][1]
        const fb = actions[1][1]
        const fc = actions[2][1]

        expect(Vector.norm(fa)).toEqual(0)
        expect(Vector.norm(fb)).toEqual(0)
        expect(Vector.norm(fc)).toEqual(0)
    })

    it(`Force should have components x = y < 0, z = 0
        when angle is greater than 90 degrees`, () => {
        const d = { id: 1, ri: { x: 0.1, y: 0.1, z: 0 } };
        const actions = ForceMap.valenceAngle(d, shared, params);
        const fa = actions[0][1]
        const fb = actions[1][1]
        const fc = actions[2][1]
        expect(fb.x).toEqual(fb.y)
        expect(fb.x).toBeLessThan(0)
        expect(fb.z).toEqual(-0)
        expect(fa.x).toEqual(fc.y)
    })

    it(`Force should have components x = y > 0, z < 0 since
        the angle is less than 90 degrees`, () => {
        const d = { id: 1, ri: { x: 0, y: 0, z: 0.1 } };
        const actions = ForceMap.valenceAngle(d, shared, params);
        const fa = actions[0][1]
        const fb = actions[1][1]
        const fc = actions[2][1]
        expect(fb.x).toEqual(fb.y);
        expect(fb.x).toBeGreaterThan(0);
        expect(fb.z).toBeLessThan(0)
    })
})
