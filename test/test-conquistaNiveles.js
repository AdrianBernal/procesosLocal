var request=require("request");
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
console.log(" 1. Crear usuario - 2. Iniciar sesión");
console.log(" 3. Modificar usuario - 4. Eliminar usuario");
console.log(" 5. El usuario no puede iniciar sesión");
console.log("========================================== \n")

function crearUsuario(nombre,email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,email:email,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("1. Intentar crear el usuario Pepe con email pepe@pepe.es y con clave pepe");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" creado correctamente \n");
	    		console.log("Usuario id: "+jsonResponse._id+"\n");
	    		confirmarUsuario(jsonResponse._id,jsonResponse.key,nombre,password);
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

function confirmarUsuario(id,key,nombre,password){
	var options={
		url:url+'confirmarUsuario/'+nombre+'/'+key,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("2. Se confirma el usuario Pepe con email pepe@pepe.es");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log("Usuario "+nombre+" confirmado");
			comprobarUsuario(id,nombre,password);
		}
		else{
			console.log("El usuario "+nombre+" nose ha podido confirmar \n");
		}
	});
}


function comprobarUsuario(id,nombre,password){
	var options={
		url:url+'comprobarUsuario/'+id,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("3. Se comprueba que el usuario Pepe con email pepe@pepe.es está confirmado \n");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;

			if(jsonResponse.nivel<0){
				console.log("Usuario "+nombre+" no confirmado \n");
			} else {
				console.log("Usuario "+jsonResponse.nombre+" confirmado correctamente. Con "+jsonResponse.intentos+" intentos \n");
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

	console.log("---------------------------------------------");
	console.log("4. El usuario: "+nombre+" intenta iniciar sesión");
	console.log("---------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.email!=""){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    		actualizarUsuario(jsonResponse._id,jsonResponse.nombre,password);
	    		//eliminarUsuario(jsonResponse._id);
	    	}
	    	else{
	    		console.log("El usuario "+email+" NO pudo iniciar la sesión \n");
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

	console.log("---------------------------------------------");
	console.log("5. El usuario: "+nombre+" actualiza el nombre");
	console.log("---------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
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

	console.log("---------------------------------------------");
	console.log("6. Se pide el nivel para el usuario: "+nombre+" \n");
	console.log("---------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nivel<0){
	    		console.log("Nivel no encontrado para el usuario "+nombre+" ha actualizado su nombre \n");
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

	console.log("---------------------------------------------");
	console.log("7. Se suma un intento a "+nombre+" \n");
	console.log("---------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.intentos<0){
	    		console.log("No se a podido sumar un intento a "+nombre+" \n");
	    	}
	    	else{
	    		console.log("Intento sumado correctamente a "+nombre+" con "+jsonResponse.intentos+" intentos \n");
	    		nivelCompletado(id,nombre,password,10,3);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function nivelCompletado(id,nombre,password,tiempo,vidas){
	var options={
		url:url+'nivelCompletado/'+id+'/'+tiempo+'/'+vidas,
		method:'GET',
		headers:headers
	}

	console.log("---------------------------------------------");
	console.log("8. Se completa el nivel para "+nombre+" con "+tiempo+" segundos y "+vidas+" vidas\n");
	console.log("---------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nivel<0){
	    		console.log("No se a podido completar el nivel para "+nombre+"\n");
	    	}
	    	else{
	    		console.log("Nivel completado correctamente para "+jsonResponse.nombre+" \n");
	    		console.log("Nivel actual: "+jsonResponse.nivel+" / Intentos actuales: "+jsonResponse.intentos+"\n");
	    		resetNiveles(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function resetNiveles(id,nombre,password){
	var options={
		url:url+'resetNiveles/'+id,
		method:'GET',
		headers:headers
	}

	console.log("---------------------------------------------");
	console.log("9. Se resetea el nivel para "+nombre+" \n");
	console.log("---------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nivel<0){
	    		console.log("No se a podido resetear el nivel para "+nombre+"\n");
	    	}
	    	else{
	    		console.log("Nivel reseteado correctamente para "+nombre+" \n");
	    		console.log("Nivel actual: "+jsonResponse.nivel+" / Intentos actuales: "+jsonResponse.intentos+"\n");
	    		obtenerResultados(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function obtenerResultados(id,nombre,password){
	var options={
		url:url+'obtenerResultados',
		method:'GET',
		headers:headers
	}

	console.log("---------------------------------------------");
	console.log("10. Obtenemos los resultados almacenados \n");
	console.log("---------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.length==0){
	    		console.log("No se han podido obtener los resultados\n");
	    	}
	    	else{
	    		console.log("Resultados obtenidos correctamente \n");
	    		console.log(JSON.stringify(jsonResponse)+"\n");
	    		eliminarUsuario(id,password);
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

	console.log("---------------------------------------------");
	console.log("11. Se intenta eliminar el usuario con id: "+id);
	console.log("---------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.resultados==1){
	    		console.log("Usuario "+id+" eliminado \n");
	    		iniciarSesion2('pepe@pepe.es','pepe');
	    	}
	    	else{
	    		console.log("El usuarios no existe \n");
	    	}
		}
		else{
			console.log("Eliminar: Error al conectar");
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

	console.log("---------------------------------------------");
	console.log("12. El usuario: "+nombre+" intenta iniciar sesión");
	console.log("---------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    	} else {
	    		console.log("El usuario "+nombre+" no pudo iniciar la sesión \n");
	    		obtenerResultados2();
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function obtenerResultados2(){
	var options={
		url:url+'obtenerResultados',
		method:'GET',
		headers:headers
	}

	console.log("---------------------------------------------");
	console.log("13. Obtenemos los resultados almacenados \n");
	console.log("---------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body) ;
    		if (jsonResponse.length==0){
	    		console.log("No se han podido obtener los resultados\n");
	    	}
	    	else{
	    		console.log("Resultados obtenidos correctamente \n");
	    		console.log(JSON.stringify(jsonResponse)+"\n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

crearUsuario('Pepe','pepe@pepe.es','pepe');