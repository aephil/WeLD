Physics = {};
require('../../modules/physics/Vector');
require('../../modules/physics/ForceMap');

let data = [{ ri: { x: 1, y: 0, z: 0 } }, { ri: { x: 0, y: 1, z: 0 } }];

/// presumably this is a function or maybe a var (required verif)consisting of real coordinates of force
params = [1, Math.PI / 2, 0, 1];

/// This is the var storing angle data for the atom
// should be zero force since the angle is already 90º

it("Object at origin should return 0 force", () => {
    const d = { ri: { x: 0, y: 0, z: 0 } };
    const actions = Physics.ForceMap.valenceAngle(d, data, params);
    const fa = actions[0][1]
    const fb = actions[1][1]
    const fc = actions[2][1]

    expect(fb).toEqual({ x: -0, y: -0, z: 0 });
})

it(`Force should have components x = y < 0, z = 0
    when angle is greater than 90 degrees`, () => {
    const d = { ri: { x: 0.1, y: 0.1, z: 0 } };
    const actions = Physics.ForceMap.valenceAngle(d, data, params);
    const fa = actions[0][1]
    const fb = actions[1][1]
    const fc = actions[2][1]
    expect(fb.x).toEqual(fb.y)
    expect(fb.x).toBeLessThan(0)
    expect(fb.z).toEqual(-0)
})

it(`Force should have components x = y > 0, z < 0 since
    the angle is less than 90 degrees`, () => {
    const d = { ri: { x: 0, y: 0, z: 0.1 } };
    const actions = Physics.ForceMap.valenceAngle(d, data, params);
    const fa = actions[0][1]
    const fb = actions[1][1]
    const fc = actions[2][1]
    expect(fb.x).toEqual(fb.y);
    expect(fb.x).toBeGreaterThan(0);
    expect(fb.z).toBeLessThan(0)
})
