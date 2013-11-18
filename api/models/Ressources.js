/**
 * Joueurs
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
    idRessources: {
   		type: 'INTEGER',
        autoIncrement: true,
        primaryKey: true,
        unique: true
   	},
   	Argent: 'TEXT',
   	Aluminium: 'TEXT',
   	Titane: 'TEXT',
   	Carbone: 'TEXT',
   	Uranium: 'TEXT',
   	Energie: 'TEXT',
   	Matiere_Premiere: 'TEXT'
  }

};
