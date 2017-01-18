var request=require("request");
var _ = require("underscore");
//var url='https://procesos.herokuapp.com/';
//var url='http://161.67.8.34:5000/';
var url='http://127.0.0.1:5000/'
var headers={
	//'User-Agent': 'request'
	"User-Agent":"Super Agent/0.0.1",
	'Content-Type' : 'application/x-www-form-urlencoded' 
}


console.log("===========================================")
console.log(" Inicio de las pruebas del API REST:");
console.log(" 1. Crear usuario");
console.log(" 2. Comprobar que usuario no está confirmado");
console.log(" 3. Confirmar usuario");
console.log(" 4. Comprobar usuario");
console.log(" 5. Inicicar sesion");
console.log(" 6. El usuario sale. Se desloguea");
console.log(" 7. Recordamos la contraseña");
console.log(" 8. Iniciar sesión de nuevo");
console.log(" 9. Actualizar usuario");
console.log(" 10. Pedir nivel actual");
console.log(" 11. Sumar intento");
console.log(" 12. Completar nivel");
console.log(" 13. Resetear nivel");
console.log(" 14. Obtener resultados");
console.log(" 15. Eliminar usuario");
console.log(" 16. Intentar iniciar sesión");
console.log(" 17. Obtener resutlados otra vez");
console.log(" url= "+url);
console.log("========================================== \n")

function crearUsuario(nombre,email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,email:email,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("1. Intentar crear el usuario "+nombre+" con email "+email+" y con clave "+password+"");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body)
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" creado correctamente \n");
	    		console.log("Usuario id: "+jsonResponse._id+"\n");
	    		comprobarUsuario(jsonResponse._id,jsonResponse.key,nombre,password);
	    	}
	    	else{
	    		console.log("El usuario no se pudo registrar \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function comprobarUsuario(id,key,nombre,password){
	var options={
		url:url+'comprobarUsuario/'+id,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("2. Se comprueba que el usuario Pepe con email pepe@pepe.es no está confirmado");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
			if(jsonResponse.nivel<0){
				console.log("Usuario "+nombre+" no confirmado \n");
				confirmarUsuario(id,key,nombre,password)
			} else {
				console.log("Usuario "+jsonResponse.nombre+" confirmado correctamente. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");
			}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function confirmarUsuario(id,key,nombre,password){
	var options={
		url:url+'confirmarUsuario/'+nombre+'/'+key,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("3. Se confirma el usuario Pepe con email pepe@pepe.es");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log("Usuario "+nombre+" confirmado \n");
			comprobarUsuario2(id,nombre,password);
		}
		else{
			console.log("El usuario "+nombre+" nose ha podido confirmar \n");
		}
	});
}


function comprobarUsuario2(id,nombre,password){
	var options={
		url:url+'comprobarUsuario/'+id,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("4. Se comprueba que el usuario Pepe con email pepe@pepe.es está confirmado");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
			if(jsonResponse.nivel<0){
				console.log("Usuario "+nombre+" no confirmado \n");
			} else {
				console.log("Usuario "+jsonResponse.nombre+" confirmado correctamente. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");
				iniciarSesion(jsonResponse.nombre,password)
			}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function iniciarSesion(nombre,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("5. El usuario: "+nombre+" intenta iniciar sesión");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    		salir(jsonResponse._id,jsonResponse.nombre,password);
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo iniciar la sesión \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function salir(id,nombre,password){
	var options={
		url:url+'salir/'+id,
		method:'GET',
		headers:headers
	}
	console.log("--------------------------------------------------------");
	console.log("6. El usuario: "+nombre+" sale. Se  desloguea.");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body) ;
    		if (jsonResponse._id!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" se ha deslogueado \n");
	    		recordar(jsonResponse._id,jsonResponse.nombre,password);
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo desloguearse \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function recordar(id,nombre,password){
	var options={
		url:url+'recordar',
		method:'POST',
		headers:headers,
		form:{nombre:nombre}
	}

	console.log("--------------------------------------------------------");
	console.log("7. El usuario: "+nombre+" intenta recordar su contraseña.");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse._id!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha recordado su contraseña \n");
	    		iniciarSesion2(jsonResponse.nombre,jsonResponse.password);
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo recordar su contraseña \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function iniciarSesion2(nombre,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("8. El usuario: "+nombre+" intenta iniciar sesión con la contraseña recordada");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    		actualizarUsuario(jsonResponse._id,jsonResponse.nombre,password);
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo iniciar la sesión \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario(id,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,nombre:nombre+'Actualizado',passwordOld:password,passwordNew:password+'Actualizada'}
	}

	console.log("--------------------------------------------------------");
	console.log("9. El usuario: "+nombre+" actualiza el nombre y la contraseña");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre y su contraseña \n");
	    		pedirNivel(jsonResponse._id,jsonResponse.nombre,password+'Actualizada');
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}


function pedirNivel(id,nombre,password){
	var options={
		url:url+'pedirNivel/'+id,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("10. Se pide el nivel para el usuario: "+nombre);
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nivel<0){
	    		console.log("Nivel no encontrado para el usuario "+nombre+"\n");
	    	}
	    	else{
	    		console.log("Nivel para el usuario "+nombre+": \n");
	    		console.log(jsonResponse);
	    		sumarIntento(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function sumarIntento(id,nombre,password){
	var options={
		url:url+'sumarIntento/'+id,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("11. Se suma un intento a "+nombre);
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.intentos<0){
	    		console.log("No se a podido sumar un intento a "+nombre+" \n");
	    	}
	    	else if (jsonResponse.intentos==1){
	    		console.log("Intento sumado correctamente a "+nombre+" con "+jsonResponse.intentos+" intentos \n");
	    		nivelCompletado(id,nombre,password,10,3,100);
	    	} else {
	    		console.log("Intento no sumado correctamente a "+nombre+" con "+jsonResponse.intentos+" intentos \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function nivelCompletado(id,nombre,password,tiempo,vidas,score){
	var options={
		url:url+'nivelCompletado/'+id+'/'+tiempo+'/'+vidas+'/'+score,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("12. Se completa el nivel para "+nombre+" con "+tiempo+" segundos, "+vidas+" vidas y "+score+" de score");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nivel<0){
	    		console.log("No se a podido completar el nivel para "+nombre+"\n");
	    	}
	    	else if (jsonResponse.nivel==1 && jsonResponse.intentos==0){
	    		console.log("Nivel completado correctamente para "+jsonResponse.nombre+" \n");
	    		console.log("Nivel actual: "+jsonResponse.nivel+" / Intentos actuales: "+jsonResponse.intentos+"\n");
	    		resetNiveles(id,nombre,password,tiempo,vidas,score);
	    	} else {
	    		console.log("Nivel no completado correctamente para "+jsonResponse.nombre+" \n");
	    		console.log("Nivel actual: "+jsonResponse.nivel+" / Intentos actuales: "+jsonResponse.intentos+"\n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function resetNiveles(id,nombre,password,tiempo,vidas,score){
	var options={
		url:url+'resetNiveles/'+id,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("13. Se resetea el nivel para "+nombre);
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nivel<0){
	    		console.log("No se a podido resetear el nivel para "+nombre+"\n");
	    	}
	    	else if (jsonResponse.nivel==0 && jsonResponse.intentos==0){
	    		console.log("Nivel reseteado correctamente para "+nombre+" \n");
	    		console.log("Nivel actual: "+jsonResponse.nivel+" / Intentos actuales: "+jsonResponse.intentos+"\n");
	    		obtenerResultados(id,nombre,password,tiempo,vidas,score);
	    	} else {
	    		console.log("Nivel no reseteado correctamente para "+nombre+" \n");
	    		console.log("Nivel actual: "+jsonResponse.nivel+" / Intentos actuales: "+jsonResponse.intentos+"\n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function obtenerResultados(id,nombre,password,tiempo,vidas,score){
	var options={
		url:url+'obtenerResultados',
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("14. Obtenemos los resultados almacenados");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body) ;
    		if (jsonResponse.length==0){
	    		console.log("No se han podido obtener los resultados\n");
	    	}
	    	else{
	    		console.log("Resultados obtenidos correctamente \n");
	    		var resultados=_.filter(jsonResponse,function(resultado){return (resultado.nombre==nombre && resultado.tiempo==tiempo && resultado.vidas==vidas && resultado.nivel==0 && resultado.score==score);});
	    		if (resultados.length>0) {
	    			console.log("Resultados del usuario "+nombre+" obtenidos correctamente \n");
	    		console.log(JSON.stringify(resultados)+"\n");
	    		eliminarUsuario(id,password);
	    		} else {
	    			console.log("No se han podido obtener los resultados del usuario "+nombre+"\n");
	    			eliminarUsuario(id,password);
	    		}
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function eliminarUsuario(id,password){
	var options={
		url:url+'eliminarUsuario/'+id,
		method:'DELETE',
		headers:headers,
		form:{password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("15. Se intenta eliminar el usuario con id: "+id);
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.resultados==1){
	    		console.log("Usuario "+id+" eliminado \n");
	    		iniciarSesion3('pepe@pepe.es','pepe');
	    	}
	    	else{
	    		console.log("El usuario no existe \n");
	    	}
		}
		else{
			console.log("Eliminar: Error al conectar");
		}
	});
}

function iniciarSesion3(nombre,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("16. El usuario: "+nombre+" intenta iniciar sesión");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    	} else {
	    		console.log("El usuario "+nombre+" no pudo iniciar la sesión \n");
	    		obtenerResultados2(nombre);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function obtenerResultados2(nombre){
	var options={
		url:url+'obtenerResultados',
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("17. Obtenemos los resultados almacenados");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body) ;
    		if (jsonResponse.length==0){
	    		console.log("No se han podido obtener los resultados\n");
	    	}
	    	else{
	    		console.log("Resultados obtenidos correctamente \n");
	    		var resultados=_.filter(jsonResponse,function(resultado){return resultado.nombre==nombre;});
	    		if (resultados.length<1) {
	    			console.log("Resultados del usuario "+nombre+" fueron eliminados correctamente y no se han podido encontrar\n");
	    		} else {
	    			console.log("Resultados del usuario "+nombre+" no fueron eliminados correctamente y se han podido encontrar\n");
	    			console.log(JSON.stringify(resultados)+"\n");
	    		}
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

crearUsuario('Pepe','pepe@pepe.com','pepe');