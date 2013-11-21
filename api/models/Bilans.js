/**
 * Bilans
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
    Message: 'TEXT',
    Titre: 'STRING',
    Date: 'TEXT',
    Lu: 'BOOLEAN'
  }

};
