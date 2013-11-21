/**
 * MainController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  index: function (req, res)
  {
    Joueurs.findOneByPseudo(req.session.joueur.Pseudo).done(function (err, joueur) {
      joueur.getRessources(function (ressource) {
        joueur.Ressources = ressource;
        joueur.getPlaneteMere(function (planete) {
          joueur.PlaneteMere = planete;
          joueur.socketSession = req.session.socketSession;
          res.view({joueur: joueur});
        });
      });
    });  	
  },

  macroGestion: function (req, res)
  {
    Joueurs.findOneByPseudo(req.session.joueur.Pseudo).done(function (err, joueur) {
      joueur.getRessources(function (ressource) {
        joueur.Ressources = ressource;
        Planetes.findByJoueursId(joueur.idJoueurs).sort('type').done(function (err, planetes) {
          if(err)
            log.ErreurDb(err, "Récupération des planètes urbanisées", "MainController::macroGestion");
          else
          {
            joueur.Planetes = planetes;
            res.view({joueur: joueur});
          }
        });
      });
    });   
  },

  microGestion: function (req, res)
  {
    var idPlanetes = req.param("id");
    var joueur = req.session.joueur;
     Joueurs.findOneByPseudo(req.session.joueur.Pseudo).done(function (err, joueur) {
      joueur.getRessources(function (ressource) {
        joueur.Ressources = ressource;
        Planetes.findOneByIdPlanetes(idPlanetes).done(function(err, Planete) {
          if(err)
          {
            log.ErreurDb(err, "Récupération d'une planète", "MainController::microGestion");
          }
          else
          {
            joueur.Planete = Planete;
            res.view({joueur: joueur});
          }
        });
      });
    });   
  }

};
