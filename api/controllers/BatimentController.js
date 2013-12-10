/**
 * BatimentController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    universite: function (req, res)
    {

    },
    laboratoire: function (req, res)
    {

    },
    details: function (req, res)
    {
    	Joueurs.findOneByPseudo(req.session.joueur.Pseudo).done(function (err, joueur) {
	      	joueur.getRessources(function (ressource) {
	        joueur.Ressources = ressource;
	        var idBatiments = req.param("idBatiment");
  				var idPlanetes = req.param("idPlanete");
          joueur.idBatiment = idBatiments;
          joueur.idPlanete = idPlanetes;
  				joueur.Batiment = {};
  				joueur.InfosBatiment = {};
  				async.parallel({
  					batimentJoueur: function (callback) {
  						Joueur_has_batiment.findOneByPlanetesId(idPlanetes).where({BatimentsId: idBatiments}).done(function (err, batimentJoueur) {
				        	if(err)
					  		{
					  			log.ErreurDb(err, "Erreur Db - Récupération d'un bâtiment par idPlanetes et idBatiments", "BatimentController::details");
					  			callback(err, null);
					  		}
					  		else
					  		{
				  				callback(null, batimentJoueur);
					  		}
		        		});
  					},
  					batimentInfos: function (callback) {
  						Batiments.findOneByIdBatiments(idBatiments).done(function (err, batiment) {
  							if(err)
					  		{
					  			log.ErreurDb(err, "Erreur Db - Récupération d'un bâtiment", "BatimentController::details");
					  			res.redirect("/micro/"+idPlanetes);
					  		}
					  		else
					  		{
					  			if(batiment)
					  			{
					  				callback(null, batiment);
					  			}
					  			else
					  			{
					  				callback("Bâtiment introuvable", null);
					  			}
					  		}
  						});
  					}
  				},
  				function (err, results) {
  					if(err != null)
  					{
  						res.redirect("/micro"+idPlanetes);
  					}
  					else
  					{
  						joueur.batimentJoueur = results.batimentJoueur;
  						joueur.batimentInfos = results.batimentInfos;
  						joueur.socketSession = req.session.socketSession;
		        		res.view({joueur: joueur});
  					}
  				});
	        });
	    });  	
    },

  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to BatimentController)
   */
  _config: {}

  
};
