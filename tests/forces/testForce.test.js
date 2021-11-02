Physics = {};
require('../../modules/physics/ForceMap');

it("Test force returns (1, 1, 1)", () => {
    const d = {};
    const data = [{}];
    const params = [];
    const force = Physics.ForceMap["Test Force"](d, data, params);
    expect(force).toEqual({x: 1, y: 1, z: 1});
})