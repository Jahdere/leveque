//Function qui attribu une planète mère à un nouveau joueur
var setPlaneteMere = function (idJoueur)
{
	LastInscrit.findOneByIdLastInscrit(1).done(function (err, last) {
		if(err)
		{
			log.ErreurDb(err, "Erreur récupération last inscrit coordonnées", "policies/galaxie::setPlaneteMere");
		}
		else
		{
			if(typeof(last) != "undefined")
			{
				var nextCoord = "";

				explodeCoord = last.Coordonnees.split('_');

				switch(explodeCoord[3])
				{
					case "7":
						//Si on est en position 7, la prochaine sera 13 du même secteur
						nextCoord = explodeCoord[0]+"_"+explodeCoord[1]+"_"+explodeCoord[2]+"_13";
					break;
					case "13": 
						//Si on est en position 13, la prochaine sera 19 du même secteur
						nextCoord = explodeCoord[0]+"_"+explodeCoord[1]+"_"+explodeCoord[2]+"_19";
					break;
					case "19":
						//Si on est en position 19, On change de secteur
						if(explodeCoord[1] != "12")
						{
							//Si on est pas dans le dernier secteur, on augmente juste le secteur de 1
							var nextSecteur = parseInt(explodeCoord[1])+1;
							nextCoord = explodeCoord[0]+"_"+nextSecteur+"_"+explodeCoord[2]+"_7";
						}
						else
						{
							//Sinon on repars à 0 et on augmente le système de 2
							var nextSystem = parseInt(explodeCoord[2])+2;
							nextCoord = explodeCoord[0]+"_2_"+nextSystem+"_7";
						}
					break;
				}

				//On récupère la planète
				Planetes.findOneByCoordonnees(nextCoord).done(function (err, planete) {
					if(err)
					{
						log.ErreurDb(err, "Erreur récupération planète", "policies/galaxie::setPlaneteMere");
					}
					else
					{
						if(planete.JoueursId == 0)
						{
							console.log("Planète disponible");
							planete.JoueursId = idJoueur;
							console.log(planete);
							planete.save(function (err) {
								if(err)
								{
									log.ErreurDb(err, "Erreur sauvegarde planète mère", "policies/galaxie::setPlaneteMere");
								}
								else
								{
									console.log("Planète mère enregistré pour joueur id "+idJoueur);

									last.Coordonnees = nextCoord;

									last.save(function (err) {
										if(err)
										{
											log.ErreurDb(err, "Erreur mise à jour table LastInscrit", "policies/galaxie::setPlaneteMere");
										}
										else
										{
											console.log("LastInscrit mise à jour.");
										}
									});
								}
							});
						}
						else
						{
							console.log('Planète non disponible');
						}
					}
				});
			}
			else
			{
				console.log("Premier inscrit - attribution planète 0_2_4_7");

				Planetes.findOneByCoordonnees("0_2_4_7").done(function (err, planete) {
					if(err)
					{
						log.ErreurDb(err, "Erreur récupération planète", "policies/galaxie::setPlaneteMere");
					}
					else
					{
						if(planete.JoueursId == 0)
						{
							console.log("Planète disponible");
							planete.JoueursId = idJoueur;
							console.log(planete);
							planete.save(function (err) {
								if(err)
								{
									log.ErreurDb(err, "Erreur sauvegarde planète mère", "policies/galaxie::setPlaneteMere");
								}
								else
								{
									console.log("Planète mère enregistré pour joueur id "+idJoueur);

									lastInscrit = {};
									lastInscrit.Coordonnees = "0_2_4_7";

									JSON.stringify(lastInscrit);

									LastInscrit.create(lastInscrit).done(function (err, last) {
										if(err)
										{
											log.ErreurDb(err, "Erreur mise à jour table LastInscrit", "policies/galaxie::setPlaneteMere");
										}
										else
										{
											console.log("LastInscrit mise à jour.");
										}
									});
								}
							});
						}
						else
						{
							console.log('Planète non disponible');
						}
					}
				});
			}
		}
	});
}

var cycle = function() 
{
	console.log("Go!");
	Joueurs.find().done(function(err, joueurs) {
		if(err)
		{
			log.ErreurDb(err, "Erreur récupération de tous les joueurs", "policies/galaxie::cycle");
		}
		else
		{
			for (var i = 0; i < joueurs.length; i++) {
				var idJoueurs = joueurs[i].idJoueurs;
				var idRessources = joueurs[i].RessourcesId;
				var Pseudo = joueurs[i].Pseudo;
				getPlanetes(idJoueurs, Pseudo, idRessources, function(Pseudo, idRessources, planetes) {
					getRessources(Pseudo, idRessources, planetes, function(Pseudo, planetes, ressources) {
						cycleJoueur(Pseudo, planetes, ressources, function (Pseudo, ressources, planetesSave) {
							majPlanetes(Pseudo, ressources, planetesSave, function (Pseudo, ressources) {
								ressources.save(function (err) {
									if(err)
										console.log(err);
									console.log("Cycle effectué pour je joueur "+Pseudo);
								});
							});
						});
					});
				});
			}
		}
	});
}

var getPlanetes = function(idJoueurs, Pseudo, idRessources, next) {
	Planetes.findByJoueursId(idJoueurs).done(function(err, planetes) {
		if(err)
		{
			log.ErreurDb(err, "Erreur Db - Récupération Planètes pour cycle joueur", "services/galaxie::getPlanetes");
		}
		else
		{
			next(Pseudo, idRessources, planetes);
		}
	});
}

var getRessources = function(Pseudo, idRessources, planetes, next) {
	Ressources.findOneByIdRessources(idRessources).done(function(err, ressources) {
		if(err)
		{
			log.ErreurDb(err, "Erreur Db - Récupération Ressources pour cycle joueur", "services/galaxie::getRessources");
		}
		else
		{
			next(Pseudo, planetes, ressources);
		}
	});
}

var cycleJoueur = function(Pseudo, planetes, ressources, next) {
	var ecart = 0;
	var bonheur = 0;
	var argent = 0;
	var Matiere_Premiere = 0;
	var consommation = 0;
	var croissance = 0;
	var rupture = 0;
	var Depense_publique = 50;
	var newTotal = 0;
	var k = 0;
	var planetesSave = new Array();

	for (var j = planetes.length - 1; j >= 0; j--) 
	{
		switch(planetes[j].Type)
		{
			case 1:
				//Si type urbanisé

				//Imposition

				//Pop * 0.0009
				argent = parseInt(planetes[j].Population) * 0.009;
				argent = Math.floor((argent / 100) * planetes[j].Taux_Imposition);

				//Détournement (corruption)
				argent = Math.floor((argent / 100) * (100 - planetes[j].Insecurite));

				//Dépense publique
				argent = Math.floor((argent / 100) * (100 - Depense_publique));

				//On met à jour l'argent
				ressources.Argent = (parseInt(ressources.Argent) + argent).toString();

				//Production & consommation de Matière Première

				Prod_Matiere_Premiere = planetes[j].Matiere_Premiere;
				Cons_Matiere_Premiere = Math.floor((10/365.25*parseInt(planetes[j].Population))/1000000);

				//si la prod de la planète est inférieur à la consommation
				if(Prod_Matiere_Premiere - Cons_Matiere_Premiere < 0)
				{
					//Si le joueur n'a déjà plus de matière première (une planète a déjà eu un manque)
					if(rupture == 1)
					{
						//On enlève directement le bonheur
						bonheur -= Math.floor((Cons_Matiere_Premiere*0.007) * 100) / 100;
					}
					else
					{	
						//Sinon on vérifie qu'il en a assez
						newTotal = parseInt(ressources.Matiere_Premiere) - (Cons_Matiere_Premiere - Prod_Matiere_Premiere);
						if (newTotal > 0)
						{
							ressources.Matiere_Premiere = newTotal.toString();
							//Evolution du bonheur
							if(parseInt(planetes[j].Taux_Imposition) > 50)
							{
								ecart = parseInt(planetes[j].Taux_Imposition) - 50;
								bonheur += -(ecart * 0.04);
							}
							else if(parseInt(planetes[j].Taux_Imposition) < 50)
							{
								ecart = 50 - parseInt(planetes[j].Taux_Imposition);
								bonheur += ecart * 0.04;
							}
							else
							{
								bonheur += 0.4;
							}

							//Population

							//Croissance pop
							croissance = (100000000 / 1000) * planetes[j].Bonheur * planetes[j].Indice_Demographique*7;
						}
						else
						{
							//C'est la rupture de stock, on met la ressources à 0, on baisse le bonheur et on met rupture à true
							ressources.Matiere_Premiere = "0";
							
							rupture = 1;

							//Evolution du bonheur
							planetes[j].Bonheur -= Math.floor(((Cons_Matiere_Premiere - Prod_Matiere_Premiere)*0.007) * 100) / 100;

							//Population

							//Croissance pop
							croissance = -((100000000 / 1000) * (100 - planetes[j].Bonheur) * planetes[j].Indice_Demographique*12);
						}
					}
				}
				else
				{
					//Si la prod est supérieur à la consommation 
					ressources.Matiere_Premiere = (parseInt(ressources.Matiere_Premiere) + (Prod_Matiere_Premiere - Cons_Matiere_Premiere)).toString();
					//Evolution du bonheur
					if(parseInt(planetes[j].Taux_Imposition) > 50)
					{
						ecart = parseInt(planetes[j].Taux_Imposition) - 50;
						bonheur += -(ecart * 0.04);
					}
					else if(parseInt(planetes[j].Taux_Imposition) < 50)
					{
						ecart = 50 - parseInt(planetes[j].Taux_Imposition);
						bonheur += ecart * 0.04;
					}
					else
					{
						bonheur += 0.4;
					}

					//Population

					//Croissance pop
					croissance = (100000000 / 1000) * planetes[j].Bonheur * planetes[j].Indice_Demographique*7;
				}
				//Mise à jour planètes
				planetes[j].Population = (parseInt(planetes[j].Population) + croissance).toString();
				planetes[j].Import_Matiere = Math.floor((10/365.25*parseInt(planetes[j].Population))/1000000);

				if(parseFloat(planetes[j].Bonheur) + bonheur < 0)
				{
					if(planetes[j].Planete_Mere == 1)
						planetes[j].Bonheur = 10;
					else
						planetes[j].Bonheur = 0;
				}
				else
				{
					if(parseFloat(planetes[j].Bonheur + bonheur) >= 100)
						planetes[j].Bonheur = 99;
					else
						planetes[j].Bonheur = Math.floor(parseFloat(planetes[j].Bonheur + bonheur) * 100) / 100;
				}
				planetesSave[k] = planetes[j];
				k++;
			break;
			case 2:
				//On multiplie la valeur d'extraction de chaque ressources avec le niveau d'extraction de la planètes
				//On récupère les différentes vcaleures d'extraction
				explodeRess = planetes[j].Extraction.split("#");
				ressources.Aluminium = (parseInt(ressources.Aluminium) + (planetes[j].Niveau_Extraction * explodeRess[0])).toString();
				ressources.Titane = (parseInt(ressources.Titane) + (planetes[j].Niveau_Extraction * explodeRess[1])).toString();
				ressources.Carbone = (parseInt(ressources.Carbone) + (planetes[j].Niveau_Extraction * explodeRess[2])).toString();
				ressources.Uranium = (parseInt(ressources.Uranium) + (planetes[j].Niveau_Extraction * explodeRess[3])).toString();
			break;
			case 3:
				//On rajoute juste la production de matière première
				Matiere_Premiere = Math.floor(planetes[j].Matiere_Premiere * 0.7);
				ressources.Matiere_Premiere = (parseInt(ressources.Matiere_Premiere) + Matiere_Premiere).toString();
			break;
		}
	}
	next(Pseudo, ressources, planetesSave);
}

var majPlanetes = function(Pseudo, ressources, planetesSave, next) {
	for (var j = 0; j < planetesSave.length; j++) {
		planetesSave[j].save(function(err) {
			if(err)
				console.log(err)
			
			if(j == planetesSave.length)
				next(Pseudo, ressources);
		});		
	}
}

exports.setPlaneteMere = setPlaneteMere;
exports.cycle = cycle;