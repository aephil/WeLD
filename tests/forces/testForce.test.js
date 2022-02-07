const ForceMap = require('../../transpiled/modules/physics/ForceMap');

describe("Test force", () => {
    it("Test force returns (1, 1, 1)", () => {
        const d = {id: 0, ri: {x: 1, y: 1, z: 1}};
        const data = [{}];
        const params = [];
        const actions = ForceMap.testForce(d, data, params);
        expect(actions).toEqual([[
            d.id,
            {x: 100, y: 100, z: 0},
            -200
        ]]);
    })
})

