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
console.log(" 1. Crear usuario con nombre en blanco");
console.log(" 2. Crear usuario con email en blanco");
console.log(" 3. Crear usuario con clave en blanco");
console.log(" 4. Crear usuario con nombre indefinido");
console.log(" 5. Crear usuario con email indefinido");
console.log(" 6. Crear usuario con clave en indefinida");
console.log(" 7. Crear usuario para poder realizar más pruebas");
console.log(" 8. Se confirma el usuario con nombre que no existe");
console.log(" 9. Se confirma el usuario con key que no existe");
console.log(" 10. Iniciar sesión antes de confimrar correctamente");
console.log(" 11. Se confirma el usuario para poder realizar más pruebas");
console.log(" 12. Comprobar usuario con id no que no existe");
console.log(" 13. Actualizar usuario con id no que no existe");
console.log(" 14. Actualizar usuario con id en blanco");
console.log(" 15. Actualizar usuario con nombre en blanco");
console.log(" 16. Actualizar usuario con password actual en blanco");
console.log(" 17. Actualizar usuario con password nueva en blanco");
console.log(" 18. Actualizar usuario con id indefinido");
console.log(" 19. Actualizar usuario con nombre indefinido");
console.log(" 20. Actualizar usuario con password actual indefinida");
console.log(" 21. Actualizar usuario con password nueva indefinida");
console.log(" 22. Pedir nivel con id que no existe");
console.log(" 23. Comrpobar nivel inicial");
console.log(" 24. Sumar intento con id que no existe");
console.log(" 25. Comprobar intento no sumado");
console.log(" 26. Completar nivel con id que no existe");
console.log(" 27. Comprobar nivel no sumado");
console.log(" 28. Completar nivel para realizar otras pruebas");
console.log(" 29. Resetear nivel con id que no existe");
console.log(" 30. Comprobar que nivel no se ha reseteado");
console.log(" 31. Login con nombre en blanco");
console.log(" 32. Login con password en blanco");
console.log(" 33. Login con nombre indefinido");
console.log(" 34. Login con password indefinida");
console.log(" 35. Recordar con nombre en blanco");
console.log(" 36. Recordar con nombre indefinido");
console.log(" 37. Iniciar sesión con primera password");
console.log(" 38. Salir con un id que no existe");
console.log(" 39. Se elimina el usuario con un id que no existe");
console.log(" 40. Se elimina el usuario");
console.log(" url= "+url);
console.log("========================================== \n")

function crearUsuario(nombre,email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{nombre:'',email:email,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("1. Intentar crear el usuario con nombre en blanco, con email "+email+" y con clave "+password+"");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body)
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" creado correctamente \n");
	    		console.log("Usuario id: "+jsonResponse._id+"\n");
	    	}
	    	else{
	    		console.log("El usuario no se pudo registrar \n");
	    		crearUsuario2(nombre,email,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function crearUsuario2(nombre,email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,email:'',password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("2. Intentar crear el usuario "+nombre+" con email en blanco y con clave "+password+"");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body)
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" creado correctamente \n");
	    		console.log("Usuario id: "+jsonResponse._id+"\n");
	    	}
	    	else{
	    		console.log("El usuario no se pudo registrar \n");
	    		crearUsuario3(nombre,email,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function crearUsuario3(nombre,email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,email:email,password:''}
	}

	console.log("--------------------------------------------------------");
	console.log("3. Intentar crear el usuario "+nombre+" con email "+email+" y con clave en blanco");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body)
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" creado correctamente \n");
	    		console.log("Usuario id: "+jsonResponse._id+"\n");
	    	}
	    	else{
	    		console.log("El usuario no se pudo registrar \n");
	    		crearUsuario4(nombre,email,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function crearUsuario4(nombre,email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{email:email,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("4. Intentar crear el usuario con nombre indefinido, con email "+email+" y con clave "+password+"");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body)
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" creado correctamente \n");
	    		console.log("Usuario id: "+jsonResponse._id+"\n");
	    	}
	    	else{
	    		console.log("El usuario no se pudo registrar \n");
	    		crearUsuario5(nombre,email,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function crearUsuario5(nombre,email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("5. Intentar crear el usuario "+nombre+" con email indefinido y con clave "+password+"");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body)
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" creado correctamente \n");
	    		console.log("Usuario id: "+jsonResponse._id+"\n");
	    	}
	    	else{
	    		console.log("El usuario no se pudo registrar \n");
	    		crearUsuario6(nombre,email,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function crearUsuario6(nombre,email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,email:email}
	}

	console.log("--------------------------------------------------------");
	console.log("6. Intentar crear el usuario "+nombre+" con email "+email+" y con clave indefinida");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body)
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" creado correctamente \n");
	    		console.log("Usuario id: "+jsonResponse._id+"\n");
	    	}
	    	else{
	    		console.log("El usuario no se pudo registrar \n");
	    		crearUsuario7(nombre,email,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}



function crearUsuario7(nombre,email,password){
	var options={
		url:url+'signup',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,email:email,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("7. Intentar crear el usuario "+nombre+" con email "+email+" y con clave "+password+"");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body)
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
		url:url+'confirmarUsuario/'+nombre+'NoExiste/'+key,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("8. Se confirma el usuario con un nombre que no existe");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log("Usuario "+nombre+" no es confirmado \n");
			confirmarUsuario2(id,key,nombre,password);
		}
		else{
			console.log("El usuario "+nombre+" no se ha podido confirmar \n");
		}
	});
}


function confirmarUsuario2(id,key,nombre,password){
	var options={
		url:url+'confirmarUsuario/'+nombre+'/'+key+'NoExiste',
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("9. Se confirma el usuario con una key que no existe");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log("Usuario "+nombre+" no es confirmado \n");
			iniciarSesion(id,key,nombre,password);
		}
		else{
			console.log("El usuario "+nombre+" no se ha podido confirmar \n");
		}
	});
}

function iniciarSesion(id,key,nombre,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("10. El usuario: "+nombre+" intenta iniciar sesión antes de ser confimado correctamente");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo iniciar la sesión \n");
	    		confirmarUsuario3(id,key,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}



function confirmarUsuario3(id,key,nombre,password){
	var options={
		url:url+'confirmarUsuario/'+nombre+'/'+key,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("11. Se confirma el usuario "+nombre+" para poder actualizarlo y eliminarlo");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			console.log("Usuario "+nombre+" confirmado \n");
			comprobarUsuario(id,nombre,password);
		}
		else{
			console.log("El usuario "+nombre+" nose ha podido confirmar \n");
		}
	});
}

function comprobarUsuario(id,nombre,password){
	var options={
		url:url+'comprobarUsuario/1837100cadc63c1ae8d6f0b2',
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("12. Se comprueba que el usuario Pepe con email pepe@pepe.es está confirmado con un id que no existe");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
			if(jsonResponse.nivel<0){
				console.log("Usuario "+nombre+" con id 1837100cadc63c1ae8d6f0b2 no confirmado. El id real es:"+id+" \n");
				actualizarUsuario(id,nombre,password);
			} else {
				console.log("Usuario "+jsonResponse.nombre+" confirmado correctamente. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");	
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
		form:{id:'1837100cadc63c1ae8d6f0b2',nombre:nombre+'Actualizado',passwordOld:password,passwordNew:password+'Actualizada'}
	}

	console.log("--------------------------------------------------------");
	console.log("13. Se intenta actualizar el usuario con un id que no existe");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" se ha actualizado \n");
	    	}
	    	else{
	    		console.log("El usuario con id 1837100cadc63c1ae8d6f0b2 no pudo ser actualizado \n");
	    		console.log("El id real de "+nombre+" es: "+id+"\n");
	    		actualizarUsuario2(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario2(id,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:'',nombre:nombre+'Actualizado',passwordOld:password,passwordNew:password+'Actualizada'}
	}

	console.log("--------------------------------------------------------");
	console.log("14. Se intenta actualizar el usuario: "+nombre+" con un id en blanco");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		actualizarUsuario3(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario3(id,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,nombre:'',passwordOld:password,passwordNew:password}
	}

	console.log("--------------------------------------------------------");
	console.log("15. El usuario: "+nombre+" actualiza el nombre en blanco");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		actualizarUsuario4(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario4(id,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,nombre:nombre,passwordOld:'',passwordNew:password}
	}

	console.log("--------------------------------------------------------");
	console.log("16. El usuario: "+nombre+" actualiza la password actual en blanco");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		actualizarUsuario5(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario5(id,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,nombre:nombre,passwordOld:password,passwordNew:''}
	}

	console.log("--------------------------------------------------------");
	console.log("17. El usuario: "+nombre+" actualiza la password nueva en blanco");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		actualizarUsuario6(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario6(id,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{nombre:nombre+'Actualizado',passwordOld:password,passwordNew:password+'Actualizada'}
	}

	console.log("--------------------------------------------------------");
	console.log("18. Se intenta actualizar el usuario: "+nombre+" con un id indefinido");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		actualizarUsuario7(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario7(id,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,passwordOld:password,passwordNew:password}
	}

	console.log("--------------------------------------------------------");
	console.log("19. El usuario: "+nombre+" actualiza el nombre indefinido");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		actualizarUsuario8(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario8(id,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,nombre:nombre,passwordNew:password}
	}

	console.log("--------------------------------------------------------");
	console.log("20. El usuario: "+nombre+" actualiza la password actual indefinida");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		actualizarUsuario9(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function actualizarUsuario9(id,nombre,password){
	var options={
		url:url+'actualizarUsuario',
		method:'POST',
		headers:headers,
		form:{id:id,nombre:nombre,passwordOld:password}
	}

	console.log("--------------------------------------------------------");
	console.log("21. El usuario: "+nombre+" actualiza la password nueva indefinida");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha actualizado su nombre \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" no pudo ser actualizado \n");
	    		pedirNivel(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function pedirNivel(id,nombre,password){
	var options={
		url:url+'pedirNivel/1837100cadc63c1ae8d6f0b2',
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("22. Se pide el nivel para el usuario: "+nombre+" con un id que no existe");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nivel<0){
	    		console.log("Nivel no encontrado para el usuario "+nombre+" con id 1837100cadc63c1ae8d6f0b2 \n");
	    		console.log("El id real de "+nombre+" es: "+id+"\n");
	    		comprobarUsuario2(id,nombre,password);
	    	}
	    	else{
	    		console.log("Nivel para el usuario "+nombre+": \n");
	    		console.log(jsonResponse);
	    	}
		}
		else{
			console.log(response.statusCode);
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
	console.log("23. Se comprueba el nivel==0 y los intentos==0 del usuario "+nombre);
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
			if(jsonResponse.nivel<0){
				console.log("Usuario "+nombre+" no confirmado \n");
			} else if (jsonResponse.nivel==0 && jsonResponse.intentos==0) {
				console.log("Usuario "+jsonResponse.nombre+" confirmado correctamente. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");	
				sumarIntento(id,nombre,password);
			} else {
				console.log("El nivel y los intentos de "+jsonResponse.nombre+" no son correctos. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");
			}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function sumarIntento(id,nombre,password){
	var options={
		url:url+'sumarIntento/1837100cadc63c1ae8d6f0b2',
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("24. Se suma un intento a "+nombre+" con un id que no existe");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.intentos<0){
	    		console.log("No se a podido sumar un intento a "+nombre+" con id: 1837100cadc63c1ae8d6f0b2 \n");
	    		console.log("El id real de "+nombre+" es: "+id+"\n");
	    		comprobarUsuario3(id,nombre,password);
	    	}
	    	else{
	    		console.log("Intento sumado correctamente a "+nombre+" con "+jsonResponse.intentos+" intentos \n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function comprobarUsuario3(id,nombre,password){
	var options={
		url:url+'comprobarUsuario/'+id,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("25. Se comprueba el nivel==0 y los intentos==0 del usuario "+nombre+". No se han sumado intentos");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
			if(jsonResponse.nivel<0){
				console.log("Usuario "+nombre+" no confirmado \n");
			} else if (jsonResponse.nivel==0 && jsonResponse.intentos==0) {
				console.log("Usuario "+jsonResponse.nombre+" confirmado correctamente. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");	
				nivelCompletado(id,nombre,password,10,3,100);
			} else {
				console.log("El nivel y los intentos de "+jsonResponse.nombre+" no son correctos. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");
			}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function nivelCompletado(id,nombre,password,tiempo,vidas,score){
	var options={
		url:url+'nivelCompletado/1837100cadc63c1ae8d6f0b2/'+tiempo+'/'+vidas+'/'+score,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("26. Se completa el nivel para "+nombre+" con "+tiempo+" segundos, "+vidas+" vidas y "+score+" de score con un id que no existe");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nivel<0){
	    		console.log("No se a podido completar el nivel para "+nombre+" con id: 1837100cadc63c1ae8d6f0b2\n");
	    		console.log("El id real de "+nombre+" es: "+id+"\n");
	    		comprobarUsuario4(id,nombre,password);
	    	}
	    	else{
	    		console.log("Nivel completado correctamente para "+jsonResponse.nombre+" \n");
	    		console.log("Nivel actual: "+jsonResponse.nivel+" / Intentos actuales: "+jsonResponse.intentos+"\n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function comprobarUsuario4(id,nombre,password){
	var options={
		url:url+'comprobarUsuario/'+id,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("27. Se comprueba el nivel==0 y los intentos==0 del usuario "+nombre+". No se han sumado niveles");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
			if(jsonResponse.nivel<0){
				console.log("Usuario "+nombre+" no confirmado \n");
			} else if (jsonResponse.nivel==0 && jsonResponse.intentos==0) {
				console.log("Usuario "+jsonResponse.nombre+" confirmado correctamente. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");	
				nivelCompletado(id,nombre,password,10,3);
			} else {
				console.log("El nivel y los intentos de "+jsonResponse.nombre+" no son correctos. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");
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
	console.log("28. Se completa el nivel para "+nombre+" con "+tiempo+" segundos, "+vidas+" vidas y "+score+" de score");
	console.log("--------------------------------------------------------");

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
		url:url+'resetNiveles/1837100cadc63c1ae8d6f0b2',
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("29. Se resetea el nivel para "+nombre+" con un id que no existe");
	console.log("--------------------------------------------------------");

	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nivel<0){
	    		console.log("No se a podido resetear el nivel para "+nombre+" con id: 1837100cadc63c1ae8d6f0b2 \n");
	    		console.log("El id real de "+nombre+" es: "+id+"\n");
	    		comprobarUsuario5(id,nombre,password);
	    	}
	    	else{
	    		console.log("Nivel reseteado correctamente para "+nombre+" \n");
	    		console.log("Nivel actual: "+jsonResponse.nivel+" / Intentos actuales: "+jsonResponse.intentos+"\n");
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function comprobarUsuario5(id,nombre,password){
	var options={
		url:url+'comprobarUsuario/'+id,
		method:'GET',
		headers:headers
	}

	console.log("--------------------------------------------------------");
	console.log("30. Se comprueba el nivel==1 y los intentos==0 del usuario "+nombre+". No se han reseteado niveles");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
			if(jsonResponse.nivel<0){
				console.log("Usuario "+nombre+" no confirmado \n");
			} else if (jsonResponse.nivel==1 && jsonResponse.intentos==0) {
				console.log("Usuario "+jsonResponse.nombre+" confirmado correctamente. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");	
				iniciarSesion2(id,nombre,password);
			} else {
				console.log("El nivel y los intentos de "+jsonResponse.nombre+" no son correctos. Nivel "+jsonResponse.nivel+" con "+jsonResponse.intentos+" intentos \n");
			}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function iniciarSesion2(id,nombre,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{nombre:'',password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("31. El usuario: "+nombre+" intenta iniciar sesión con el nombre en blanco");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo iniciar la sesión \n");
	    		iniciarSesion3(id,nombre,password)
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function iniciarSesion3(id,nombre,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,password:''}
	}

	console.log("--------------------------------------------------------");
	console.log("32. El usuario: "+nombre+" intenta iniciar sesión con el password en blanco");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo iniciar la sesión \n");
	    		iniciarSesion4(id,nombre,password)
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function iniciarSesion4(id,nombre,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("33. El usuario: "+nombre+" intenta iniciar sesión con el nombre indefinido");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo iniciar la sesión \n");
	    		iniciarSesion5(id,nombre,password)
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function iniciarSesion5(id,nombre,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{nombre:nombre}
	}

	console.log("--------------------------------------------------------");
	console.log("34. El usuario: "+nombre+" intenta iniciar sesión con el password indefinido");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo iniciar la sesión \n");
	    		recordar(id,nombre,password)
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
		form:{nombre:''}
	}

	console.log("--------------------------------------------------------");
	console.log("35. El usuario: "+nombre+" intenta recordar su contraseña con el nombre en blanco.");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse._id!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha recordado su contraseña \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo recordar su contraseña \n");
	    		recordar2(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function recordar2(id,nombre,password){
	var options={
		url:url+'recordar',
		method:'POST',
		headers:headers,
		form:{}
	}

	console.log("--------------------------------------------------------");
	console.log("36. El usuario: "+nombre+" intenta recordar su contraseña con el nombre indefinido.");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse._id!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha recordado su contraseña \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo recordar su contraseña \n");
	    		iniciarSesion6(id,nombre,password);
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function iniciarSesion6(id,nombre,password){
	var options={
		url:url+'login',
		method:'POST',
		headers:headers,
		form:{nombre:nombre,password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("37. El usuario: "+nombre+" intenta iniciar sesión con su primer password. El password no se ha recordado");
	console.log("--------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.nombre!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" ha iniciado la sesión \n");
	    		salir(id,nombre,password);
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
		url:url+'salir/1837100cadc63c1ae8d6f0b2',
		method:'GET',
		headers:headers
	}
	console.log("--------------------------------------------------------");
	console.log("38. El usuario: "+nombre+" sale con un id que no existe.");
	console.log("-------------------------------------------------------");
	
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse(body) ;
    		if (jsonResponse._id!=undefined){
	    		console.log("Usuario "+jsonResponse.nombre+" se ha deslogueado \n");
	    	}
	    	else{
	    		console.log("El usuario "+nombre+" NO pudo desloguearse \n");
	    		eliminarUsuario(id,nombre,password)
	    	}
		}
		else{
			console.log(response.statusCode);
		}
	});
}

function eliminarUsuario(id,nombre,password){
	var options={
		url:url+'eliminarUsuario/1837100cadc63c1ae8d6f0b2',
		method:'DELETE',
		headers:headers,
		form:{password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("39. Se intenta eliminar el usuario con un id que no existe");
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.resultados==1){
	    		console.log("Usuario "+id+" eliminado \n");
	    	}
	    	else{
	    		console.log("El usuario no existe \n");
	    		eliminarUsuario2(id,nombre,password);
	    	}
		}
		else{
			console.log("Eliminar: Error al conectar");
		}
	});
}

function eliminarUsuario2(id,nombre,password){
	var options={
		url:url+'eliminarUsuario/'+id,
		method:'DELETE',
		headers:headers,
		form:{password:password}
	}

	console.log("--------------------------------------------------------");
	console.log("40. Se elimina el usuario "+nombre);
	console.log("--------------------------------------------------------");
	request(options,function(error,response,body){
		if (!error && response.statusCode==200){
			var jsonResponse = JSON.parse( body) ;
    		if (jsonResponse.resultados==1){
	    		console.log("Usuario "+id+" eliminado \n");
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

crearUsuario('Pepe','pepe@pepe.com','pepe');