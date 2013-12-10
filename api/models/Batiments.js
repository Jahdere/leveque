/**
 * Batiments
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
    idBatiments: {
      type: 'INTEGER',
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    Type_Planete: 'INTEGER', //Sur quel type de planète c'est constructible
    Planete_Mere: 'INTEGER', // 1 -> Constructible qu'une fois, sur la planète mère, 0 -> constructible sur toutes.
    Nom: 'STRING',
    Description: 'TEXT',
    Prix: 'INTEGER',
    Aluminium: 'INTEGER',
    Titane: 'INTEGER',
    Carbone: 'INTEGER',
    Matiere_Premiere: 'INTEGER',
    Temps: 'INTEGER',
    Type_Bonus: 'STRING',
    Bonus: 'FLOAT',
    Type_Production: 'STRING',
    Production: 'INTEGER',
    Acces: 'STRING',
    Dependance_Table: 'STRING',
    Dependance_Id: 'INTEGER',
    Dependance_Niveau: 'STRING',
    Image: 'TEXT'
  }

};
