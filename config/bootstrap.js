/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished 
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  //Lancement du cron qui se lance tous les soirs à 00h00 pour la résolution des cycles
  	var cronJob = require('cron').CronJob;
	var job = new cronJob('00 00 00 * * 1-7', function(){
	    // Runs every day
	    // at 00:00:00.
	    galaxie.cycle();
	  }, function () {
	    // This function is executed when the job stops
	    console.log("Mide à jour du cycle finit");
	  },
	  false /* Start the job right now */
	);
	job.start();
  cb();
};
