/**
 * Planetes
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
    idPlanetes: {
      type: 'INTEGER',
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    JoueursId: {
      required: true,
      type: 'INTEGER'
    },
    Nom: 'STRING',
    Coordonnees: 'STRING',
    Type: 'INTEGER',
    Population: 'TEXT',
    Bonheur: 'FLOAT',
    Insecurite: 'INTEGER',
    Import_Matiere: 'INTEGER',
    Indice_Demographique: 'FLOAT',
    Planete_Mere: 'BOOLEAN',
    Extraction: 'STRING', //Alu#Titane#Carbone#Uranium
    Niveau_Extraction: 'INT',
    Matiere_Premiere: 'INTEGER',
    Taux_Imposition: 'INTEGER',
    Defense: 'INTEGER',
    Marines: 'INTEGER',
    Commandos: 'INTEGER',
    Tank: 'INTEGER',
    Artillerie: 'INTEGER'
  }

};
