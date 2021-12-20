# WeLD
Web Lattice Dynamics: atomic motion in crystals, in a browser

Preview of `master` branch `index.html`:
https://htmlpreview.github.io/?https://github.com/aephil/WeLD/blob/master/index.html

## Running the code
First, install the required npm modules:
`npm install --dev`. <br>
Make sure you have `npx` installed globally (`npm install -g npx`).<br>
Run the http server with the command `npm start`

## Unit tests
Unit tests for key bits of code should be put index
`tests/someDirectory/testFileNumberOne.test.js`.
To run the tests, run `npm test` from your terminal.
If the source code has changed since it was last transpiled,
it needs to be transpiled again before you rerun the tests.
To tranpsile, run `npm run transpile`. However, `npm test`
automatically does this. If you know you don't need to
transpile again and want to save time, you can use `npm run _test`,
which will not transpile the source code again.

**IMPORTANT**: When importing functions using `require` in the
node environment, you must access the `transpiled` directory rather
than `src`. So for example, to require `src/modules/physics/ForceMap.js`
from `tests/file.test.js`, you need the path `../transpiled/modules/physics/ForceMap`,
not `../src/transpiled/modules/physics/ForceMap`.

## Imports/exports
When running code in the browser, use ES6 module syntax, e.g.:
```javascript
// path/to/functionDefinedHere.js
export const myFunc = function(x, y, z) {
    // do stuff
}

// programs/iWantTheFunctionInThisFile.js
import {myFunc} from '../path/to/functionDefinedHere.js';
// Now w can use myFunc in this file
```

When running code in NODE, e.g. for running tests, first make
sure you have transpiled the source code since the last change to
the source code (Happens automatically if you use `npm test` to run the tests),
and then use CommonJS module syntax, with
the caveat that you need to access the `transpiled` directory isntead
of the `src` directory, e.g.:

```javascript
// path/to/functionDefinedHere.js
export const myFunc = function(x, y, z) {
    // do stuff
}

// tests/testMyFunc.test.js
const myFunc = require('../../transpiled/path/to/functionDefinedHere');
// Now we can use myFunc in this file
```
Note that when we use the CommonJS syntax, we do not put the `.js`
at the end, whereas we do when we use ES6, and additionally it is important
that when using `require` in node for this codebase that you access
the `transpiled` directory.
