Physics = {};
require('../../modules/physics/ForceMap');

describe("Test force", () => {
    it("Test force returns (1, 1, 1)", () => {
        const d = {id: 0};
        const data = [{}];
        const params = [];
        const actions = Physics.ForceMap["Test Force"](d, data, params);
        expect(actions).toEqual([[d.id, {x: 100, y: 100, z: 0}]]);
    })
})

