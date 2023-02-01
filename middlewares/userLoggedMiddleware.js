//Middleware de aplicacion

const User = require('../models/User');
//Este nos permitira dependiendo si tengo a alguien o no en session mostrar una parte de la barra en la vista navbar
function userLoggedMiddleware(req, res, next) {
	//res.locals es una forma de crear variables que yo puedo compartir a traves de todas las vistas.indistinamente del controladro.
	//Si lo hago en un middleware toda mi aplicacion va a conocer esta variable.
	res.locals.isLogged = false;

	let emailInCookie = req.cookies.userEmail;
	let userFromCookie = User.findByField('email', emailInCookie);

	if (userFromCookie) {
		req.session.userLogged = userFromCookie;
	}
	//Si tengo a alguien en session cambio el valor de lavariable is logged a verdadera
	//Asi solamente veo el perfil de usuario y laparte de loggin y registro desaparece de la vista
	if (req.session.userLogged) {
		res.locals.isLogged = true;

		//PAso lo que tengo en session a una variable  local para que pueda ser compartida entre vistas
		//Esto lo hacemos para que en la vista de la navbar con ejs podamos pedirle wl fullname del usuario registado. 
		res.locals.userLogged = req.session.userLogged;
	}

	next();
}

module.exports = userLoggedMiddleware;