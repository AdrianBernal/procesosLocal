module.exports.insertarUsuario=function(coleccion,objeto,callback){
	coleccion.insert(objeto,function(err){
		if(err){
			console.log("error");
		} else {
			if(callback) callback(objeto); 
		}
	});
}

module.exports.eliminarUsuario=function(coleccion,objeto,callback){
	coleccion.remove({key:objeto.key},function(err){
		if(err){
			console.log("error");
		} else {
			if(callback) callback(objeto); 
		}
	});
}

// module.exports.actualizarUsuario=function(coleccion,objeto,callback){
// 	coleccion.update({_id:ObjectId(objeto._id)}, objeto,function(err){
// 		if(err){
// 			console.log("error");
// 		} else {
// 			if(callback) callback(objeto); 
// 		}
// 	});
// }

// module.exports.obtenerUsuario=function(coleccion,objeto,callback){
// 	coleccion.update({_id:ObjectId(objeto._id)}, objeto,function(err){
// 		if(err){
// 			console.log("error");
// 		} else {
// 			if(callback) callback(objeto); 
// 		}
// 	});
// }

