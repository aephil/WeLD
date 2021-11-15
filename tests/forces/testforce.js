//copying the code from Forcemap.js and substituing the relevant data; :

class ForceMap {
    constructor() {
        var d = 5
        this.testForce = function (d, data, params) {
            // just for testing purposes
            return [[d.id, { x: 100, y: 100, z: 0 }]]
        };

        this.spring = function (d, data, params) {
            const [k, nodesLen, neighbourIndex] = params;
            const d2 = data[neighbourIndex];

            const dx = d.ri.x - d2.ri.x;
            const dy = d.ri.y - d2.ri.y;
            const dz = d.ri.z - d2.ri.z;

            const separation = { x: dx, y: dy, z: dz };
            const unitSeparation = Physics.Vector.unitVector(separation);

            const equilibrium = Physics.Vector.scale(nodesLen, unitSeparation);
            const extension = Physics.Vector.sub(separation, equilibrium);

            const fx = -k * extension.x;
            const fy = -k * extension.y;
            const fz = -k * extension.z;

            return [[d.id, { x: fx, y: fy, z: fz }]]
        };

        this.valenceAngle = function (d, data, params) {
            const [k, eqAngle, index1, index2] = params;
            var a = data[index1].ri;
            var b = d.ri; //central node
            var c = data[index2].ri;

            var ba = Physics.Vector.sub(a, b);
            var bc = Physics.Vector.sub(c, b);
            var cb = Physics.Vector.scale(-1, bc)

            var abc = Physics.Vector.angle(ba, bc);

            var pa = Physics.Vector.normalise(Physics.Vector.cross(ba, Physics.Vector.cross(ba, bc)));
            var pc = Physics.Vector.normalise(Physics.Vector.cross(cb, Physics.Vector.cross(ba, bc)));

            var faFactor = (-1) * k * (abc - eqAngle) / (Physics.Vector.norm(ba));
            faFactor = (isNaN(faFactor) ? 0 : faFactor);

            var fa = Physics.Vector.scale(faFactor, pa);

            var fcFactor = (-1) * k * (abc - eqAngle) / (Physics.Vector.norm(bc));
            fcFactor = (isNaN(fcFactor) ? 0 : fcFactor);

            var fc = Physics.Vector.scale(fcFactor, pc);
            var fb = Physics.Vector.scale(-1, Physics.Vector.add(fa, fc));
            return [[index1, fa], [d.id, fb], [index2, fc]];
        };

        this.forceMap = {
            "Test Force": this.testForce,
            "spring": this.spring,
            "valenceAngle": this.valenceAngle
        };

        return this.forceMap;
    }
}

const initValence = function (lattice, k = 1) {
    /*
    Performs the necessary initial setup for the Physics.Forcemap.valenceAngle method
    */
    lattice.data.forEach((d1) => {
        d1.forces.forEach((f1) => {
            if (f1.name == "spring") {
                let index1 = f1.params[2]
                let d2 = lattice.data[index1];
                d1.forces.forEach((f2) => {
                    let index2 = f2.params[2]
                    if (f2.name == "spring" && index2 != index1) {
                        let d3 = lattice.data[index2];
                        // calculate their equilibrium angles
                        let vec1 = Physics.Vector.sub(d3.ri, d1.ri);
                        let vec2 = Physics.Vector.sub(d2.ri, d1.ri);
                        let eqAngle = Physics.Vector.angle(vec1, vec2)
                        d1.forces.push(
                            {
                                name: "valenceAngle",
                                params: [k, eqAngle, index1, index2]
                            }
                        )
                    }
                });
            }
        });

    });

}

Physics.ForceMap = new ForceMap();
Physics.initValence = initValence;