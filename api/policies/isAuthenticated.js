/**
 * Allow any authenticated user.
 	Si l'utilisateur n'est pas connecté, il ne peut accéder au controller main
 	Redirection vers le welcome controller
 */
module.exports = function (req, res, ok) {

  // User is allowed, proceed to controller
  if (req.session.joueur) {

    return ok();
  }
  // User is not allowed
  else {
    return res.redirect('/');
  }
};