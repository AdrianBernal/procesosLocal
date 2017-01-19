var _ = require("underscore");
var fs=require("fs");
var path = require('path');
var persistencia=require('./persistencia.js').persistencia;

function Juego(){
	this.nombre="Niveles";
	this.niveles=[];
	this.usuariosConectados=[];
	this.usuariosRegistrados=[];
	this.resultados=[];

	var self=this;
	
	this.initPersistencia=function(){
		self.usuariosRegistrados=[];
		self.resultados=[];
		persistencia.initUsuarios(function(coleccion){
			coleccion.find().forEach(function(usuario){
				self.usuariosRegistrados.push(new Usuario().parse(usuario));
			});
		});
		persistencia.initResultados(function(coleccion){
			coleccion.find().forEach(function(resultado){
				self.resultados.push(new Resultado().parse(resultado));
			});
		});
	}

	this.nuevoUsuario=function(usuario,callback){
		var usuariosEncontrados = _.find(self.usuariosRegistrados,function(usu){
			return usu.nombre==usuario.nombre;
		});
		if (usuariosEncontrados==undefined && usuario.nombre && usuario.email && usuario.password) {
			persistencia.insertarUsuario(usuario,function(usuarioInsertado){
					var usuarioObj = new Usuario().parse(usuarioInsertado);
					self.usuariosRegistrados.push(usuarioObj);
					if (callback) callback(usuarioObj);
			});
		} else {
			if (callback) callback(undefined);
		}

	}

	this.bajaUsuario=function(usuario,callback){
		self.eliminarUsuario(usuario);
		persistencia.eliminarUsuario(usuario,function(usuarioEliminado){
			if (usuarioEliminado!=undefined){
				self.usuariosRegistrados=_.reject(self.usuariosRegistrados,function(usu){return usu._id.equals(usuario._id);});		
				persistencia.encontrarResultados({nombre:usuarioEliminado.nombre},function(resultados){
					resultados.forEach(function(resultado){
						persistencia.eliminarResultado(resultado, function(resultadoEliminado){
							self.eliminarResultado(resultadoEliminado);
						})
					});
					callback(usuarioEliminado);
				});
			} else {
				if (callback) callback(undefined);
			}
		});
	}

	this.agregarNivel=function(nivel){
		this.niveles.push(nivel);
	}

	this.obtenerUsuarioPorNombre=function(nombre){
		return _.find(self.usuariosRegistrados,function(usu){
			return usu.nombre==nombre;
		});
	}

	this.obtenerUsuarioPorId=function(id){
		return _.find(self.usuariosRegistrados,function(usu){
			return usu._id==id;
		});
	}

	this.obtenerResultadosPorNombre=function(nombre,callback){
		return _.filter(self.resultados,function(resultado){
			return resultado.nombre==nombre;
		});
	}

	this.agregarUsuario=function(usuario){
		self.usuariosConectados.push(usuario);
	}

	this.eliminarUsuario=function(usuario){
		self.usuariosConectados=_.reject(self.usuariosConectados,function(usu){return usu._id.equals(usuario._id);});
	}

	this.eliminarResultado=function(resultado){
		self.resultados=_.reject(self.resultados,function(res){return res._id.equals(resultado._id);});
	}

	this.agregarResultado=function(resultado,callback){
		var resultadosOld = _.filter(self.resultados,function(res){
			return resultado.nombre==res.nombre && resultado.nivel==res.nivel;
		});
		if (resultadosOld.length>0){
			var res = resultadosOld[0];
			if ((resultado.score>res.score) ||  (resultado.score==res.score && resultado.tiempo<res.tiempo) ||  (resultado.score==res.score && resultado.tiempo==res.tiempo && resultado.intentos<res.intentos) || (resultado.score==res.score && resultado.tiempo==res.tiempo && resultado.intentos==res.intentos && resultado.vidas>res.vidas)){	
				res.tiempo=resultado.tiempo;
				res.intentos=resultado.intentos;
				res.vidas=resultado.vidas;
				res.score=resultado.score;
				persistencia.actualizarResultado(res);
			}
			if (callback) callback(res);
		} else {
			persistencia.insertarResultado(resultado,function(resultadoInsertado){
				if (resultadoInsertado!=undefined) {
					var resultadoObj = new Resultado().parse(resultadoInsertado)
					self.resultados.push(resultadoObj);
				}
				if (callback) callback(resultadoObj);
			});
		}
	}

	this.initPersistencia();
}

function Nivel(num,data){
	this.nivel=num;
	this.data=data;
}

function Usuario(nombre, email, password){
	this._id=undefined;
	this.key=(new Date().valueOf()).toString();
	this.nombre=nombre;
	this.nivel=0;
	this.intentos=0;
	this.email=email;
	this.password=password;
	this.activado=false;

	var self=this;

	this.parse=function(data){
		self._id=data._id;
		self.key=data.key;
		self.nombre=data.nombre;
		self.nivel=data.nivel;
		self.intentos=data.intentos;
		self.email=data.email;
		self.password=data.password;
		self.activado=data.activado;

		return self;
	}

	this.activar=function(key,callback){
		if (self.key==key && self.activado==false){
			self.activado=true;
			persistencia.actualizarUsuario(self,callback);
		} else {
			if (callback) callback(undefined);
		}
	}

	this.nivelCompletado=function(callback){
		self.nivel+=1;
		self.intentos=0;
		persistencia.actualizarUsuario(self,callback);
	}

	this.sumarIntento=function(callback){
		self.intentos+=1;
		persistencia.actualizarUsuario(self,callback);
	}

	this.resetNiveles=function(callback){
		self.nivel=0;
		self.intentos=0;
		persistencia.actualizarUsuario(self,callback);
	}

	this.actualizar=function(nombre,password,callback){
		self.nombre=nombre;
		self.password=password;
		persistencia.actualizarUsuario(self,callback);
		
	}
}

function Resultado(nombre,nivel,tiempo,vidas,intentos,score){
	this._id=undefined;
	this.nombre=nombre;
	this.nivel=nivel;
	this.tiempo=tiempo;
	this.vidas=vidas;
	this.intentos=intentos;
	this.score=score;

	var self=this;

	this.parse=function(data){
		self._id=data._id;
		self.nombre=data.nombre;
		self.nivel=data.nivel;
		self.tiempo=data.tiempo;
		self.vidas=data.vidas;
		self.intentos=data.intentos;
		self.score=data.score;

		return self;
	}

	this.actualizar=function(nombre,callback){
		self.nombre=nombre;
		persistencia.actualizarResultado(self,callback);
	}

}

function JuegoFM(directorio){
	this.juego=new Juego();
	this.array=leerCoordenadas(directorio);
	this.makeJuego=function(){
		this.array.forEach(function(nivel,i){
			var nivel=new Nivel(i,nivel);
			this.juego.agregarNivel(nivel);
		},this);
		return this.juego;
	}
}

function leerCoordenadas(directorio){
	var array=[];
	var fileNames = fs.readdirSync(directorio);
    for(var i = 0; i < fileNames.length; i++) {
	      var fileName = fileNames[i];
	      if(path.extname(fileName) === ".json") {
	        var data = fs.readFileSync(path.join(directorio,fileName));
	       	array[i]=JSON.parse(data);
	      }
	}
	/*var array=JSON.parse(fs.readFileSync(archivo));*/
	return array;
}

module.exports.Juego=Juego;
module.exports.Usuario=Usuario;
module.exports.Resultado=Resultado;
module.exports.JuegoFM=JuegoFM;
module.exports.persistencia=persistencia;