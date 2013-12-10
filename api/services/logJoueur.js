//Fonction qui log les bilans du joueur
var logBilans = function (bilan)
{
	var bilanSave = {};

	bilanSave.JoueursId = bilan.JoueursId;
	bilanSave.Titre = "Rapport de cycle";
	var now = new Date();
	bilanSave.Date = general.formate_date_bilan(now);
	bilanSave.Message = "Bla Bla";
	bilanSave.Lu = 0;

	JSON.stringify(bilanSave);
	Bilans.create(bilanSave).done(function (err, Bilan){
		sails.io.sockets.emit("connect", function() {
			sails.io.sockets.emit("bilan"+bilan.Session, Bilan);
		});
	});
}

exports.logBilans = logBilans;