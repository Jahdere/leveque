/**
 * Connexions
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
	idConnexion: {
   		type: 'INTEGER',
        autoIncrement: true,
        primaryKey: true,
        unique: true
   	},
   	Joueurs_idJoueurs: {
   		type: 'INTEGER',
   		required: true
   	},
   	IP: 'STRING',
   	DateC: 'DATETIME'
  }

};
