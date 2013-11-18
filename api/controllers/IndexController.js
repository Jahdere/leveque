/**
 * IndexController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  
  index: function (req, res)
  {
  	sails.config.appName = 'WarEmpire - Accueil';

  	res.view({ joueur: null});
  },
  logout: function (req, res)
  {
  	req.session.joueur = null;

  	res.redirect("/");
  }

};
