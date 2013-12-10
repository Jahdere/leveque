/**
 * Sciences
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
    idSciences: {
      type: 'INTEGER',
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    Nom: 'STRING',
    Description: 'TEXT',
    Categorie: 'INTEGER',
    Sous_Cat: 'INTEGER',
    Temps: 'INTEGER'
  }

};
