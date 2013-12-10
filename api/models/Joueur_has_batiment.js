/**
 * Joueur_has_batiment
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
    BatimentsId: {
      required: true,
      type: 'INTEGER'
    },
    PlanetesId: {
      required: true,
      type: 'INTEGER'
    },
    Niveau: 'INTEGER',
    Etat: 'INTEGER' //0 -> en cours de construction / 1 -> Construit / 2 -> Détruit ?
  }

};
