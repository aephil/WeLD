import Vector from '../modules/physics/Vector.js';
import lattice from '../modules/physics/Lattice.js';
import verlet from '../modules/physics/Verlet.js'
import {boltzmann} from '../modules/physics/Units.js'

export const Physics = { Vector, lattice, verlet,
                         boltzmann,
                        };


export default Physics;
