/**
 * Allow any unauthenticated user.
 	Si l'utilisateur est connecté, il ne peut accéder au controller welcome
 	Redirection vers le welcome main
 */

module.exports = function (req, res, ok)
{
	if(!req.session.joueur)
	{
		return ok();
	}
	else
	{
		return res.redirect('/play');
	}
}