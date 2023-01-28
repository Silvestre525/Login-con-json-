const bcryptjs = require('bcryptjs'); //requerimos esta libreria para poder encriptar nustra contrasena
const {
	validationResult
} = require('express-validator');

//Aca estamos requiriendo nuestra base de datos con todos sus metodos.
const User = require('../models/User');

const controller = {
	register: (req, res) => {
		return res.render('userRegisterForm');
	},

	//Este es el proceso del Registro, Por Post
	processRegister: (req, res) => {

		//Aca estamos realizando la validacion del backend en nuestro registro
		const resultValidation = validationResult(req);

		
		if (resultValidation.errors.length > 0) {
			return res.render('userRegisterForm', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}
		//Para que no se puedan registrar usuarios repitiendo el email
		//Buscamos un usuario a traves del mail
		let userInDB = User.findByField('email', req.body.email);
		//Si el usuario esta en la 	DB yo quiero retornar un error, despues voy a la vista y con ejs arreglamos para que se vea el error en la vista
		if (userInDB) {
			return res.render('userRegisterForm', {
				errors: {
					email: {
						msg: 'Este email ya está registrado'
					}
				},
				oldData: req.body //Esto es para que carge todo los que habiamos puesto en el body y no se borre
			});
		}

		//Aca traemos todos los datos del body e encriptamos la contrasena 
		let userToCreate = {
			...req.body, //aca viene todo lo que tenemos en nuestro formulario incluyendo el password

			//Pero aca estamo sobrescribiendo el passwor dque vino en el body ais que quedara encriptado 
			password: bcryptjs.hashSync(req.body.password, 10), //Asi encriptamos nuestra contraseba
			avatar: req.file.filename //Traemos en file name de nuestra imagen 
		}

		let userCreated = User.create(userToCreate); //User.create(req.body) si lo hicieramos asi, no tendriamos encriptada la contrasena
		

		//Una vez que termina el proceso de registro seremos redirigidos al login
		return res.redirect('/user/login');
	},
	login: (req, res) => {
		return res.render('userLoginForm');
	},
	//Proceso de Login por POST
	loginProcess: (req, res) => {
		//Busco al usuario con el metodo findBYfield para ver si tengo al usuario en mi DB
		let userToLogin = User.findByField('email', req.body.email);
		

		//Si mi Usuario existe en la DB entonces
		if(userToLogin) {

			//Comparamos nustro password que tenemos hasheado con el metodo compareSync y guardamos en una variable
			//EL METODO COMPARESYNC nos devolvera un booleano true o false. 
			let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password);

			//Si ese booleano nos devuelve true
			if (isOkThePassword) {
				delete userToLogin.password;
				req.session.userLogged = userToLogin;

				if(req.body.remember_user) {
					res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 })
				}
				//Si la contrasena y el email es correcto nos redigira a la vista perfil de usuario
				return res.redirect('/user/profile');
			} 
			//Me tirara este error si las  credenciales son invalidas
			return res.render('userLoginForm', {
				errors: {
					password: {
						msg: 'Las credenciales son inválidas'
					}
				}
			});
		}

		//SI no se encuentra al usuario en la DB que me renderize la misma vista pero con un mensaje de error.
		//De aca paso a mi vista de login y con ejs le agrego cosas
		return res.render('userLoginForm', {
			errors: {
				email: {
					msg: 'No se encuentra este email en nuestra base de datos'
				}
			}
		});
	},
	profile: (req, res) => {
		return res.render('userProfile', {
			user: req.session.userLogged
		});
	},

	logout: (req, res) => {
		res.clearCookie('userEmail');
		req.session.destroy();
		return res.redirect('/');
	}
}

module.exports = controller;