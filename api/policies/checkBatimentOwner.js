/**
 * 
 	Vérifie que le joueur est bien propriétaire d'un planète qui possède bien le bâtiment passé en paramètre
 	Si il ne l'est pas, redirection vers /macro
 */
module.exports = function (req, res, ok) {

  if (req.session.joueur) {
  	var idBatiments = req.param("idBatiment");
  	var idPlanetes = req.param("idPlanete");
    var idJoueurs = req.session.joueur.idJoueurs;
    //console.log("Accès à un bâtiment.");
    //console.log("Recherche si la planète appartient au joueur ...");
    //On véririfie que la planète lui appartient
  	Planetes.findOneByIdPlanetes(idPlanetes).where({JoueursId: idJoueurs}).done(function (err, planete) {
  		if(err)
  		{
  			log.ErreurDb(err, "Erreur Db - Récupération Planète par idPlanetes et JoueursId", "policies/checkBatimentOwner::function() {};");
  			return res.redirect('/macro');
  		}
  		else
  		{
	  		if(planete)
	  		{
          //console.log("Planète trouvées.");
          //On vérifie alors que la planète à ce bâtiment
          //console.log("Recherche du bâtiment sur la planète ...");
          Joueur_has_batiment.findOneByPlanetesId(idPlanetes).where({BatimentsId: idBatiments}).done(function (err, batimentJoueur) {
            if(err)
            {
              log.ErreurDb(err, "Erreur Db - Récupération d'un batiment par PlanetesId et BatimentId", "policies/checkBatimentOwner::function() {};");
              return res.redirect('/macro');
            }
            else
            {
              if(batimentJoueur)
              {
                //console.log("Bâtiment trouvé.");
                //console.log("Accès autorisé.");
                return ok();
              }
              else
              {
                //Sinon il faut vérifier qu'il peut le construire
                //console.log("Bâtiment introuvable.");
                //console.log("Recherche infos Bâtiment pour pré-requis ...");
                //On récupère le batiment
                Batiments.findOneByIdBatiments(idBatiments).where({Type_Planete: planete.Type}).done(function (err, batiment) {
                  if(err)
                  {
                    log.ErreurDb(err, "Erreur Db - Récupération d'un batiment", "policies/checkBatimentOwner::function() {};");
                    return res.redirect('/micro/'+planete.idPlanetes);
                  }
                  else
                  {
                    if(batiment)
                    {
                      //console.log("Bâtiment trouvé.");
                      switch(batiment.Dependance_Table)
                      {
                        case '-':
                          //console.log("Dépendance : néant.");
                          //console.log("Accès autorisé.");
                          ok();
                          break;
                        case 'sciences':
                          //console.log("Dépendance : science.");
                          //console.log("Check si le joueur à déjà recherché la science ...");
                          //On vérifie que le joueur à la bonne science
                          Joueur_has_science.findOneBySciencesId(batiment.Dependance_Id).where({JoueursId: idJoueurs}).done(function (err, scienceRequise) {
                            if(err)
                            {
                              log.ErreurDb(err, "Erreur Db - Récupération d'une science par idSciences et idJoueurs", "policies/checkBatimentOwner::function() {};");
                              return res.redirect('/micro/'+planete.idPlanetes);
                            }
                            else
                            {
                              if(scienceRequise)
                              {
                                //console.log("Science trouvée.");
                                //console.log("Check Niveau requis ...");
                                //Si la science est au bon niveau
                                if(batiment.Dependance_Niveau == "n" || batiment.Dependance_Niveau == "unique")
                                {
                                  niveauRequis = 1;
                                }
                                else
                                {
                                  niveauRequis = 2;
                                }

                                if(scienceRequise.Niveau >= niveauRequis)
                                {
                                  //console.log("Niveau suffisant. Accès autorisé.");
                                  ok();
                                }
                                else
                                {
                                  //console.log("Niveau insuffisant. Redirection.");
                                  return res.redirect('/micro/'+planete.idPlanetes);
                                }
                              }
                              else
                              {
                                //console.log("Science introuvable. Redirection.");
                                return res.redirect('/micro/'+planete.idPlanetes);
                              }
                            }
                          });
                          break;
                        case 'batiments':
                          //console.log("Dépendance : bâtiment.");
                          //console.log("Check si le joueur à déjà construit ce bâtiment ...");
                          //On vérifie que le joueur à la bon bâtiment
                          Joueur_has_batiment.findOneByPlanetesId(idPlanetes).where({BatimentsId: batiment.Dependance_Id}).done(function (err, batimentRequis) {
                            if(err)
                            {
                              log.ErreurDb(err, "Erreur Db - Récupération d'un bâtiment par idBatiments et idPlanetes", "policies/checkBatimentOwner::function() {};");
                              return res.redirect('/micro/'+planete.idPlanetes);
                            }
                            else
                            {
                              if(batimentRequis)
                              {
                                //console.log("Bâtiment trouvé.");
                                //console.log("Check Niveau requis ...");
                                //Si la science est au bon niveau
                                if(batiment.Dependance_Niveau == "n" || batiment.Dependance_Niveau == "unique")
                                {
                                  niveauRequis = 1;
                                }
                                else
                                {
                                  niveauRequis = 2;
                                }

                                if(batimentRequis.Niveau >= niveauRequis)
                                {
                                  //console.log("Niveau suffisant. Accès autorisé.");
                                  ok();
                                }
                                else
                                {
                                  //console.log("Niveau Insuffisant. Redirection.")
                                  return res.redirect('/micro/'+planete.idPlanetes);
                                }
                              }
                              else
                              {
                                //console.log("Bâtiment introuvable. Redirection.");
                                return res.redirect('/micro/'+planete.idPlanetes);
                              }
                            }
                          });
                          break;
                      }
                    }
                    else
                    {
                      //console.log("Le bâtiment n'existe pas ou il n'est pas constructible sur ce type deplanète. Redirection.");
                      //Le batiment n'est pas constructible sur ce type de planète ou le bâtiment n'existe pas
                      return res.redirect('/micro/'+planete.idPlanetes);
                    }
                  }
                });
              }
            }
          });
	  		}
	  		else
	  		{
          console.log("La planète est introuvable. Redirection.");
	  			return res.redirect('/macro');	
	  		}
	  	}
  	});
  }
  else {
    return res.redirect('/');
  }
};