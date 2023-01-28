const fs = require('fs');

//a mi objeto le estoy anadiendo metodos y cada metodo realiza algo, entonces para depurar
//console.log(User.nombre del metodo())
const User = {
	fileName: './database/users.json', //En este netodo estamos conectando con mi base de datos json
	//Trae todos mi base de dato convertidos en un array con el metodo jsonparse
	getData: function () {
		return JSON.parse(fs.readFileSync(this.fileName, 'utf-8'));
	},
	//Metodo que genera un id
	generateId: function () {
		let allUsers = this.findAll(); //Traigo todos los usuarios
		let lastUser = allUsers.pop(); //Obtengo el utimo usuario
		if (lastUser) {
			return lastUser.id + 1; //Si el ultimo usuario existe le sumo al id existente 1 
		}
		return 1;  //si no devuelvo 1	
	},

	//Obtiene todos los usuarios
	findAll: function () {
		return this.getData();
	},
	//Busca a usuarios po ID
	findByPk: function (id) {
		let allUsers = this.findAll();
		let userFound = allUsers.find(oneUser => oneUser.id === id);
		return userFound;
	},
	//Que se busque por cualquier campo
	findByField: function (field, text) {
		let allUsers = this.findAll();
		let userFound = allUsers.find(oneUser => oneUser[field] === text);
		return userFound;
	},
	//Crea un nuevo usuario
	create: function (userData) {
		let allUsers = this.findAll(); //Traigo todos los usuarios
		let newUser = {
			id: this.generateId(),
			...userData
		}
		allUsers.push(newUser); //Insetoa all user con push los newUser
		fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null,  ' '));
		return newUser;
	},
	//Elimina un usuario
	delete: function (id) {
		let allUsers = this.findAll();
		let finalUsers = allUsers.filter(oneUser => oneUser.id !== id);
		fs.writeFileSync(this.fileName, JSON.stringify(finalUsers, null, ' '));
		return true;
	}
}


module.exports = User;