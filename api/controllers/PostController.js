/**
 * PostController
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
  //Fonction qui récupère le post du formulaire d'inscription et qui le traite
  inscription: function (req, res)
  {
  	var nom = general.encode(req.param("nom"));
  	var prenom = general.encode(req.param("prenom"));
  	var pseudo = general.encode(req.param("pseudo"));
  	var mail = general.encode(req.param("mail"));
  	var pass = general.encode(req.param("pass"));

  	var hasher = require("password-hash");
  	var hash_pass = hasher.generate(pass);

  	console.log("Inscription d'un joueur : ");

  	Joueurs.findOneByPseudo(pseudo).done(function (err, joueurPseudo) {
  		if(err)
  		{
  			log.ErreurDb(err, "Check Pseudo", "PostController::inscription");
  			res.setHeader("error", "Erreur - Merci de re-essayer");
  			res.send(500, "Erreur");
  		}
  		else if(typeof(joueurPseudo) != "undefined")
  		{
  			res.setHeader("error", "Pseudo déjà existant");
  			res.send(400, "Pseudo déjà existant");
  		}
  		else
  		{
  			console.log("Check Pseudo : Ok");
  			Joueurs.findOneByMail(mail).done(function (err, joueurMail) {
  				if(err)
  				{
  					log.ErreurDb(err, "Check Mail", "PostController::inscription");
  					res.setHeader("error", "Erreur - Merci de re-essayer");
					res.send(500, "Erreur");
  				}
  				else if(typeof(joueurMail) != "undefined")
  				{
  					res.setHeader("error", "Mail déjà existant");
  					res.send(400, "Mail déjà existant");
  				}
  				else
  				{
  					console.log("Check Mail : Ok");
  					console.log("Création des ressources du joueurs");
            //On cré en premier les ressources du joueur
            var Ressource = {};

            Ressource.Argent = '60000000';
            Ressource.Aluminium = '200';
            Ressource.Titane = '200';
            Ressource.Carbone = '100';
            Ressource.Uranium = '0';
            Ressource.Energie = '0';
            Ressource.Matiere_Premiere = '300';

            JSON.stringify(Ressource);

            Ressources.create(Ressource).done(function (err, RessourcesSave) {
              if(err)
              {
                log.ErreurDb(err, "Création Ressources Joueur", "PostController::inscription");
                res.setHeader("error", "Erreur - Merci de re-essayer");
                res.send(500, "Erreur");
              }
              else
              {
                //On récupère la date d'inscription
                var now = new Date();
                var nowFormat = general.formate_date(now);

                var Joueur = {};

                Joueur.RessourcesId = RessourcesSave.id;
                Joueur.Nom = nom;
                Joueur.Prenom = prenom;
                Joueur.Pseudo = pseudo;
                Joueur.Mail = mail;
                Joueur.Pass = hash_pass;
                Joueur.DateI = nowFormat;
                Joueur.Active = 1;
                Joueur.IP = req.connection.remoteAddress;

                JSON.stringify(Joueur);

                console.log("Création du Joueur");

                Joueurs.create(Joueur).done(function (err, JoueurSave) {
                  if(err)
                  {
                    log.ErreurDb(err, "Création joueur -> Suppression des ressources", "PostController::inscription");
                    //On supprime les ressources crées précédemment
                    RessourcesSave.destroy(function (err) {
                      if(err)
                      {
                        log.ErreurDb(err, "Suppression des ressources", "PostController::inscription");
                        res.setHeader("error", "Erreur - Merci de re-essayer");
                        res.send(500, "Erreur");
                      }
                      else
                      {
                        res.setHeader("error", "Erreur - Merci de re-essayer");
                        res.send(500, "Erreur");
                      }
                    });
                  }
                  else
                  {
                    //Suite inscription
                    //Atribution planète
                    galaxie.setPlaneteMere(JoueurSave.id);
 
                    console.log("Joueur enregistré ( id : "+JoueurSave.id+" - Pseudo : "+JoueurSave.Pseudo+" )");
                    res.send(JoueurSave);
                  }
                });
              }
            });
  				}
  			});
  		}
  	});

  },
  //Fonction qui récupère le POST du formulaire de connexion et qui le traite
  connexion: function (req, res)
  {

  	var pseudo = general.encode(req.param("pseudo"));
  	var pass = general.encode(req.param("pass"));

  	//On récupère le module de hash password
  	var hasher = require("password-hash");

  	console.log("Tentative de connextion ( Pseudo : "+pseudo+" )");

  	//On tente de récupérer le joueur, si il est présent en base de donnée
  	Joueurs.findOneByPseudo(pseudo).done(function (err, joueur) {
  		if(err)
  		{
  			log.ErrerDb(err, "Recherche joueur connexion", "PostController::connexion");
  			res.setHeader("error", "Erreur - Merci de re-essayer");
  			res.send(500, "Erreur");
  		}
  		else
  		{
  			//Si on a récupérer un joueur
  			if(typeof(joueur) != "undefined")
  			{
  				console.log("Pseudo correct...");
  				//On vérifie que le mot de pase correspond
  				if(hasher.verify(pass, joueur.Pass))
  				{
  					console.log("Mot de passe correct...");
  					console.log("Connexion réussi pour le joueur "+joueur.idJoueurs+" ( "+joueur.Mail+" )");

  					//On enregistre la connexion en bdd dans la table connexion
  					//R2cupération de la date et mise au format (sur 2 chiffres)
  					var now = new Date();
  					var nowFormat = general.formate_date(now);

  					var newConn = {};

  					newConn.Joueurs_idJoueurs = joueur.idJoueurs;
  					newConn.IP = req.connection.remoteAddress;
  					newConn.DateC = nowFormat;

  					Connexions.create(newConn).done(function (err, connexion) {
  						if(err)
  						{
  							log.ErreurDb(err, "Log connexion", "PostController::connexion");
  							res.setHeader("error", "Erreur. Merci de re-essayer");
  							res.send(500, "error");
                req.session.joueur = null;
  						}
  						else
  						{
                //On met en session les infos joueurs
               
                var session = general.new_session(hasher);
                joueur.Session = session;
                joueur.save(function (err) {
                   req.session.joueur = joueur;
                   req.session.socketSession = session;
                   res.send(joueur);
                });
  						}
  					});
  				}
          else
          {
            res.setHeader("error", "Mot de passe incorrect");
            res.send(400, "Mot de passe incorrect");
          }
  			}
        else
        {
          res.setHeader("error", "Joueur introuvable");
          res.send(400, "Joueur introuvable");
        }
  		}
  	});
  },
  updateimposition: function(req, res) 
  {
    var idPlanetes = general.encode(req.param("planete"));
    var idJoueurs = req.session.joueur.idJoueurs;
    var taux = general.encode(req.param("taux"));

    Planetes.findOneByIdPlanetes(idPlanetes).where({JoueursId: idJoueurs}).done(function(err, planete) {
      if(err)
      {
        log.ErreurDb(err, "Récupération planète d'un joueur", "PostController::changeImposition");
        
      }
      else
      {
        if(planete)
        {
          planete.Taux_Imposition = taux;
          planete.save(function (err) {
            res.send(planete);
          });
        }
        else
        {
          
        }
      }
    });
  }
};
