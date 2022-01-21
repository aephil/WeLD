// This module contains quantities
// that we can continually monitor, for example
// the total energy

export function calculateQuantities(lattice) {
        lattice.quantities.forEach(quantity => {
            quantity.value = quantity.calculate(lattice);
        })
    };


export class KineticEnergy {
    constructor() {
        this.value = null;
    }

    calculate(lattice) {
        let KE = 0;
        lattice.data.forEach(d => {
            const nodeKE = 1/2 * d.m * (d.vi.x ** 2 + d.vi.y ** 2 + d.vi.z ** 2);
            KE += nodeKE;
    // })
        });
        return KE;
    }
}

export class PotentialEnergy {
    constructor() {
        this.value = null;
    }

    calculate(lattice) {
        let PE = 0;
        lattice.data.forEach(d => {
            const nodePE = d.m * d.potential;
            PE += nodePE;
        })
        return PE;
    }
}
