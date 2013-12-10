/**
 * Joueur_has_science
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
    JoueursId: {
      required: true,
      type: 'INTEGER'
    },
    SciencesId: {
      required: true,
      type: 'INTEGER'
    },
    Niveau: 'INTEGER',
    Etat: 'INTEGER', //0 -> en cours de recherche / 1 -> recherché
    Batiment: 'BOOLEAN' //0 -> n'est pas une dépendance d'un bâtiment / 1 -> est une dépendance d'un bâtiment
  }

};
