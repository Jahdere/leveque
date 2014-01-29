var getBatimentDispo = function (joueur, batimentsJoueur, next) 
{
	var BatimentNew = {};
	BatimentNew.Batiments = new Array();
	BatimentNew.Sciences = new Array();
	BatimentNew.Orphelins = new Array();

	var BatimentOwn = {};

	var async = require("async");

	//Si la planète n'a pas de bâtiment
	if(batimentsJoueur.length == 0)
	{
		//On check si il y a des bâtiments qui ne nécessite pas d'autre bâtiment
		Batiments.findByDependance_Table('-').where({Type_Planete: joueur.Planete.Type, Planete_Mere: joueur.Planete.Planete_Mere}).done(function (err, batimentsOrphelins) {
			if(err)
				log.ErreurDb(err, "Récupération des premiers bâtiments constructibles", "services/planete::getBatimentDispo");
			else
			{
				BatimentNew.Orphelins = batimentsOrphelins;

				//Puis on check si il y a des bâtiments qui nécessite juste une science	
				Joueur_has_science.findByJoueursId(joueur.idJoueurs).where({Batiment: 1}).done(function (err, sciencesOwn) {
					if(err)
						log.ErreurDb(err, "Récupération des sciences du joueur", "services/planete::getBatimentDispo");
					else
					{
						if(sciencesOwn.length == 0)
						{
							//Pas de science donc pas de bâtiments dispo via les sciences

							//On appelle la callback
							next(BatimentNew, BatimentOwn);
						}
						else
						{
							//On boucle sur les sciences
							var i = 0;
							console.log(sciencesOwn.length);
							async.whilst(
								function () { return i < sciencesOwn.length; },
							    function (next) {
							    	//On récupère le(s) bâtiment(s)
									Batiments.findOneByDependance_Table('sciences')
											 .where({Type_Planete: joueur.Planete.Type, Dependance_Id: sciencesOwn[i].SciencesId})
											 .done(function (err, BatimentScience) {
										if(err)
											log.ErreurDb(err, "Récupération d'un bâtiment par dépendance science", "services/planete::getBatimentDispo");
										else
										{
											//On les ajoutes	
											if(BatimentScience)
											{
												BatimentNew.Sciences.push(BatimentScience);
											}
												
											//On passe à l'élément suivant
							        		i++;
							        		next();
										}
									});
							    },
							    function (err) {
							        //Une fois la boucle finit en synchrone, on appelle la callback
							        JSON.stringify(BatimentNew.Sciences);
									next(BatimentNew, BatimentOwn);
							    }
							);
						}
					}
				});
			}
		});	
	}
	//Sinon (on a déjà un bâtiment de construit)
	else
	{
		async.parallel({
			AllBatiments: function (next)
			{
				//On récupère tous les bâtiments
				Batiments.find().where({Type_Planete: joueur.Planete.Type, Planete_Mere: joueur.Planete.Planete_Mere}).done(function (err, BatimentsAll) {
					if(err)
					{
						log.ErreurDb(err, "Récupération de tous les bâtiments", "services/planete::getBatimentDispo");
						next(err, null);
					}
					else
					{
						next(null, BatimentsAll);
					}
				});
			},
			SciencesJoueur: function (next)
			{
				//On récupère les sciences du joueur qui ont un rapport avec les bâtiments
				Joueur_has_science.findByJoueursId(joueur.idJoueurs).where({Batiment: 1}).done(function (err, SciencesJoueur) {
					if(err)
					{
						log.ErreurDb(err, "Récupération des sciences d'un joueur", "services/planete::getBatimentDispo");
						next(err, null);
					}
					else
					{
						next(null, SciencesJoueur);
					}
				});
			}
		},
		function (err, results)
		{
			//On boucle sur tous les bâtiments
			var i = 0;
			async.whilst(
				function () { return i < results.AllBatiments.length; },
			    function (next) {
			    	//On check l'état du bâtiment pour cette planète
			    	checkEtatBatiment(results.AllBatiments[i], joueur, function (etat) {
			    		var etatSplit = etat.split('#');
			    		console.log(etatSplit);
			    		if(etatSplit[0] == "1")
			    		{
			    			//Constructible donc on le rajoute au tableau batimentNew 
			    			if(etatSplit[1] == "0")
			    			{
			    				BatimentNew.Orphelins.push(results.AllBatiments[i])
			    			}
			    			else if(etatSplit[1] == "1")
			    			{
			    				BatimentNew.Sciences.push(results.AllBatiments[i]);
			    			}
			    			else
			    			{
			    				BatimentNew.Batiments.push(results.AllBatiments[i]);
			    			}
			    		}
			    		//On passe à l'élément suivant
		        		i++;
		        		next();
			    	});
					
			    },
			    function (err) {
			        //Une fois la boucle finit en synchrone, on appelle la callback
			        JSON.stringify(BatimentNew.Orphelins);
			        JSON.stringify(BatimentNew.Batiments);
			        JSON.stringify(BatimentNew.Sciences);
			        console.log(BatimentOwn);
					next(BatimentNew, BatimentOwn);
			    }
			);
		});
	}
}
var checkEtatBatiment = function (batiment, joueur, cb)
{
	var etat = "";
	//On check quel est le type de dépendance
	console.log(batiment.Dependance_Table);
	switch(batiment.Dependance_Table)
	{
		case '-':
		  etat = "1#0";
		  break;
		case 'sciences':
		  	//On vérifie que le joueur à la bonne science
	  		Joueur_has_science.findOneBySciencesId(batiment.Dependance_Id).where({JoueursId: joueur.idJoueurs}).done(function (err, scienceRequise) {
			    if(err)
			    {
			      log.ErreurDb(err, "Erreur Db - Récupération d'une science par idSciences et idJoueurs", "services/planete::checkEtatBatiment");
			      return res.redirect('/micro/'+planete.idPlanetes);
			    }
			    else
			    {
			      if(scienceRequise)
			      {
			      	console.log(scienceRequise);
			      	//Si il a la science il faut vérifier qu'elle soit au bon niveau
			      	//Si la science est au bon niveau
			        if(batiment.Dependance_Niveau == "n" || batiment.Dependance_Niveau == "unique")
			        {
			          niveauRequis = 1;
			        }

			        if(scienceRequise.Niveau >= niveauRequis)
			        {
			          console.log("Niveau suffisant. Accès autorisé.");
			          etat = "1#1";
			        }
			        else
			        {
			          etat = "2#1";
			        }
			      }
			      else
			      {
			      	//Sinon le bâtiment n'est pas constructible
			      	etat = "2#1";
			      }
			      cb(etat);
			    }
			});
		  break;
		case 'batiments':
		  //On vérifie que le joueur à la bon bâtiment
		  Joueur_has_batiment.findOneByPlanetesId(joueur.Planete.idPlanetes).where({BatimentsId: batiment.Dependance_Id}).done(function (err, batimentRequis) {
		    if(err)
		    {
		      log.ErreurDb(err, "Erreur Db - Récupération d'un bâtiment par idBatiments et idPlanetes", "policies/checkBatimentOwner::function() {};");
		      return res.redirect('/micro/'+planete.idPlanetes);
		    }
		    else
		    {
		      if(batimentRequis)
		      {
		        //Si le batiment est au bon niveau
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
		          //Le niveau est bon
		          etat = "1#2";
		        }
		        else
		        {
		          //Le niveau n'est pas bon
		          etat = "2#2";
		        }
		      }
		      else
		      {
		        //Le joueur ne possède pas le bâtiment requis
		        etat = "2#2";
		      }
		      cb(etat);
		    }
		  });
		  break;
	}
}

exports.getBatimentDispo = getBatimentDispo;