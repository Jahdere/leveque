//Fonction qui log les bilans du joueur
var logBilans = function (bilan)
{
	var bilanSave = {};

	bilanSave.JoueursId = bilan.JoueursId;
	bilanSave.Titre = "Rapport de cycle";
	var now = new Date();
	bilanSave.Date = formate_date_bilan(now);
	bilanSave.Message = "Bla Bla";
	bilanSave.Lu = 0;
	console.log("toto");

	JSON.stringify(bilanSave);
	console.log(bilanSave);
	Bilans.create(bilanSave).done(function(err, Bilan){
		sails.io.sockets.emit("connect", function() {
			sails.io.sockets.emit("bilan"+bilan.Session, Bilan);
		});
	});
}

//Fonction qui met une date pour bdd au bon format (en mettant sur 2 chiffres)
//Prend un objet date (new Date()) et qui retourne une chaine de caractère
var formate_date_bilan = function (date)
{
  var month = ("0" + (date.getMonth()+1).toString()).slice(-2);
  var day = ("00" + date.getDate().toString()).slice(-2);
  var hours = ("00" + date.getHours().toString()).slice(-2);
  var minutes = ("00" + date.getMinutes().toString()).slice(-2);

  var nowFormat = day+"/"+month+" "+hours+":"+minutes;

  return nowFormat;
}

exports.logBilans = logBilans;