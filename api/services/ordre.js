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

								Bilans.create(bilan).done(function (err, bilanCreate) {
									if(err)
										log.ErreurDb(err, "Sauvegarde d'un bilan", "services/ordre::finishOrder");
									else
									{
										sails.io.sockets.emit("connect", function() {
											sails.io.sockets.emit("bilan"+Ordre.sessionJoueur, bilanCreate);
										});
										console.log("Ordre n°"+Ordre.id+" vient de s'exécuté ("+Ordre.Temps/1000+") sec");
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