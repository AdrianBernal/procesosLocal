
var fs=require("fs");
//var config=JSON.parse(fs.readFileSync("config.json"));
//var host=config.host;
//var port=config.port;
var exp=require("express");
var app=exp();
var bodyParser=require("body-parser");
var mongo=require("mongodb").MongoClient;
var ObjectId=require("mongodb").ObjectId;
var modelo=require("./servidor/modelo.js");

var juego= new modelo.Juego();
var usuariosCol;

app.set('port', (process.env.PORT || 5000));

//app.use(app.router);
app.use(exp.static(__dirname +"/cliente"));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/",function(request,response){
	var contenido=fs.readFileSync("./cliente/index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

app.post("/signup",function(request,response){
	var email = request.body.email;
	var password = request.body.password;
	usuariosCol.find({email:email}).toArray(function(error,usr){
		if (usr.length>0){
			response.send({email:undefined});
		} else {
			var usuario=new modelo.Usuario(email,password);
			insertar(usuario,response);		
		}
	});
});

app.get("/comprobarUsuario/:id",function(request,response){
	//var id = request.params.id;
	var usuario = juego.obtenerUsuario(request.params.id);
	var json={nivel:-1};
	if (usuario!=undefined) {
		json=usuario;
	}
	response.send(json);
	/*var usuario = juego.obtenerUsuario(id);
	var json={'nivel':-1};
	if (usuario!=undefined){
		json=usuario;
		response.send(json);
	} else {
		usuariosCol.find({_id:ObjectId(id)}).toArray(function(error,usr){
			console.log('usr.length'+usr.length);
			if (usr.length>0){
				juego.agregarUsuario(usr[0]);
				json=usr[0];
			}
			response.send(json);
		});	
	}*/
	
});

app.get('/nivelCompletado/:id/:tiempo',function(request,response){
	console.log('nivelCompletado');
	var id=request.params.id;
	var tiempo=request.params.tiempo;
	var usuario=juego.obtenerUsuario(id);
	var json={'nivel':-1}
	if (usuario!=undefined){
		juego.agregarResultado(new modelo.Resultado(usuario.email,usuario.nivel,tiempo));
		usuario.nivel+=1;
		usuariosCol.update({_id:ObjectId(id)}, {$set: {nivel:usuario.nivel}});		
		json={'nivel':usuario.nivel};
	}
	response.send(json);
});

app.get('/resetNiveles/:id',function(request,response){
	var id=request.params.id;
	var usuario=juego.obtenerUsuario(id);
	var json={'nivel':-1}
	if (usuario!=undefined){
		usuario.nivel=0;
		usuariosCol.update({_id:ObjectId(id)}, {$set: {nivel:usuario.nivel}});		
		json={'nivel':usuario.nivel};
	}
	response.send(json);
});


//app.get('/obtenerResultados/:id',function(request,response){
app.get('/obtenerResultados/',function(request,response){
	//var id=request.params.id;
	//var usuario=juego.obtenerUsuario(id);
	var json={'resultados':[]};
	/*if (usuario){
		json=juego.resultados;
	}*/
	if (juego!=undefined){
		json=juego.resultados;
	}
	response.send(json);
});

app.post('/login',function(request,response){
	var email=request.body.email;
	var password=request.body.password;
	var usuario=juego.obtenerUsuarioLogin(email,password);
	if  (usuario==undefined) {
		/*console.log('preguntar db no tiene que hacerlo');
		usuariosCol.find({email:email,password:password}).toArray(function(error,usr){
			if (usr.length==0){
				response.send({'email':undefined});
			} else {
				juego.agregarUsuario(usr[0]);
				response.send(usr[0]);
			}
		});*/
		response.send({'email':undefined});
	} else {
		response.send(usuario);
	}
});

app.delete("/eliminarUsuario/:id",function(request,response){
 var id=request.params.id;
 var json={'resultados':-1};
 usuariosCol.remove({_id:ObjectId(id)},function(err,result){
  //console.log(result);
  if (result.result.n==0){
    console.log("No se pudo eliminar");
  }
  else{
   json={"resultados":1};
   console.log("Usuario eliminado");
  }
  cargarUsuarios();
  response.send(json);
 });
});

app.post('/actualizarUsuario',function(request,response){
	var id=request.body.id;
	var email=request.body.email;
	var passwordOld=request.body.passwordOld;
	var passwordNew=request.body.passwordNew;
	var json={'resultados':-1};
	usuariosCol.update({_id:ObjectId(id),password:passwordOld}, {$set: {nombre:email,email:email,password:passwordNew}},function(err,result){
		if (result.result.n==0){
    	console.log("No se pudo actualizar");
  		} else {
	   		json={"resultados":1};
	   		console.log("Usuario actualizado");
 		}
	  	cargarUsuarios();
	  	response.send(json);
	});
});

//console.log("Servidor escuchando en el puerto "+port);
//app.listen(port,host);
//app.listen(process.env.PORT || port);

function insertar(usu,response){
	console.log(usu);
	usuariosCol.insert(usu,function(err){
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado");
			juego.agregarUsuario(usu);
			response.send(usu);
		}
	});
}

function cargarUsuarios(){
	juego.usuarios=[];
	usuariosCol.find().forEach(function (usr){juego.agregarUsuario(usr);});
}


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


//mongo.connect("mongodb://pepe:pepe@ds048719.mlab.com:48719/usuarioscn", function(err, db) {
mongo.connect("mongodb://127.0.0.1:27017/usuarioscn", function(err, db) {
	if (err){
 		console.log("No pudo conectar a la base de datos");
 	} else {
		console.log("Conectado a Mongo: usuarioscn");
		db.collection("usuarios",function(error,col){
			console.log("tenemos la colección");
			usuariosCol=col;
			cargarUsuarios();
		});
	}
});


/*var db = new mongo.Db("usuarioscn",new mongo.Server("127.0.0.1",27017,{}));

db.open(function(error){
	console.log("contectado a Mongo: usuarioscn");
	db.collection("usuario",function(error,col){
		console.log("tenemos la colección");
		usuariosCol=col;
		col.insert({
			id:"1",
			name:"Pepe Lopez",
			twitter:"@pepe",
			email:"pepe@lopez.es"
		},function(err){
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado");
		}
	});
		//console.log(usuariosCol);
	});	
});*/

