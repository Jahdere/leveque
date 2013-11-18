//Fonciton qui log les erreurs Base de données
var ErreurDb = function (Erreur, Message, Fichier)
{
	//log console
	console.log("Erreur DB - "+Message+" - ("+Fichier+")");
	console.log(Erreur);

	//log fichier

}

exports.ErreurDb = ErreurDb;