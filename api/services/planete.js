var getBatimentDispo = function (joueur, batimentsJoueur, next) 
{
	var BatimentNew = {};
	BatimentNew.Sciences = new Array();
	BatimentNew.Orphelins = {};

	var BatimentOwn = {};

	var async = require("async");

	//Si la planète n'a pas de bâtiment
	if(batimentsJoueur.length == 0)
	{
		//On check si il y a des bâtiments qui ne nécessite pas d'autre bâtiment
		Batiments.findByDependance_Table('-').where({Type_Planete: joueur.Planete.Type}).done(function (err, batimentsOrphelins) {
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
	//Sinon
	else
	{
		async.series([
			function (next)
			{
				//On récupère tous les bâtiments
				Batiments.find().done(function (err, BatimentsAll) {
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
			function (next)
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
		],
		function (err, results)
		{
			console.log(results);
		});
		//On récupère tous les bâtiments
		/*Batiments.find().done(function (err, BatimentsAll) {
			if(err)
				log.ErreurDb(err, "Récupération de tous les bâtiments", "services/planete::getBatimentDispo");
			else
			{
				var i = 0;
				async.whilst(
					function () { return i < BatimentsAll.length; },
				    function (next) {
				    	//Si l'évolution d'un bâtiment dépends d'une science
						if(batimentsAll[batimentsJoueur[i].idBatiments-1].Dependance_Table == "science")
						{
							Joueur_has_science.findOneByIdSciences(BatimentsAll[i].DependanceId)
											  .where({Etat: 1})
											  .done(function (err, science) {
								if(err)
									log.ErreurDb(err, "Récupération de tous les bâtiments", "services/planete::getBatimentDispo");
								else
								{
									//Si le joueur possède la science
									if(science.length != 0)
									{
										//Si la dépendance est de type n (Niveau Batiment = Niveau science)
										if(batimentsJoueur[i].Dependance_Niveau == "n")
										{
											//Si le niveau de la science est supérieur ou égal au niveau du bâtiment supérieur, 
											//on autorise la construction
											if(science.Niveau >= (batimentsJoueur[i].Niveau + 1))
												batimentsJoueur[i].Up = 1;
											else
												batimentsJoueur[i].Up = 0;
										}
									}
								}
							});
						}
						//Sinon, c'est qu'elle dépends d'un bâtiment
						else
						{
							
						}
						i++;
						next();	
				    },
				    function (err) {
				        //Une fois la boucle finit en synchrone, on appelle la callback
				        JSON.stringify(BatimentNew.Sciences);
						next(BatimentNew, BatimentOwn);
				    }
				);
				
				//Puis on test si de nouveaux bâtiments sont constructible

				//On appelle la callback
				next(BatimentNew, BatimentOwn);
			}
		});*/
	}
}

exports.getBatimentDispo = getBatimentDispo;