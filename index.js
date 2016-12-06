
var fs=require("fs");
var exp=require("express");
var app=exp();
var bodyParser=require("body-parser");
var mongo=require("mongodb").MongoClient;
var ObjectId=require("mongodb").ObjectId;
var modelo=require("./servidor/modelo.js");
var cifrado=require("./servidor/cifrado.js");
var moduloEmail=require('./servidor/email.js');
var persistencia=require('./servidor/persistencia.js');


var fm=new modelo.JuegoFM("./servidor/coordenadas.json");
var juego=fm.makeJuego(fm.juego,fm.array);

var usuariosCol;
var resultadosCol;
var limboCol;

app.set('port', (process.env.PORT || 5000));

app.use(exp.static(__dirname +"/cliente"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/",function(request,response){
	console.log(request.get('host'));
	var contenido=fs.readFileSync("./cliente/index.html");
	response.setHeader("Content-type","text/html");
	response.locals.name='Nombre de prueba';
	response.send(contenido);
});

app.post("/signup",function(request,response){
	var nombre = request.body.nombre;
	var email = request.body.email;
	var password = request.body.password;
	var passwordCifrada = cifrado.encrypt(password);
	limboCol.find({nombre:nombre}).toArray(function(error,usr){	
		if (usr.length>0){
			response.send({nombre:undefined});
		} else {
			usuariosCol.find({nombre:nombre}).toArray(function(error,usr){	
				if (usr.length>0){
					response.send({nombre:undefined});
				} else {
					var usuario=new modelo.Usuario(nombre,email,passwordCifrada);
					//insertarUsuarioLimbo(usuario,response);
					persistencia.insertarUsuario(limboCol,usuario,function(usu,result){
						moduloEmail.enviarEmail(usu);
						response.send(limpiarUsuario(usu));
					});
				}
			});
		}
	});
});

app.get("/comprobarUsuario/:id",function(request,response){
	var id = request.params.id;
	var usuario = juego.obtenerUsuario(id);
	var json={nivel:-1};
	if (usuario!=undefined) {
		json=JSON.stringify(limpiarUsuario(usuario));
		response.send(json);
	} else {
		usuariosCol.find({_id:ObjectId(id)}).toArray(function(error,usr){
			if (usr.length>0){
				var usuario=usr[0];
				juego.agregarUsuario(usuario);
				json=JSON.stringify(limpiarUsuario(usuario));
				response.send(json);
			} else {
				response.send(json);
			}
		});
	}	
})

app.get('/nivelCompletado/:id/:tiempo/:vidas',function(request,response){
	var id=request.params.id;
	var tiempo=request.params.tiempo;
	var vidas=request.params.vidas;
	var usuario=juego.obtenerUsuario(id);
	var json={'nivel':-1}
	if (usuario!=undefined){
		insertarResultado(new modelo.Resultado(usuario.nombre,usuario.nivel,tiempo,vidas,usuario.intentos));
		usuario.nivel+=1;
		usuario.intentos=0;
		usuariosCol.update({_id:ObjectId(id)}, {$set: {nivel:usuario.nivel,intentos:usuario.intentos}});
		json=limpiarUsuario(usuario);	
	}
	response.send(json);
});

app.get('/sumarIntento/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuario(id);
	var json={'intentos':-1}
	if (usuario!=undefined){
		usuario.intentos+=1;
		usuariosCol.update({_id:ObjectId(id)}, {$set: {intentos:usuario.intentos}});		
		json=JSON.stringify(limpiarUsuario(usuario));
	}
	response.send(json);
});

app.get('/resetNiveles/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuario(id);
	var json={'nivel':-1}
	if (usuario!=undefined){
		usuario.nivel=0;
		usuario.intentos=0;
		usuariosCol.update({_id:ObjectId(id)}, {$set: {nivel:usuario.nivel}});		
		json={'nivel':usuario.nivel};
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

app.post('/login',function(request,response){
	var nombre=request.body.nombre;
	var password=request.body.password;
	var passwordCifrada = cifrado.encrypt(password);
	usuariosCol.find({nombre:nombre,password:passwordCifrada}).toArray(function(error,usr){
		if (usr.length==0){
			response.send({'nombre':undefined});
		} else {
			var usuario=usr[0];
			juego.agregarUsuario(usuario);
			response.send(limpiarUsuario(usuario));
		}
	});
});

app.delete("/eliminarUsuario/:id",function(request,response){
	var id=request.params.id;
	var password=request.body.password;
	var passwordCifrada = cifrado.encrypt(password);
	var json={'resultados':-1};
	usuariosCol.remove({_id:ObjectId(id), password:passwordCifrada},function(err,result){
  		if (result.result.n==0){
    		console.log("No se pudo eliminar el usuario");
  		} else {
   			json={"resultados":1};
   			console.log("Usuario eliminado");
   			var usuario=juego.obtenerUsuario(id);
   			resultadosCol.remove({nombre:usuario.nombre},function(err,result){
				if (result.result.n==0){
			    	console.log("No se pudo eliminar los resultados");
			  	} else {
			  		juego.eliminarResultado(usuario.nombre);
			   		console.log("Resultados eliminados");
			  	}
			});
			juego.eliminarUsuario(id);
  		}
  		response.send(json);
 	});
});

app.post('/actualizarUsuario',function(request,response){
	var id=request.body.id;
	var nombre=request.body.nombre;
	var passwordOld=request.body.passwordOld;
	var passwordOldCifrada=cifrado.encrypt(passwordOld);
	var passwordNew=request.body.passwordNew;
	var passwordNewCifrada=cifrado.encrypt(passwordNew);
	var json={'nombre':undefined};
	if (nombre!='' && passwordOld!='' && passwordNew!='') {
		usuariosCol.update({_id:ObjectId(id),password:passwordOldCifrada}, {$set: {nombre:nombre,password:passwordNewCifrada}},function(err,result){
			if (result.result.n!=0){
		   		json=juego.obtenerUsuario(id);
		   		json.nombre=nombre
	 		}
		  	response.send(limpiarUsuario(json));
		});
	} else {
		response.send(json);
	}
});

app.get('/pedirNivel/:uid',function(request,response){
	var uid=request.params.uid;
	var usuario=juego.obtenerUsuario(uid);
	var json={'nivel':-1};
	if (usuario && usuario.nivel<juego.niveles.length){
		response.send(juego.niveles[usuario.nivel]);
	} else {
		response.send(json);
	}
});

app.get("/confirmarUsuario/:nombre/:key",function(request,response){
	var nombre = request.params.nombre;
	var key = request.params.key;

	limboCol.find({nombre:nombre,key:key}).toArray(function(error,usr){	
		if (usr.length==0){
			console.log("El usuario no exisste");
			response.send('<h1>La cuenta ya esta activada');
		} else {
			//insertarUsuario(usr[0],response);
			persistencia.insertarUsuario(usuariosCol,usr[0],function(usu){
				response.redirect('/');
				persistencia.eliminarUsuario(limboCol,usu);
				juego.agregarUsuario(usu);
			});
		}
	});
});

// function insertarUsuario(usu,response){
// 	usuariosCol.insert(usu,function(err){
// 		if(err){
// 			console.log("error");
// 		} else {
// 			console.log("Nuevo usuario creado");
// 			limboCol.remove({key:usu.key},function(error,result){
// 				if(!error){
// 					console.log('Usuario eliminado del limbo');
// 				}
// 			});
// 			juego.agregarUsuario(usu);
// 			response.redirect('/');
// 			//ToDo: Poner cuenta activada.
// 		}
// 	});
// }

// function insertarUsuarioLimbo(usu,response){
// 	limboCol.insert(usu,function(err,result){
// 		var json={'nombre':undefined};
// 		if(err){
// 			console.log("error");
// 		} else {
// 			console.log("Nuevo usuario creado");
// 			moduloEmail.enviarEmail(usu);
// 			json=limpiarUsuario(result["ops"][0]);
// 		}
// 		response.send(JSON.stringify(json));
// 	});
// }

function insertarResultado(resultado){
	juego.agregarResultado(resultado);
	resultadosCol.insert(resultado);
}

function limpiarUsuario(usuario){
	//ToDo: Descomentar para poner en producción
	//usuario.key=undefined;
	usuario.email=undefined;
	usuario.password=undefined;
	return usuario;
};

function cargarResultados(){
	juego.resultados=[];
	resultadosCol.find().forEach(function (result){juego.agregarResultado(result)});
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


mongo.connect("mongodb://pepe:pepe@ds048719.mlab.com:48719/usuarioscn", function(err, db) {
//mongo.connect("mongodb://127.0.0.1:27017/usuarioscn", function(err, db) {
	if (err){
 		console.log("No pudo conectar a la base de datos");
 	} else {
		console.log("Conectado a Mongo: usuarioscn");
		db.collection("usuarios",function(error,col){
			if (error){
				console.log("No pudo obtener la colección usuarios");
			} else {
				console.log("Tenemos la colección usuario");
				usuariosCol=col;
			}
		});
		db.collection("resultados",function(error,col){
			if (error){
				console.log("No pudo obtener la colección resultados");
			} else {
				console.log("tenemos la colección resultados");
				resultadosCol=col;
				cargarResultados();
			}
		});
		db.collection("limbo",function(error,col){
			if (error){
				console.log("No pudo obtener la colección limbo");
			} else {
				console.log("Tenemos la colección limbo");
				limboCol=col;
			}
		});
	}
});

