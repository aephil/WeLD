const {square} = require('../transpiled/modules/testModule.js');

console.log('worked');

describe("Testing modules", () => {
    it("Test", () => {
        expect(square(2)).toEqual(4);
    })
})
