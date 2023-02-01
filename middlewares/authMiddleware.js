//Middleware de ruta
//Este middleware hara lo contrario al guestMiddleware
function authMiddleware(req, res, next) {
	//si no tengo a nadie en session que me rediriga al login
	if (!req.session.userLogged) {
		return res.redirect('/user/login');
	}
	next();
}

module.exports = authMiddleware;