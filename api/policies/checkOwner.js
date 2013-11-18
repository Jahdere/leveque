/**
 * 
 	Vérifie que le joueur est bien propriétaire de la planète qu'il veut gérer
 	Si il ne l'est pas, redirection vers /macro
 */
module.exports = function (req, res, ok) {

  if (req.session.joueur) {
  	var idPlanetes = req.param("id");
  	var idJoueurs = req.session.joueur.idJoueurs;

  	Planetes.findOneByIdPlanetes(idPlanetes).where({JoueursId: idJoueurs}).done(function (err, planete) {
  		if(err)
  		{
  			log.ErreurDb(err, "Erreur Db - Récupération Planète par idPlanetes et JoueursId", "policies/checkOwner::function() {};");
  			return res.redirect('/macro');
  		}
  		else
  		{
	  		if(planete)
	  		{
  				return ok();
	  		}
	  		else
	  		{
	  			return res.redirect('/macro');	
	  		}
	  	}
  	});
  }
  else {
    return res.redirect('/');
  }
};