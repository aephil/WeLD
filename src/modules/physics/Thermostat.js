import { approxEqual, randomNumber } from '../helpers.js';
import Vector from './Vector.js';

export const testThermostat = function(shared) {
            const temp = shared.temperature;
            const KE = shared.quantities[0].value;
            const PE = shared.quantities[1].value;

            const k = 1; // let k be 1 for now
            // from <H> = <H_kin> + <H_pot> = kT
            shared.realTemp = (2.0/(3.0* k)) * (KE+PE);
         
            if(approxEqual(temp, shared.realTemp, 1e-5)){
                return;
            }
            else
            {
                // by how much
                let tempRatio = ( shared.realTemp / temp);
                let N = shared.nodes.length;
                shared.nodes.forEach( node => {
                    node.vi = {
                        x: node.vi.x/tempRatio, 
                        y: node.vi.y/tempRatio, 
                        z: node.vi.z/tempRatio,}
                });
            }
        };