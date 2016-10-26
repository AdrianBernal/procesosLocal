//Funciones que modifican el index
//var url="http://127.0.0.1:1338/";
var url=window.location.href;
var game;

function inicio(){
	if ($.cookie("nombre")!=undefined) {
		comprobarUsuario();
	} else {
		mostrarCabecera();
	}
}

function borrarControl(){
	$('#control').remove();
}

function mostrarCabecera(){
	$('#control').empty();
	/*$('#cabecera').remove();
	$('#enh').remove();
	$('#datos').remove();
	$('#siguienteBtn').remove();*/
	$('#control').append('<div id="cabecera"><h2>Nombre jugador</h2><p><input type="text" id="nombreInput" placeholder="introduce tu nombre"></p>');
	botonNombre();
}

function botonNombre(){
	var nombre="";
	$('#cabecera').append('<p><button type="button" id="nombreBtn" class="btn btn-primary btn-lg"><b>Crear nueva partida</b></button></p>');
	$('#nombreBtn').on('click',function(){
		var nombre=$('#nombreInput').val();
		$('#nombreBtn').remove();
		$('#nombreInput').remove();
		//To-Do: Controlar si ha metido el nombre
		crearUsuario(nombre);
	})
}

function mostrarInfoJugador(){
	var nombre=$.cookie('nombre');
	var id=$.cookie('id');
	var nivel=$.cookie('nivel');
	var percen=Math.floor((nivel/3)*100);
	$('#control').empty();
	$('#control').append('<div id="cabecera"><h2>Panel</h2></div>')
	$('#control').append('<div id="datos"><h4> ID:'+id+'<br>Nombre: '+nombre+'<br>Nivel: '+nivel+'</h4></div>');
	$('#control').append('<div class="progress" id="prog"><div class="progress-bar" aria-valuemin="0" aria-valuemax="100" style="width:'+percen+'%">'+percen+'%</div></div>');
	siguienteNivel();
}

function siguienteNivel(){
		var nivel=$.cookie('nivel');
		if (nivel==0) { 
			$('#siguienteBtn').remove();
			$('#enh').remove();
			$('#res').remove();
	  		$('#resultados').remove();
			crearNivel($.cookie('nivel'));
		} else {
			$('#control').append('<button type="button" id="siguienteBtn" class="btn btn-primary btn-lg">Siguiente Nivel</button>');
			$('#siguienteBtn').on('click',function(){
				$('#siguienteBtn').remove();
				$('#enh').remove();
				$('#res').remove();
	  			$('#resultados').remove();
				crearNivel($.cookie('nivel'));
			});
		}
}

function noHayNiveles(){
	$('#juegoId').append("<h2 id='enh'>Lo siento, no tenemos más niveles</h2>");
	$('#control').append('<button type="button" id="siguienteBtn" class="btn btn-primary btn-md">Volver a empezar</button>')
	$('#siguienteBtn').on('click',function(){
		$('#siguienteBtn').remove();
			reset();
	});
}

function nivelCompletado(tiempo){
	//borrarJuego();
	//game.state.clearCurrentState();
	//shutdown();
	$('#juegoId').append("<h2 id='enh'>Enhorabuena!</h2>");
	comunicarNivelCompletado(tiempo);
	obtenerResultados();
}

function mostrarResultados(datos){
  //eliminarGame();
  //eliminarCabeceras();
  borrarJuego();
  $('#juegoId').empty();
  $('#juegoId').append('<h3 id="res">Resultados</h3>');
  var cadena="<table id='resultados' class='table table-bordered table-condensed'><tr><th>Nombre</th><th>Nivel</th><th>Tiempo</th></tr>";
    for(var i=0;i<datos.length;i++){
      cadena=cadena+"<tr><td>"+datos[i].nombre+"</td><td> "+datos[i].nivel+"</td>"+"</td><td> "+datos[i].tiempo+"</td></tr>";      
    }
    cadena=cadena+"</table>";
    $('#juegoId').append(cadena);
}

function reset(){
	borrarJuego();
	borrarCookies();
	mostrarCabecera();
	//borrarJuego;
	//inicio();
}

function borrarCookies(){
	$.removeCookie("nombre");
	$.removeCookie("id");
	$.removeCookie("nivel");
}

function borrarJuego(){
	if (game!=undefined){
		game.destroy();
		game=undefined;
	}
	$('#juegoId').empty();
}

function resultados(){
	$('#control').empty();
	$('#control').append('<div id="cabecera"><h3>Resultados</h3><table id="resultados" class="table table-bordered table-condensed"><tbody><tr><th>Nombre</th><th>Nivel</th><th>Tiempo</th></tr></tbody></table>');

}

function borrarCookies(){
	$.removeCookie('nombre');
	$.removeCookie('id');
	$.removeCookie('nivel');
}

//Funciones de comunicación con el servidor

function crearUsuario(nombre){
	if (nombre==""){
		nombre="jugador";
	}
	$.getJSON(url+"crearUsuario/"+nombre,function(datos){
		//To-Do: datos tiene la respuesta del servidor
		//mostrar los datos del usuario
		$.cookie('nombre',datos.nombre);
		$.cookie('id',datos.id);
		$.cookie('nivel',datos.nivel);
		mostrarInfoJugador();
	});
}

function comprobarUsuario(){
	var id=$.cookie('id');
	//Comprobar id
	$.getJSON(url+'comprobarUsuario/'+id,function(datos){
		if(datos.nivel<0){
			//borrar Cookies
			borrarCookies();
			mostrarCabecera();
		} else {
			$.cookie('nivel',datos.nivel);
			mostrarInfoJugador();
		}
	});
}

function comunicarNivelCompletado(tiempo){
	var id=$.cookie("id");

	$.getJSON(url+'nivelCompletado/'+id+"/"+tiempo,function(datos){
			$.cookie("nivel",datos.nivel);
			mostrarInfoJugador();
	});	
}

function obtenerResultados(){
	//var id=$.cookie("id");
	//$.getJSON(url+'obtenerResultados/'+id,function(datos){
	$.getJSON(url+'obtenerResultados/',function(datos){
			//$.cookie("nivel",datos.nivel);
			mostrarResultados(datos);
	});
}