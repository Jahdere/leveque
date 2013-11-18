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
    idJoueurs: {
      type: 'INTEGER',
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    RessourcesId: {
      required: true,
      type: 'INTEGER'
    },
    getRessources: function (next) {
      Ressources.findOneByIdRessources(this.RessourcesId).done(function (err, ressources) {
        if(err)
          log.ErreurDb(err, "Erreur récupération planète mère", "models/Joueurs::getRessources");
        else
          next(ressources);
      });
    },
    getPlaneteMere: function(next) {
      Planetes.findOneByJoueursId(this.idJoueurs).where({Planete_Mere: 1}).done(function (err, planete) {
        if(err)
          log.ErreurDb(err, "Erreur récupération planète mère", "models/Joueurs::getPlaneteMere");
        else
          next(planete);
      });
    },
    getAllPlanetes: function(next) {
      Planetes.findByJoueursId(this.idJoueurs).done(function (err, planetes) {
        if(err)
          log.ErreurDb(err, "Erreur récupération toutes planètes", "models/Joueurs::getAllPlanetes");
        else
          next(planetes);
      });
    },
    Nom: 'STRING',
    Prenom: 'STRING',
    Mail: {
      type: 'STRING',
      notEmpty: true,
      required: true,
      unique: true
    },
    Pseudo: {
      type: 'STRING',
      notEmpty: true,
      required: true,
      unique: true
    },
    Pass: 'STRING',
    DateI: 'DATETIME',
    Active: 'BOOLEAN',
    IP: 'STRING',
    Session: 'STRING'
  }

};
