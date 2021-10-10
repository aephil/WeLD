var Verlet = function()
{
   var potentials=[]; // contains functions for
   var data=[]; // total force on each datapoint
   var dt = 1;

   var calculateForces = function(){
     data.forEach((d) => {
       potentials.forEach((dU) => {
         var potential = dU(d,data);
         var totalForce =
       });

     });

   }

}

Physics.Verlet = VerletP;
