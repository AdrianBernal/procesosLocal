var mongo=require("mongodb").MongoClient;
var ObjectId=require("mongodb").ObjectId;

var persistencia = function(db) {
	this.db=db;
	this.usuariosCol;
	this.resultadosCol;

	var self=this;

	this.obtenerColeccion=function(nombreColeccion,callback){
		mongo.connect("mongodb://pepe:pepe@ds131878.mlab.com:31878/"+self.db, function(err, db) {
		//mongo.connect("mongodb://127.0.0.1:27017/usuarioscn", function(err, db) {
			if (err){
		 		console.log("No pudo conectar a la base de datos: "+self.db);
		 	} else {
				//console.log("Conectado a Mongo: "+self.db);
				db.collection(nombreColeccion,function(error,col){
					if (error){
						console.log("No pudo obtener la colección: "+nombreColeccion);
					} else {
						//console.log("Tenemos la colección: "+nombreColeccion);
						if(callback) callback(col);
					}
				});
			}
		});
	}

	this.initUsuarios=function(callback){
		self.obtenerColeccion("usuarios",function(coleccion){
			self.usuariosCol=coleccion;
			if (callback) callback(self.usuariosCol);
		});
	}
	this.initResultados=function(callback){
		self.obtenerColeccion("resultados",function(coleccion){
			self.resultadosCol=coleccion;
			if (callback) callback(self.resultadosCol);
		});
	}

	this.insertar=function(coleccion,objeto,callback){
		coleccion.insert(objeto,function(err,data){
			if(err){
				if(callback) callback(undefined); 
			} else {
				if(callback) callback(data.ops[0]); 
			}
		});
	}

	this.eliminar=function(coleccion,objeto,callback){
		coleccion.remove({_id:ObjectId(objeto._id)},function(err,removeResult){
			if(err || removeResult.result.n<1){
				if(callback) callback(undefined); 
			} else {
				if(callback) callback(objeto); 
			}
		});
	}

	this.encontrar=function(coleccion,criterio,callback){
	    coleccion.find(criterio).toArray(function(error,array){
	        if (error){
	            if (callback) callback(undefined);
	        }
	        else{
	            if (callback) callback(array);
	        }
	    });
	}

	this.actualizar=function(coleccion,objeto,callback){
		coleccion.findAndModify({_id:ObjectId(objeto._id)},[],objeto,{new:true},function(error,data){
	        if (data.value==null){
	            if (callback) callback(undefined);
	        } else {
	            if (callback) callback(data.value);
	        }
	    });
	}


	this.insertarUsuario=function(usuario,callback){
		self.insertar(self.usuariosCol,usuario,callback);
	}
	this.insertarResultado=function(resultado,callback){
		self.insertar(self.resultadosCol,resultado,callback);
	}
	this.encontrarUsuarios=function(criterio,callback){
		self.encontrar(self.usuariosCol,criterio,callback);
	}
	this.obtenerUsuario=function(id,callback){
		self.encontrar(self.usuariosCol,{_id:ObjectId(id),activado:true},callback);
	}
	this.encontrarResultados=function(criterio,callback){
		self.encontrar(self.resultadosCol,criterio,callback);
	}
	this.actualizarUsuario=function(usuario,callback){
		self.actualizar(self.usuariosCol,usuario,callback);
	}
	this.actualizarResultado=function(resultado,callback){
		self.actualizar(self.resultadosCol,resultado,callback);
	}
	this.eliminarUsuario=function(usuario,callback){
		self.eliminar(self.usuariosCol,usuario,callback);
	}
	this.eliminarResultado=function(resultado,callback){
		self.eliminar(self.resultadosCol,resultado,callback);
	}
}

module.exports.persistencia=new persistencia("usuarioscn");