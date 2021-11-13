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
    const force = Physics.ForceMap.valenceAngle(d, data, params);
    expect(force).toEqual({ x: -0, y: 0, z: -0 });
})

it(`Force should have components x = y < 0, z = 0
    when angle is greater than 90 degrees`, () => {
    const d = { ri: { x: 0.1, y: 0.1, z: 0 } };
    const force = Physics.ForceMap.valenceAngle(d, data, params);
    console.log(force)
    expect(force.x).toEqual(force.y)
    expect(force.x).toBeLessThan(0)
    expect(force.z).toEqual(0)
    // returns Object { x: -0.21591652911979636, y: 0.21591652911979636, z: -0 }
    // looks suspect to me
})


// d = { ri: { x: 0, y: 0, z: 0.1 } };
// force should have components x = y > 0, z < 0 since the angle is less than 90º
// test.valenceAngle(d, data, params);
// returns Object { x: 0.009900666556273618, y: -0.009900666556273618, z: -0 }
// again this doesn't look correct
