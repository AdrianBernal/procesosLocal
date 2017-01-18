
var fs=require("fs");
var exp=require("express");
var app=exp();
var bodyParser=require("body-parser");
var modelo=require("./servidor/modelo.js");
var cifrado=require("./servidor/cifrado.js");
var moduloEmail=require('./servidor/email.js');
var _ = require("underscore");
var server = require('http').createServer(app);
var io=require('socket.io')(server);



var fm=new modelo.JuegoFM("./servidor/tilemaps");
var juego=fm.makeJuego(fm.juego,fm.array);
var usuariosCol;
var resultadosCol;
var limboCol;
var sockets=[];

app.set('port', (process.env.PORT || 5000));

app.use(exp.static(__dirname +"/cliente"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/",function(request,response){
	var contenido=fs.readFileSync("./cliente/index.html");
	response.setHeader("Content-type","text/html");
	response.locals.name='Nombre de prueba';
	response.send(contenido);
});

app.post("/signup",function(request,response){
	var nombre = request.body.nombre;
	var email = request.body.email;
	var password = request.body.password;
	var passwordCifrada = cifrado.encrypt(password)
	juego.nuevoUsuario(new modelo.Usuario(nombre,email,passwordCifrada),function(usuario){
		if (usuario!=undefined){
			moduloEmail.enviarEmail(usuario);
			response.send(limpiarUsuario(usuario));
		} else {
			response.send({nombre:undefined});
		}
	});
});

app.post("/recordar",function(request,response){
	var nombre = request.body.nombre;
	var password = generar(8);
	var passwordCifrada = cifrado.encrypt(password);
	var usuario = juego.obtenerUsuarioPorNombre(nombre);
	if (usuario!=undefined) {
		usuario.actualizar(usuario.nombre,passwordCifrada,function(usuarioActualizado){
			if (usuario!=undefined){
				moduloEmail.enviarEmailRecordar(usuario, password);
				var usuarioAux=limpiarUsuario(usuario);
				//ToDo: Comentar la siguiente línea para poner en producción.
				/*Línea para que funcionen los test*/usuarioAux.password=password;/*Fín línea para test*/
				response.send(usuarioAux);
			} else {
				response.send({nombre:undefined});
			}
		});
	} else {
		response.send({nombre:undefined});
	}
});

app.get("/comprobarUsuario/:id",function(request,response){
	var id = request.params.id;
	var json={nivel:-1};
	var usuario = juego.obtenerUsuarioPorId(id);
	if (usuario!=undefined && usuario.activado) {
		juego.agregarUsuario(usuario);
		json=JSON.stringify(limpiarUsuario(usuario));
	}
	response.send(json);
})

app.get('/nivelCompletado/:id/:tiempo/:vidas/:score',function(request,response){
	var id=request.params.id;
	var tiempo=parseInt(request.params.tiempo);
	var vidas=parseInt(request.params.vidas);
	var score=parseInt(request.params.score);
	var usuario=juego.obtenerUsuarioPorId(id);
	var json={'nivel':-1}
	if (usuario!=undefined){
		juego.agregarResultado(new modelo.Resultado(usuario.nombre,usuario.nivel,tiempo,vidas,usuario.intentos,score),function(resultadoInsertado){
			usuario.nivelCompletado();
			json=limpiarUsuario(usuario);
			response.send(json);
		});
	} else {
		response.send(json);
	}
});

app.get('/sumarIntento/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuarioPorId(id);
	var json={'intentos':-1}
	if (usuario!=undefined){
		usuario.sumarIntento();		
		json=JSON.stringify(limpiarUsuario(usuario));
	}
	response.send(json);
});

app.get('/resetNiveles/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuarioPorId(id);
	var json={'nivel':-1}
	if (usuario!=undefined){
		usuario.resetNiveles();	
		json=limpiarUsuario(usuario);
	}
	response.send(json);
});

app.get('/obtenerResultados/',function(request,response){
	var json={'resultados':[]};
	if (juego!=undefined){
		json=juego.resultados;
	}
	response.send(json);
});

app.get('/obtenerUsuariosConectados/',function(request,response){
	var usuarios=[];
	if (juego!=undefined){
		juego.usuariosConectados.forEach(function(usuario){
			usuarios.push(limpiarUsuario(usuario));
		});
	}
	response.send(usuarios);
});

app.post('/login',function(request,response){
	var nombre=request.body.nombre;
	var password=request.body.password;
	var passwordCifrada = cifrado.encrypt(password);
	var usuario = juego.obtenerUsuarioPorNombre(nombre);
	if (usuario!=undefined && usuario.activado && usuario.password==passwordCifrada) {
		juego.agregarUsuario(usuario);
		response.send(limpiarUsuario(usuario));
	} else {
		response.send({'nombre':undefined});
	}
});

app.delete("/eliminarUsuario/:id",function(request,response){
	var id=request.params.id;
	var password=request.body.password;
	var passwordCifrada = cifrado.encrypt(password);
	var json={'resultados':-1};
	var usuario = juego.obtenerUsuarioPorId(id);
	if (usuario!=undefined && usuario.password==passwordCifrada) {
		juego.bajaUsuario(usuario,function(usuarioEliminado){
			json={"resultados":1};
			console.log("Usuario eliminado: "+usuarioEliminado.nombre);
			response.send(json);
		});
	} else {
		response.send(json);
	}
});

app.post('/actualizarUsuario',function(request,response){
	var id=request.body.id;
	var nombre=request.body.nombre;
	var passwordOld=request.body.passwordOld;
	var passwordOldCifrada=cifrado.encrypt(passwordOld);
	var passwordNew=request.body.passwordNew;
	var passwordNewCifrada=cifrado.encrypt(passwordNew);
	var json={'nombre':undefined};
	var usuario = juego.obtenerUsuarioPorId(id);
	if (nombre && passwordOld && passwordNew && usuario!=undefined && usuario.password==passwordOldCifrada) {
		var nombreOld=usuario.nombre;
		usuario.actualizar(nombre,passwordNewCifrada,function(usuarioActualizado){
			var resultados=juego.obtenerResultadosPorNombre(nombreOld);
			resultados.forEach(function(resultado){
				resultado.actualizar(nombre);
			});
			response.send(limpiarUsuario(usuarioActualizado));
		});
	} else {
		response.send(json);
	}
});

app.get('/pedirNivel/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuarioPorId(id);
	var json={'nivel':-1};
	if (usuario && usuario.nivel<juego.niveles.length){
		response.send(juego.niveles[usuario.nivel]);
	} else {
		response.send(json);
	}
});

app.get('/salir/:id',function(request,response){
	var id=request.params.id;
	var json={id:undefined};
	var usuario=juego.obtenerUsuarioPorId(id);
	if (usuario!=undefined) {
		json=limpiarUsuario(usuario);
		juego.eliminarUsuario(usuario);
	}
	response.send(json);
});

app.get("/confirmarUsuario/:nombre/:key",function(request,response){
	var nombre = request.params.nombre;
	var key = request.params.key;
	var usuario = juego.obtenerUsuarioPorNombre(nombre);
	if (usuario!=undefined) {
		usuario.activar(key,function(usuario){
			if (usuario==undefined) {
				response.send('<h1>La cuenta ya esta activada');
			} else {
				response.redirect('/');
			}
		});
	} else {
		response.send('<h1>La cuenta no existe');
	}
});


function limpiarUsuario(usuario){
	//ToDo: Descomentar para poner en producción
	var usuarioClonado = _.clone(usuario);
	//usuarioClonado.key=undefined;
	usuarioClonado.email=undefined;
	usuarioClonado.password=undefined;
	return usuarioClonado;
};

function generar(longitud){
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
  var contraseña = "";
  for (i=0; i<longitud; i++) contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
  return contraseña;
}

io.on('connection', function (socket) {
	console.log("conectado:"+socket.id);

	socket.join("conectados");

	socket.on("updateDatos",function(usuario){
		usuario.socketid=socket.id;
  		io.to("conectados").emit('updateDatos', usuario);
	});

  	socket.on('updatePosicion', function (usuario) {
  		usuario.socketid=socket.id;
  		io.to("posiciones").emit('updatePosicion', usuario);
  		socket.join("posiciones");
  	});

  	socket.on("nojugando", function(usuario){
  		socket.leave("posiciones");
  		io.to("posiciones").emit('nojugando', {socketid:socket.id});
  	});

  	socket.on('disconnect', function() {
	  	socket.leave("conectados");
	  	io.to("conectados").emit('updateDatos', {socketid:socket.id});
	  	console.log("desconectado:"+socket.id);
  	});

  	io.to("conectados").emit('updateDatos', {socketid:socket.id});
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
