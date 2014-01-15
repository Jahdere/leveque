//Fonciton qui lance un ordre en asynchrone.
var asyncOrder = function (time, cb)
{
	setTimeout(function() { cb(); }, parseInt(time));
}

var finishOrder = function (Ordre)
{
	//On récupère l'ordre
	Ordres.findOneById(Ordre.id).done(function (err, ordre) {
		if(err)
			log.ErreurDb(err, "Récupération d'un Ordre", "services/ordre::finishOrder");
		else
		{
			if(ordre)
			{
				ordre.Etat = 1;
				var async = require('async');
				ordre.save(function (err) {
					if(err)
						log.ErreurDb(err, "Sauvegarde d'un Ordre", "services/ordre::finishOrder");
					else
					{
						var now = new Date();
      					var nowFormat = general.formate_date_bilan(now);
						// TODO Sauvegarde bilan suivant le type
						switch(ordre.Type)
						{
							case 1:
								//Construction
								var bilan = {JoueursId: ordre.idJoueurs, 
											 Message: ordre.Message,
											 Titre: ordre.Titre,
											 Date: nowFormat,
											 Lu: 0}

								async.parallel({
									'bilan': function(cb){
										Bilans.create(bilan).done(function (err, bilanCreate) {
											if(err)
												cb(err,null);
												//log.ErreurDb(err, "Sauvegarde d'un bilan", "services/ordre::finishOrder");
											else
											{
												sails.io.sockets.emit("connect", function() {
													sails.io.sockets.emit("bilan"+Ordre.sessionJoueur, bilanCreate);
												});
												cb(null, bilanCreate);
											}
										});

									},
									'batiment': function(cb){
										Joueur_has_batiment.findOneByBatimentsId(Ordre.BatimentsId)
															.where({PlanetesId: Ordre.PlanetesId, Etat: 0})
																.done(function(err, batiment){
											if(err)
												cb(err, null);
											else
											{
												if(batiment)
												{
													batiment.Etat=1;
													batiment.save(function(err){
														if (err)
														{
															cb(err, null);
														}
														else
														{
															cb(null, batiment);
														}
													});
												}
												else
												{
													cb(0, null);
												}
											}
										});


									}
								},
    							function (err, results) {
    								if(err)
    								{
    									if(err==0)
    										console.log("Erreur: Pas de batiments trouvé")
    									else
    										log.ErreurDb(err, "Modification etat batiment", "services/ordres::finishOrder");
    								}
    								else
    								{
    									console.log("Ordre n°"+Ordre.id+" vient de s'exécuté ("+Ordre.Temps/1000+") sec");
    									console.log("Bilan créé :"+results.bilan.id);
    									console.log("Batiment n°"+results.batiment.BatimentsId+"sur la Planète n°"+results.batiment.PlanetesId+" a été créé");
    								}
    									
    							});

								break;
						}
					}
				});
			}
		}
	});
}

exports.asyncOrder = asyncOrder;
exports.finishOrder = finishOrder;