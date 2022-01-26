import Vector from '../modules/physics/Vector.js';
import {Lattice} from '../modules/physics/Lattice.js';
import verlet from '../modules/physics/Verlet.js'
import {boltzmann} from '../modules/physics/Units.js'

export const Physics = { Vector, Lattice, verlet,
                         boltzmann,
                        };


export default Physics;
