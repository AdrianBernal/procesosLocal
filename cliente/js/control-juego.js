//Funciones que modifican el index
var game;
var usuariosConectados=[];
var socket=undefined;

//var url="http://procesos.herokuapp.com/";
var url="http://192.168.1.15:5000/";
//var url="http://127.0.0.1:5000/";

$('.toggle-sidebar').click(function(){
 $('body').toggleClass('sidebar-open');
 return false;
});

window.onload = function(e){
	comprobarUsuario();
};

window.onbeforeunload = function(e){
	comunicarSalir();
	borrarJuego(false);
	if ($.cookie('recordar')!="true") {
		borrarCookies();
	}
}

function inicio(){
	if ($.cookie('id')!=undefined) {
		mostrarInfoJugador();
	} else {
		mostrarLogin();
	}
	
}

function mostrarEstructura(callback){
	$('#content').load('../html/estructura.html',function(){
		$('#background').removeClass();
		if (callback) callback();
	});
}

function mostrarInfoJugador(){
	var nombre=$.cookie('nombre');
	var id=$.cookie('id');
	var nivel=$.cookie('nivel');
	var intentos=$.cookie('intentos');
	var percen=Math.floor((nivel/maxNiveles)*100);
	$('#control').load('../html/infoJugador.html', function(){
		$('#nombreText').text('Nombre: '+nombre);
		$('#nivelText').text('Nivel: '+nivel);
		$('#intentosText').text('Intentos: '+intentos);
		$('#percenText').text(percen+'%');
		$('#percenText').width(percen+'%');

		$('#siguienteBtn').on('click',function(){
			pedirNivel();
		});

		$('#volverEmpezarBtn').on('click',function(){
			resetNiveles();
		});

		$('#reiniciarBtn').on('click',function(){
			if (borrarJuego(false)){
				pedirNivel();
			}
		});
		comprobarNivel();
		obtenerUsuariosConectados();
	});
	
}

function comprobarNivel(){
		var nivel=$.cookie('nivel');
		if (nivel<0 || nivel>=maxNiveles) {
			$('#mensajes').append("<h2 id='enh'>Lo siento, no tenemos más niveles</h2>");
			$('#volverEmpezarBtn').removeClass('hidden');
		} else if (game==undefined){
			$('#siguienteBtn').removeClass('hidden');
		}
}

function reiniciarNivel(){
	$('#reiniciarBtn').removeClass('hidden');
};

function nivelCompletado(tiempo, vidas, score){
	$('#mensajes').append("<h2 id='enh'>¡Enhorabuena!</h2>");
	$('#siguienteBtn').removeClass('hidden');
	comunicarNivelCompletado(tiempo, vidas, score);
}

function mostrarResultados(datos,confirmar){
  	if (borrarJuego(confirmar)) {
	  	//$('#juegoId').append('');
	  	//$('#juegoId').append('<table id="resultados" class="resultados" width="100%"></table><table id="misLogros" class="resultados" width="100%"></table><table id="mejores" class="resultados" width="100%"></table>');
		mostrarInfoJugador();
		$('#juegoId').load('../html/resultados.html', function(){ 	
		   	$('#todosTabla').DataTable({
		        data: datos,
		        columns: [
		            { data: "nombre", title: "Nombre" },
		            { data: "nivel", title: "Nivel" },
		            { data: "score", title: "Score" },
		            { data: "tiempo", title: "Tiempo" },
		            { data: "intentos", title: "Intentos" },
		            { data: "vidas", title: "Vidas" }
		        ],
		        order: [[1,'desc'],[2,'desc'],[3,'asc'],[4,'asc'],[5,'desc'],[0,'asc']]
		    });
		    $('#mislogrosTabla').DataTable({
		        data: obtenerMisLogros(datos),
		        columns: [
		            { data: "nombre", title: "Nombre" },
		            { data: "nivel", title: "Nivel" },
		            { data: "score", title: "Score" },
		            { data: "tiempo", title: "Tiempo" },
		            { data: "intentos", title: "Intentos" },
		            { data: "vidas", title: "Vidas" }
		        ],
		        order: [[1,'desc'],[2,'desc'],[3,'asc'],[4,'asc'],[5,'desc'],[0,'asc']]
		    });
		    $('#losmejoresTabla').DataTable({
		        data: obtenerLosMejores(datos),
		        columns: [
		            { data: "nombre", title: "Nombre" },
		            { data: "nivel", title: "Nivel" },
		            { data: "score", title: "Score" },
		            { data: "tiempo", title: "Tiempo" },
		            { data: "intentos", title: "Intentos" },
		            { data: "vidas", title: "Vidas" }
		        ],
		        order: [[1,'desc'],[2,'desc'],[3,'asc'],[4,'asc'],[5,'desc'],[0,'asc']]
		    });
		    $('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e) {
	        	$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
	    	} );
	   	});
   	}
}

function obtenerMisLogros(datos){
	return $.grep(datos, function(elem, index){
		return elem.nombre==$.cookie("nombre");
	});
}

function obtenerLosMejores(data){
	var resultados=[];
	for (i=0;i<maxNiveles;i++){
		var resultadosAux=$.grep(data,function(elem,index){
			return elem.nivel==i;
		});
		if (resultadosAux.length>0) {
			var resultado=resultadosAux.reduce(function(mejor,siguiente,index,array){
				if ((mejor.score<siguiente.score) ||  (mejor.score==siguiente.score && mejor.tiempo>siguiente.tiempo) || (mejor.score==siguiente.score && mejor.tiemp==siguiente.tiempo && mejor.intentos>siguiente.intentos) || (mejor.score==siguiente.score && mejor.tiemp==siguiente.tiempo && mejor.intentos==siguiente.intentos && mejor.vidas<siguiente.vidas)) {
					return siguiente;
				}
				return mejor;
			});
			resultados.push(resultado);
		}
	}
	return resultados;

}

function mostrarUsuariosConectados(datos){
	if ( $.fn.dataTable.isDataTable( '#usuariosConectados' ) ) {
    	table = $('#usuariosConectados').DataTable();
    	table.clear();
    	table.rows.add(datos);
    	table.draw();
	} else {
		$('#usuariosConectados').DataTable({
		    data: datos,
		    scrollY:        200,
	        scrollCollapse: true,
	        paging:         false,
	        bFilter: 		false,
		    columns: [
		        { data: "nombre", title: "Nombre" },
		        { data: "nivel", title: "Nivel" },
		        { data: "intentos", title: "Intentos" },
		    ],
		    order: [[1,'desc'],[2,'asc'],[0,'asc']]
		});
	}
}

function reset(){
	if (borrarJuego(true)){
		comunicarSalir();
		borrarCookies();
		$('#inicioTab').addClass('active');
		$('#resultadosTab').removeClass('active');
		$('#modificarTab').removeClass('active');
		mostrarLogin();
	}
}

function borrarCookies(){
	$.removeCookie("nombre");
	$.removeCookie("id");
	$.removeCookie("nivel");
	$.removeCookie("intentos");
	$.removeCookie("recordar");
}

function borrarJuego(confirmar){
	if (game!=undefined){
		if (confirmar){
			if (!confirm("¿Está seguro que desea terminar el intento?")){
				return false;
			}
		}
		game.destroy();
		game=undefined;
		$('#juegoId').empty();
	} else {
		$('#juegoId').empty();
	}
	comunicarNoJugandoSocket();
	return true;
}

function validarEmail( email ) {
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (expr.test(email)){
        return true;
    } else {
    	return false;
    }
}

function mostrarEmailEnviado(){
	if (borrarJuego(true)){
		$('#mensajes').append('<h3>Enhorabuena! Se ha registrado correctamente.</h3><h4>Se le ha enviado un email de confirmación.<br>Por favor, revise su buzón de correo.</h4>');
	}
}

function mostrarEmailRecordarEnviado(){
	if (borrarJuego(true)){
		$('#mensajes').append('<h4>Se le ha enviado un email con una contraseña autogenerada.<br>Por favor, revise su buzón de correo.</h4>');
	}
}

function mostrarLogin(){
	$('#background').addClass("blur");
	$('#content').load('../html/login.html',function(){
		$('#loginBtn').on('click',function(){
			var nombre=$('#nombreInput').val();
			var password=$('#passwordInput').val();
			if (comprobarInput()) {
				loginUsuario(nombre,password);
			}
		});
		$('#refRegistrar').on('click',function(){
			mostrarRegistro();
		});
		$('#recordar').on('click',function(){
			mostrarRecordar();
		});
		$("#passwordInput").keyup(function(event){
    		if(event.keyCode == 13){
    	    	$("#loginBtn").click();
    		}
		});
	});
}


function mostrarRegistro(){
	$('#content').load('../html/registro.html', function(){
		$('#registroBtn').on('click',function(){
			if (comprobarInput()) {
				var nombre=$('#nombreInput').val();
				var email=$('#emailInput').val();
				var password=$('#passwordInput').val();
				registroUsuario(nombre,email,password);
			}
		});
		$("#passwordRepetidoInput").keyup(function(event){
    		if(event.keyCode == 13){
    	    	$("#registroBtn").click();
    		}
		});
		$('#mostrarLogin').on('click',function(){
			mostrarLogin();
		});
	});
}

function mostrarRecordar(){
	$('#content').load('../html/recordar.html', function(){
		$('#recordarBtn').on('click',function(){
			if (comprobarInput()) {
				var nombre=$('#nombreInput').val();
				recordar(nombre);
			}
		});
		$("#nombreInput").keyup(function(event){
    		if(event.keyCode == 13){
    	    	$("#recordarBtn").click();
    		}
		});
		$('#mostrarLogin').on('click',function(){
			mostrarLogin();
		});
	});
}

function comprobarInput(){
	var nombre=$('#nombreInput').val();
	var email=$('#emailInput').val();
	var password=$('#passwordInput').val();
	var passwordRepetido=$('#passwordRepetidoInput').val();
	var passwordNew=$('#passwordNewInput').val();
	var passwordNewRepetido=$('#passwordNewRepetidoInput').val();
	var ok=true;
	if (nombre==='') {
		$('#errorNombreVacioText').removeClass('hidden');
		ok=false;
	} else {
		$('#errorNombreVacioText').addClass('hidden');
	}
	if (email==='') {
		$('#errorEmailVacioText').removeClass('hidden');
		ok=false;
	} else {
		$('#errorEmailVacioText').addClass('hidden');
		if (email!=undefined && !validarEmail(email)) {
			$('#errorEmailNoValidoText').removeClass('hidden');
			ok=false;
		} else {
			$('#errorEmailNoValidoText').addClass('hidden');
		}
	}
	if (password===''){
		$('#errorPasswordVacioText').removeClass('hidden');
		$('#errorPasswordRepetidoText').addClass('hidden');
		ok=false;
	} else {
		$('#errorPasswordVacioText').addClass('hidden');
		if (passwordRepetido!=undefined && password!=passwordRepetido){
			$('#errorPasswordRepetidoText').removeClass('hidden');
			ok=false;
		} else {
			$('#errorPasswordRepetidoText').addClass('hidden');
		}
	}

	$('#errorPasswordOldIncorrectaText').addClass('hidden');
	if (passwordNew!='' && passwordNew!=passwordNewRepetido) {
		$('#errorPasswordNewRepetidoText').removeClass('hidden');
		ok=false;
	} else {
		$('#errorPasswordNewRepetidoText').addClass('hidden');
	}
	return ok;
}

function modificarPerfil(){
	if ($.cookie('id')!=undefined) {
		$('#inicioTab').removeClass('active');
		$('#resultadosTab').removeClass('active');
		$('#modificarTab').addClass('active');
		$('#control').load('../html/actualizarUsuario.html',function(){
			$('#nombreInput').val($.cookie('nombre'));
			$('#actualizarBtn').on('click',function(){
				if (comprobarInput()) {
					var nombre=$('#nombreInput').val();
					var passwordOld=$('#passwordInput').val();
					var passwordNew=$('#passwordNewInput').val();
					if (passwordNew==''){passwordNew=passwordOld}
					actualizarUsuario(nombre,passwordOld,passwordNew);
				}
			});
			$('#eliminarBtn').on('click',function(){
				if (comprobarInput()) {
					if (confirm("¿Está seguro que desea eliminar el usuario?")){
						eliminarUsuario($.cookie('id'),$('#passwordInput').val());
					}
				}
			});
			$('#resetNivelesBtn').on('click',function(){
				resetNiveles();
			});
		});
	} else {
		mostrarLogin();
	}
}

function conectarSocket(){
	socket = io.connect(url, {
        forceNew: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 20000,
        timeout: 20000,
        reconnectionAttempts: Infinity
    });

    socket.on('updateDatos', function(usuario) {
    	obtenerUsuariosConectados();
    });
}

function comunicarNoJugandoSocket(){
	usuariosJugando=[];
	if (socket) socket.emit('nojugando', {nombre:$.cookie("nombre")});
}

function desconectarSocket(){
	if (socket) socket.io.disconnect();
}



//Funciones de comunicación con el servidor

function comprobarUsuario(){
	var id=$.cookie('id');
	if (id!=undefined){
		//Comprobar id
		$.getJSON('comprobarUsuario/'+id,function(datos){
			//if(datos.nivel<0){
			if(datos.nivel<0){
				//borrar Cookies
				borrarCookies();
				mostrarLogin();
			} else {
				$.cookie('nivel',datos.nivel);
				$.cookie('intentos',datos.intentos);
				conectarSocket();
				mostrarEstructura(mostrarInfoJugador);
				//mostrarInfoJugador();
			}
		});
	} else {
		mostrarLogin();
	}
}

function comunicarNivelCompletado(tiempo, vidas, score){
	var id=$.cookie("id");
	$.getJSON('nivelCompletado/'+id+"/"+tiempo+"/"+vidas+"/"+score,function(datos){
			$.cookie("nivel",datos.nivel);
			$.cookie("intentos",datos.intentos);
			obtenerResultados(false);
			mostrarInfoJugador();
	});	
}

function comunicarSalir(){
	desconectarSocket();
	var id=$.cookie("id");
	$.getJSON('salir/'+id);	
}

function sumarIntento(){
	var id=$.cookie("id");
	$.getJSON('sumarIntento/'+id,function(datos){
			$.cookie("intentos",datos.intentos);
			mostrarInfoJugador();
	});	
}


function resetNiveles(){
	//ToDo: Actualizar infor jugador bien, fallan intentos, y borrar juego.
	var id=$.cookie("id");
	$.getJSON('resetNiveles/'+id,function(datos){
			$.cookie("nivel",datos.nivel);
			mostrarInfoJugador();
	});	
}

function obtenerResultados(confirmar){
	if ($.cookie('id')!=undefined) {
		$('#inicioTab').removeClass('active');
		$('#resultadosTab').addClass('active');
		$('#modificarTab').removeClass('active');
		$.getJSON('obtenerResultados/',function(datos){
			mostrarResultados(datos,confirmar);
			//mostrarInfoJugador();
		});
	} else {
		mostrarLogin();
	}
}

function obtenerUsuariosConectados(){
	$.getJSON('obtenerUsuariosConectados/',function(datos){
		mostrarUsuariosConectados(datos);
	});
}

function loginUsuario(nombre, password){
	$.ajax({
		type:'POST',
		url:'/login',
		contentType:'application/json',
		dataType:'json',
		data:JSON.stringify({nombre:nombre, password:password}),
		success:function(data){
			if(data.nombre==undefined){
				$('#errorLoginText').removeClass('hidden');
			} else {
				$.cookie('recordar',$("#recordarme")[0].checked);
				$.cookie('nombre',data.nombre);
				$.cookie('id',data._id);
				$.cookie('nivel',data.nivel);
				$.cookie('intentos',data.intentos);
				conectarSocket();
				mostrarEstructura(mostrarInfoJugador);
				//mostrarInfoJugador();
			}
		}
	});
}

function registroUsuario(nombre, email, password){
	$.ajax({
		type:'POST',
		url:'/signup',
		data:JSON.stringify({nombre:nombre, email:email, password:password}),
		success:function(data){
			if (data.nombre==undefined){
				$('#errorNombreEnUsoText').removeClass('hidden');
			} else {
				mostrarLogin();
				mostrarEmailEnviado();
			}
		},
		contentType:'application/json',
		dataType:'json'
	});
}

function recordar(nombre){
	$.ajax({
		type:'POST',
		url:'/recordar',
		data:JSON.stringify({nombre:nombre}),
		success:function(data){
			if (data.nombre==undefined){
				$('#errorNombreNoRegistradoText').removeClass('hidden');
			} else {
				mostrarLogin();
				mostrarEmailRecordarEnviado();
			}
		},
		contentType:'application/json',
		dataType:'json'
	});
}

function eliminarUsuario(id,password){
	$.ajax({
		type:'DELETE',
		url:'/eliminarUsuario/'+id,
		data:JSON.stringify({password:password}),
		success:function(data){
			if (data.resultados<1){
				$('#errorPasswordOldIncorrectaText').removeClass('hidden');
			} else {
				reset();
			}
		},
		contentType:'application/json',
		dataType:'json'
	});
}

function actualizarUsuario(nombreText, passwordOldText, passwordNewText){
	$.ajax({
		type:'POST',
		url:'/actualizarUsuario',
		data:JSON.stringify({id:$.cookie('id'),nombre:nombreText, passwordOld:passwordOldText, passwordNew:passwordNewText}),
		success:function(data){
			if (data.nombre==undefined){
				$('#errorPasswordOldIncorrectaText').removeClass('hidden');
			} else {
				$.cookie('nombre',nombreText);
				mostrarInfoJugador();
			}
		},
		contentType:'application/json',
		dataType:'json'
	});
}

function pedirNivel(){
	var uid=$.cookie("id");
	if (uid!=undefined){
		$.getJSON("pedirNivel/"+uid,function(data){
			$('#siguienteBtn').addClass('hidden');
			$('#mensajes').empty();
			$('#juegoId').empty();
			sumarIntento();
			crearNivel(data);
		});
	}
}