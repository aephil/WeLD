/*
This is a simple unit test showing how we can unit test functions in this codebase. Unfortunately,
neither ES6 nor CommonJS modules are available in the browser, only in nodejs environments, so without
doing a big rewrite where we use a local http server so we can use http modules, etc., I believe this
is the best we can do.

EXPLAINING THE UNIT TEST
We use CommonJS **require** to run the code in the file containing the functions we want to test. In this case,
the modules/physics/Vector.js script will add the Vector class to the Physics namespace. The problem is the Physics namespace
won't be defined as the Vector.js script relies on the namespaces/Physics.js script having been executed earlier. This is obviously
very bad practice, but if we don't want to do a big rewrite of the codebase I think we just have to deal with it. So, we use a global
variable to initialise it first. If the script relied on code being executed from scripts with more involved code, we would need to require
them beforehand, and then require the things they depend on etc., until we likely end up needing to require every script in the right order,
like the index.html file does. Nevertheles, as long as the functions we are testing are pure functions, it shouldn't be a huge deal.
*/

Physics = {};
require('../../modules/physics/Vector');

it("Converting a length 1 vector to a unit vector should return itself", () => {
    const v = {x: 1, y: 0, z: 0};
    const v2 = Physics.Vector.unitVector(v);
    expect(v).toEqual(v2);
})