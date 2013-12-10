/**
 * Ordres
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
    idJoueurs: {
      type: 'INTEGER',
      notEmpty: true,
      required: true
    },
    Type: 'INTEGER', //1 -> Construction de batiment
    //Celui qui est impacté par l'ordre
    idJoueurs2: 'INTEGER',
    PlanetesId: 'INTEGER',
    BatimentsId: 'INTEGER',
    Titre: 'STRING',
    Message: 'TEXT',
    Date_Debut: 'INTEGER',
    Temps: 'INTEGER',
    Etat: 'BOOLEAN' //0 -> en cours, 1 -> finit
  }

};
