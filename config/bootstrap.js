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

	//TODO Lancement de tous les ordres en cours
	//Récupération des ordres en cours
	Ordres.findByEtat(0).done(function (err, ordres) {
		if(err)
			log.ErreurDb(err, "FIND tous les ordres", "config/bootstrap::function()");
		else
		{
			if(ordres)
			{
				for (var i = ordres.length - 1; i >= 0; i--) {
					//On calcul le nouveau temps nécessaire
					var now = new Date().getTime();
					var timestampFin = ordres[i].Date_Debut + ordres[i].Temps;
					var newTimestamp = timestampFin - now;
					console.log(newTimestamp);
					//Si newTimestamp est négatif, l'ordre est finit
					if(newTimestamp <= 0)
					{
						ordre.finishOrder(ordres[i]);
					}
					else
					{
						console.log("Ordre n°"+ordres[i].id+" relancé pour "+(newTimestamp/1000)+" sec. (Total : "+(ordres[i].Temps/1000)+")");
						//Sinon on balance l'ordre
						ordres[i].sessionJoueur = "";
						ordreFinish = ordres[i];
						ordre.asyncOrder(parseInt(newTimestamp), function() {
                			ordre.finishOrder(ordreFinish);
              			});
					}
				}
				cb();
			}
		}
	});

};