//Middleware de ruta
//Con este middleware no podremos acceder a las vistas de login y registro una vez que estemo logeados
function guestMiddleware(req, res, next) {
	//Preguntamos, si tengo a alguien en session, es decir a un usuario.
	if (req.session.userLogged) {
		//Que nos diriga al user profile
		return res.redirect('/user/profile');
	}
	next();
}

module.exports = guestMiddleware;