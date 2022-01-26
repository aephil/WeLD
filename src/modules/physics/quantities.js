// This module contains nodes
// that we can continually monitor, for example
// the total energy

export function calculateQuantities(shared) {
        shared.quantities.forEach(quantity => {
            quantity.value = quantity.calculate(shared);
        })
    };


export class KineticEnergy {
    constructor() {
        this.value = null;
    }

    calculate(shared) {
        let KE = 0;
        shared.nodes.forEach(d => {
            const nodeKE = 1/2 * d.m * (d.vi.x ** 2 + d.vi.y ** 2 + d.vi.z ** 2);
            KE += nodeKE;
        });
        return KE;
    }
}

export class PotentialEnergy {
    constructor() {
        this.value = null;
    }

    calculate(shared) {
        let PE = 0;
        shared.nodes.forEach(d => {
            PE += d.potential;
        })
        return PE;
    }
}
