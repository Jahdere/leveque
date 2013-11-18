/**
 * GalaxieController
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
    
  create: function (req, res)
  {
  	for(var secteur = 8; secteur <= 12; secteur++)
  	{
  		for(var systeme = 1; systeme <= 85; systeme++)
  		{
  			for(var planete = 1; planete <= 20; planete++)
  			{
  				var Planete = {};

				Planete.JoueursId = 0;
				Planete.Nom = general.rand_name();
				Planete.Coordonnees = "0_"+secteur+"_"+systeme+"_"+planete;
				Planete.Type = 0;
				Planete.Population = 0;
				Planete.Bonheur = 0;
				Planete.Insecurite = 0;
				Planete.Import_Matiere = 0;
				Planete.Indice_Demographique = 0;
				Planete.Planete_Mere = 0;
				Planete.Extraction = "";
				Planete.Niveau_Extraction
				Planete.Matiere_Premiere = 0;
				Planete.Taux_Imposition = 0;
				Planete.Defense = 120;

  				if(systeme % 2 == 0)
  				{
  					//Si on est dans un système pair -> Pop des joueurs
  					//PlanetePaire : Minières
  					//PlaneteImpaire : Urbanisées
  					//PlaneteMere : n = n+6 (n=1 à la base) -> 7, 13, 19
  					//PlaneteAgri : n = n+5 (n=1 à la base) -> 6, 11, 16
					switch(planete)
  					{
  						case 7:
  						case 13:
  						case 19:
  							Planete.Type = 1;
		  					Planete.Population = Math.floor((Math.random()*(4500000000-3000000000+1))+3000000000).toString();
							Planete.Bonheur = 40;
							Planete.Insecurite = 20;
							Planete.Import_Matiere = Math.floor(((10/365.25)*Planete.Population)/1000000);
							Planete.Indice_Demographique = 3;
							Planete.Planete_Mere = 1;
							Planete.Matiere_Premiere = Math.floor((Math.random()*(340-280+1))+280).toString();
							Planete.Taux_Imposition = 50;
							Planete.Defense = 200;
  						break;
  						case 6:
  						case 11:
  						case 16:
  							Planete.Type = 3;
  							Planete.Population = Math.floor((Math.random()*(1000000-450000+1))+450000).toString();
  							Planete.Matiere_Premiere = Math.floor((Math.random()*1540)+1230).toString();
  						break
  						default: 
  							if(planete % 2 == 0)
  							{
								Planete.Type = 2;
  								Planete.Population = Math.floor((Math.random()*(2000000-1000000+1))+1000000).toString();
  								Planete.Extraction = Math.floor((Math.random()*(12-7+1))+7).toString()+"#"+Math.floor((Math.random()*(12-7+1))+7).toString()+"#"+Math.floor((Math.random()*(7-4+1))+4).toString()+"#"+Math.floor((Math.random()*(9-5+1))+5).toString();
  								Planete.Niveau_Extraction = Math.floor((Math.random()*(9-6+1))+6).toString();
  							}
  							else
  							{
								Planete.Type = 1;
			  					Planete.Population = Math.floor((Math.random()*(4500000000-3000000000+1))+3000000000).toString();
								Planete.Bonheur = 40;
								Planete.Insecurite = 20;
								Planete.Import_Matiere = Math.floor(((10/365.25)*Planete.Population)/1000000);
								Planete.Indice_Demographique = 3;
								Planete.Matiere_Premiere = Math.floor((Math.random()*(340-280+1))+280).toString();
								Planete.Taux_Imposition = 50;
  							}
  						break;
  					}
  				}
  				else
  				{
  					if(systeme == 1)
  					{
  						//Si premier système
  						//Planete1 : Urbanisée / Gère le secteur
  						//Planete2 : Urabisée / Gère la contrebande
  						//PlaneteImpaire : Urbanisées
  						//PlanetePaire : Agricoles
  						if(planete == 2)
  						{
  							Planete.Type = 1;
		  					Planete.Population = Math.floor((Math.random()*(4500000000-3000000000+1))+3000000000).toString();
							Planete.Bonheur = 40;
							Planete.Insecurite = 20;
							Planete.Import_Matiere = Math.floor(((10/365.25)*Planete.Population)/1000000);
							Planete.Indice_Demographique = 3;
							Planete.Matiere_Premiere = Math.floor((Math.random()*(340-280+1))+280).toString();
							Planete.Taux_Imposition = 50;
  						}
  						else
  						{
  							if(planete % 2 == 0)
  							{
								Planete.Type = 3;
  								Planete.Population = Math.floor((Math.random()*(1000000-450000+1))+450000).toString();
  								Planete.Matiere_Premiere = Math.floor((Math.random()*(1540-1230+1))+1230).toString();
  							}
  							else
							{
								Planete.Type = 1;
			  					Planete.Population = Math.floor((Math.random()*(4500000000-3000000000+1))+3000000000).toString();
								Planete.Bonheur = 40;
								Planete.Insecurite = 20;
								Planete.Import_Matiere = Math.floor(((10/365.25)*Planete.Population)/1000000);
								Planete.Indice_Demographique = 3;
								Planete.Matiere_Premiere = Math.floor((Math.random()*(340-280+1))+280).toString();
								Planete.Taux_Imposition = 50;
							}
  						}
  					}
  					else
  					{
  						//Si on est dans un système impair -> vide
  						//PlanetePaire : Urbanisées
	  					//PlaneteImpaire : Minières
  						//PlaneteAgri : n = n+4 (n=1 à la base) -> 5, 9, 13, 17
  						switch(planete)
  						{
  							case 5:
  							case 9:
  							case 13:
  							case 17:
  								Planete.Type = 3;
  								Planete.Population = Math.floor((Math.random()*(1000000-450000+1))+450000).toString();
  								Planete.Matiere_Premiere = Math.floor((Math.random()*(1540-1230+1))+1230).toString();
  							break;
  							default:
  								if(planete % 2 == 0)
  								{
  									Planete.Type = 1;
				  					Planete.Population = Math.floor((Math.random()*(4500000000-3000000000+1))+3000000000).toString();
									Planete.Bonheur = 40;
									Planete.Insecurite = 20;
									Planete.Import_Matiere = Math.floor(((10/365.25)*Planete.Population)/1000000);
									Planete.Indice_Demographique = 3;
									Planete.Matiere_Premiere = Math.floor((Math.random()*(340-280+1))+280).toString();
									Planete.Taux_Imposition = 50;
  								}
  								else
  								{
  									Planete.Type = 2;
  									Planete.Population = Math.floor((Math.random()*(2000000-1000000+1))+1000000).toString();
  									Planete.Extraction = Math.floor((Math.random()*(12-7+1))+7).toString()+"#"+Math.floor((Math.random()*(12-7+1))+7).toString()+"#"+Math.floor((Math.random()*(7-4+1))+4).toString()+"#"+Math.floor((Math.random()*(9-5+1))+5).toString();
  									Planete.Niveau_Extraction = Math.floor((Math.random()*(9-6+1))+6).toString();
  								}
  							break;
  						}
  					}
  				}
  				JSON.stringify(Planete);
  				Planetes.create(Planete).done(function (err, SavePlanete) {
  					if(err)
  					{
  						console.log(err);
  					}
  					else
  					{
  						console.log("Planete : "+SavePlanete.Coordonnees);
  					}
  				});
  			}
  		}
  	}
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to GalaxieController)
   */
  _config: {}

  
};
