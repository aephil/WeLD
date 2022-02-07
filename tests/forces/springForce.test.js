const Vector = require('../../transpiled/modules/physics/Vector');
const ForceMap = require('../../transpiled/modules/physics/ForceMap');

const k = 1
// equilibrium separation
const r0 = 10
const neighbourIndex = 1

let data = {
    nodes:
        [
            { id: 0, ri: { x: 0, y: 0, z: 0 } },
            { id: 1, ri: { x: 0, y: 0, z: 0 } }
        ]
};

const params = [k, r0, neighbourIndex]
let d = data.nodes[0]

describe('Harmonic spring potential', () => {
    it("Force should be zero when nodes are at equilibrium separation", () => {
        data.nodes[1].ri = { x: r0, y: 0, z: 0 };
        const actions = ForceMap.spring(d, data, params)
        const force = actions[0][1]
        expect(Vector.norm(force)).toEqual(0)
    })

    it("Force should be attractive when nodes are further away then equilibrium separation", () => {
        data.nodes[1].ri = { x: r0, y: r0, z: r0 };
        const actions = ForceMap.spring(d, data, params)
        const force = actions[0][1]
        const ab = Vector.sub(data.nodes[1].ri, d.ri)
        const dot = Vector.dot(force, ab)
        // Check that direction of the force is positive on the axis
        // towards the other node
        expect(dot).toBeGreaterThan(0)
        // Check that the force is paralell to the separation
        // between the nodes
        expect(dot).toBeCloseTo(Vector.norm(force) * Vector.norm(ab), 12)
    })

    it("Force should be repulsive when nodes are closer than equilibrium separation", () => {
        data.nodes[1].ri = { x: r0 * 0.1, y: r0 * 0.1, z: r0 * 0.1 };
        const actions = ForceMap.spring(d, data, params)
        const force = actions[0][1]
        const ab = Vector.sub(data.nodes[1].ri, d.ri)
        const dot = Vector.dot(force, ab)
        // Check that the direction of the force is negative
        // on the axis towards the other node
        expect(dot).toBeLessThan(0)
        // Check that the force is anti-paralell to the separation
        // between the nodes
        expect(dot).toBeCloseTo(-1 * Vector.norm(force) * Vector.norm(ab), 12)
    })

    it("Force should scale linearly with separation", () => {
        // separation of 10 units
        data.nodes[1].ri = { x: r0 + 10, y: 0, z: 0 };
        const actions1 = ForceMap.spring(d, data, params)
        const force1 = actions1[0][1]

        // separation of 20 units
        data.nodes[1].ri = { x: r0 + 20, y: 0, z: 0 };
        const actions2 = ForceMap.spring(d, data, params);
        const force2 = actions2[0][1]

        // Expect force2 to be twice as large as force1
        expect(Vector.norm(force2) / Vector.norm(force1)).toBeCloseTo(2, 12)
        // Check that force1 is parallell to force2 (and not anti-paralell)
        const dot = Vector.dot(force1, force2);
        expect(dot).toBeCloseTo(Vector.norm(force1) * Vector.norm(force2), 12)
    })
})

