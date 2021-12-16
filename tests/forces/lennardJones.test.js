const Vector = require('../../transpiled/modules/physics/Vector');
const ForceMap = require('../../transpiled/modules/physics/ForceMap');

let data = [
    {id: 0, ri: {x: 0, y: 0, z: 0}},
    {id: 1, ri: {x: 0, y: 10, z: 0}}
]

const params = [1, 10, 1];
const [epsilon, sigma, neighbourIndex] = params;
const r0 = sigma * (2 ** (1/6))

describe('Lennard Jones force', () => {
    it("Force is zero at distance equal to r0", () => {
        data[1].ri.y = r0;
        const d = data[0];

        const actions = ForceMap.lennardJones(d, data, params);
        const fa = actions[0][1];
        const fb = actions[1][1];
        // Use toBeClose to instead of toEqual because
        // Sometimes the code produces a magnitude on
        // the order of around 1e-16 instead of 0, which is fine,
        // The second argument to toBeCloseTo is the number
        // of decimal digits we want precision to
        expect(Vector.norm(fa)).toBeCloseTo(0, 14);
        expect(Vector.scale(-1, fa)).toEqual(fb);
    })

    it("Force is attractive at distance greater than sigma * 2^(1/6)", () => {
        data[1].ri = {x: r0, y: r0, z: r0};
        const d = data[0];
        const a = d;
        const b = data[1];
        const actions = ForceMap.lennardJones(d, data, params);
        const fa = actions[0][1];
        const fb = actions[1][1];
        const ab = Vector.sub(b.ri, a.ri);
        const ba = Vector.scale(-1, ab);
        // this dot product is positive if the force on
        // a is towards b, negative if the force points
        // away from b
        expect(Vector.dot(ab, fa)).toBeGreaterThan(0);
        // this dot product checks the same thing, but for
        // node b instead
        expect(Vector.dot(ba, fb)).toBeGreaterThan(0);
    })

    it("Force is repelling at distance less than r0", () => {
        data[1].ri = {x: r0 * 0.1, y: r0 * 0.1, z: r0 * 0.1};
        const d = data[0];
        const a = d;
        const b = data[1];
        const actions = ForceMap.lennardJones(d, data, params);
        const fa = actions[0][1];
        const fb = actions[1][1];
        const ab = Vector.sub(b.ri, a.ri);
        const ba = Vector.scale(-1, ab);
        expect(Vector.dot(ab, fa)).toBeLessThan(0);
        expect(Vector.dot(ba, fb)).toBeLessThan(0);
    })

    it("Force should be very small at distance much larger than r0", () => {
        data[1].ri = {x: r0 * 1000, y: r0 * 1000, z: r0 * 1000};
        const d = data[0];
        const a = d;
        const b = data[1];
        const actions = ForceMap.lennardJones(d, data, params);
        const fa = actions[0][1];
        const fb = actions[1][1];
        const ab = Vector.sub(b.ri, a.ri);
        const ba = Vector.scale(-1, ab);
        expect(Vector.norm(fa)).toBeLessThan(1e-16);
        expect(Vector.scale(-1, fa)).toEqual(fb);
    })

    it("Force should be very large at distance much smaller than r0", () => {
        data[1].ri = {x: r0 * 0.001, y: r0 * 0.001, z: r0 * 0.001};
        const d = data[0];
        const a = d;
        const b = data[1];
        const actions = ForceMap.lennardJones(d, data, params);
        const fa = actions[0][1];
        const fb = actions[1][1];
        const ab = Vector.sub(b.ri, a.ri);
        const ba = Vector.scale(-1, ab);
        expect(Vector.norm(fa)).toBeGreaterThan(1e+20);
        expect(Vector.scale(-1, fa)).toEqual(fb);
    })
})
