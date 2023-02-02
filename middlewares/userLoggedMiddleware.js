//Middleware de aplicacion
//Traemos el modelo para realizar operaciones con la BD
const User = require('../models/User');
//Este nos permitira dependiendo si tengo a alguien o no en session mostrar una parte de la barra en la vista navbar
function userLoggedMiddleware(req, res, next) {
	//res.locals es una forma de crear variables que yo puedo compartir a traves de todas las vistas.indistinamente del controladro.
	//Si lo hago en un middleware toda mi aplicacion va a conocer esta variable.
	res.locals.isLogged = false;

	//creamos una variable y le pasamos el valor que tiene nuestra cookie creada, especificamente el email
	let emailInCookie = req.cookies.userEmail;
	//Busco el usuario con findbyfield, busacmos el usuario que tenemos en la cookie y lo guadamos en una variable
	let userFromCookie = User.findByField('email', emailInCookie);

	//si tengo el usuario de la cookie
	if (userFromCookie) {
		//Que le pase todo ese usuario a session
		req.session.userLogged = userFromCookie;
	}
	//Si tengo a alguien en session cambio el valor de la variable is logged a verdadera
	//Asi solamente veo el perfil de usuario y la parte de login y registro desaparece de la vista
	if (req.session.userLogged) {
		res.locals.isLogged = true;

		//PAso lo que tengo en session a una variable  local para que pueda ser compartida entre vistas
		//Esto lo hacemos para que en la vista de la navbar con ejs podamos pedirle wl fullname del usuario registado. 
		res.locals.userLogged = req.session.userLogged;
	}

	next();
}

module.exports = userLoggedMiddleware;