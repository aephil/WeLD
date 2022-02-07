const Vector = require('../../transpiled/modules/physics/Vector');
const ForceMap = require('../../transpiled/modules/physics/ForceMap');

const k = 1
// equilibrium separation
const r0 = 10
const neighbourIndex = 1

let shared = {
    nodes:
        [
            { id: 0, ri: { x: 0, y: 0, z: 0 } },
            { id: 1, ri: { x: 0, y: 0, z: 0 } }
        ]
};

const params = [k, r0, neighbourIndex]
let d = shared.nodes[0]

describe('Harmonic spring potential', () => {
    it("Force and potential should be zero when nodes are at equilibrium separation", () => {
        shared.nodes[1].ri = { x: r0, y: 0, z: 0 };
        const actions = ForceMap.spring(d, shared, params)
        const force = actions[0][1]
        const potential = actions[0][2];
        expect(Vector.norm(force)).toEqual(0)
        expect(potential).toEqual(0);
    })


    it("Force should be attractive and potential should be positive when nodes are further away then equilibrium separation", () => {
        shared.nodes[1].ri = { x: r0, y: r0, z: r0 };
        const actions = ForceMap.spring(d, shared, params)
        const force = actions[0][1]
        const potential = actions[0][2];
        const ab = Vector.sub(shared.nodes[1].ri, d.ri)
        const dot = Vector.dot(force, ab)
        // Check that direction of the force is positive on the axis
        // towards the other node
        expect(dot).toBeGreaterThan(0)
        // Check that the force is paralell to the separation
        // between the nodes
        expect(dot).toBeCloseTo(Vector.norm(force) * Vector.norm(ab), 12)
        expect(potential).toBeGreaterThan(0);
    })

    it("Force should be repulsive and potential should be positive when nodes are closer than equilibrium separation", () => {
        shared.nodes[1].ri = { x: r0 * 0.1, y: r0 * 0.1, z: r0 * 0.1 };
        const actions = ForceMap.spring(d, shared, params)
        const force = actions[0][1]
        const potential = actions[0][2];
        const ab = Vector.sub(shared.nodes[1].ri, d.ri)
        const dot = Vector.dot(force, ab)
        // Check that the direction of the force is negative
        // on the axis towards the other node
        expect(dot).toBeLessThan(0)
        // Check that the force is anti-paralell to the separation
        // between the nodes
        expect(dot).toBeCloseTo(-1 * Vector.norm(force) * Vector.norm(ab), 12)
        expect(potential).toBeGreaterThan(0);
    })

    it("Force should scale linearly with separation, and potential should scale quadratically", () => {
        // separation of 10 units
        shared.nodes[1].ri = { x: r0 + 10, y: 0, z: 0 };
        const actions1 = ForceMap.spring(d, shared, params)
        const force1 = actions1[0][1]
        const potential1 = actions1[0][2];

        // separation of 20 units
        shared.nodes[1].ri = { x: r0 + 20, y: 0, z: 0 };
        const actions2 = ForceMap.spring(d, shared, params);
        const force2 = actions2[0][1];
        const potential2 = actions2[0][2];
        // Expect force2 to be twice as large as force1
        expect(Vector.norm(force2) / Vector.norm(force1)).toBeCloseTo(2, 12)
        // Check that force1 is parallell to force2 (and not anti-paralell)
        const dot = Vector.dot(force1, force2);
        expect(dot).toBeCloseTo(Vector.norm(force1) * Vector.norm(force2), 12)
        // Expect potential2 to be four times as large as potential1, and both positive
        expect(potential1).toBeGreaterThan(0);
        expect(potential2).toBeGreaterThan(0);
        expect(potential2).toEqual(4 * potential1);
    })

    it("When multiplying separation by -1, force should be inverted but potential should stay the same", () => {
        shared.nodes[1].ri = {x: 10, y: 0, z: 0};
        const separation1 = Vector.sub(shared.nodes[1].ri, shared.nodes[0].ri);
        const actions1 = ForceMap.spring(d, shared, params);
        const force1 = actions1[0][1];
        const potential1 = actions1[0][2];

        // Inverting separation
        shared.nodes[1].ri = {x: -10, y: 0, z: 0};
        const actions2 = ForceMap.spring(d, shared, params);
        const force2 = actions2[0][1];
        const potential2 = actions2[0][2];

        // checking that separtion was correctly inverted
        const separation2 = Vector.sub(shared.nodes[1].ri, shared.nodes[0].ri);
        const sum = Vector.add(separation2, separation1);
        expect(Vector.norm(sum)).toEqual(0);

        // Checking that force was inverted
        const forceSum = Vector.add(force1, force2);
        expect(Vector.norm(forceSum)).toEqual(0);

        // Checking that potential was unchanged
        expect(potential1).toEqual(potential2)
    })
})

