
var fs=require("fs");
var config=JSON.parse(fs.readFileSync("config.json"));
var host=config.host;
var port=config.port;
var exp=require("express");
var app=exp();
var mongo=require("mongodb");
var modelo=require("./servidor/modelo.js");
var debug=true;
var juego= new modelo.Juego();
var usuariosCol;

//app.use(app.router);
app.use(exp.static(__dirname +"/cliente"));

app.get("/",function(request,response){
	var contenido=fs.readFileSync("./index.html");
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

app.get("/crearUsuario/:nombre",function(request,response){
	var usuario = new modelo.Usuario(request.params.nombre);
	juego.agregarUsuario(usuario);
	var id=usuario.id;
	usuario=juego.obtenerUsuario(id);
	if(debug){console.log("Nombre: "+usuario.nombre);}
	response.send({'nombre':usuario.nombre,'nivel':usuario.nivel,'id':usuario.id});
});

app.get("/comprobarUsuario/:id",function(request,response){
	var id = request.params.id;
	var usuario = juego.obtenerUsuario(id);
	var json={'nivel':-1};
	if(debug){console.log("comprobar Usuario nivel: "+usuario.nivel);}
	if (usuario!=undefined){		
		json={'nivel':usuario.nivel};
	}
	response.send(json);
});

app.get('/nivelCompletado/:id/:tiempo',function(request,response){
	var id=request.params.id;
	var tiempo=request.params.tiempo;
	var usuario=juego.obtenerUsuario(id);
	juego.agregarResultado(new modelo.Resultado(usuario.nombre,usuario.nivel,tiempo));
	usuario.nivel+=1;
	if(debug){console.log(juego.resultados);}
	if (usuario!=undefined){		
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

function insertar(usu){
	console.log(usu);
	usuariosCol.insert(usu,function(err){
		if(err){
			console.log("error");
		} else {
			console.log("Nuevo usuario creado");
		}
	});
}

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

console.log("Servidor escuchando en el puerto "+port);
//app.listen(port,host);
app.listen(process.env.PORT || port);