var modelo=require('./modelo.js');

describe("El juego niveles inicialmente...", function() {
	var juego;
  var nombre="PruebaJasmine";
  var email="prueba@jasmine.es";
  var password="jasmine";


	beforeEach(function(){
    var fm=new modelo.JuegoFM("./servidor/tilemaps");
    juego=fm.makeJuego();
    waitsFor(function() {
        return modelo.persistencia.usuariosCol !== undefined && modelo.persistencia.resultadosCol !== undefined;
    }, 'should return a colection that is not undefined', 3000);
	});

  afterEach(function(){
    waitsFor(function() {
        return modelo.persistencia.usuariosCol.remove({nombre:nombre}) && modelo.persistencia.usuariosCol.remove({nombre:nombre+"Actualizado"}) && modelo.persistencia.resultadosCol.remove({nombre:nombre}) && modelo.persistencia.resultadosCol.remove({nombre:nombre+"Actualizado"});
    }, 'should return a colection that is not undefined', 3000);
  });

	it("tiene una colección de niveles agregarNivel(nivel), una usuarios registrados, una de usuarios conectados y una de resultados", function() {
		expect(juego.niveles.length).toEqual(4);
		expect(juego.usuariosRegistrados.length).toEqual(0);
    expect(juego.usuariosConectados.length).toEqual(0);
    expect(juego.resultados.length).toEqual(0);
  });

  it("crear usuario", function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      expect(juego.usuariosRegistrados[0].nombre).toEqual(nombre);    
      expect(juego.usuariosRegistrados[0].email).toEqual(email);
      expect(juego.usuariosRegistrados[0].password).toEqual(password);
      done();
    });

  });

  it("comprobar obtenerUsuarioPorId(usuario existente)",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      var id=usuarioInsertado._id;
      var usu=juego.obtenerUsuarioPorId(id);
      expect(usu._id).toEqual(id);
      done();
    });
  });

  it("comprobar obtenerUsuarioPorId(usuario no existente",function(){
    var id=00001;
    var usuario=juego.obtenerUsuarioPorId(id);
    expect(usuario).toBeUndefined();
  });

  it("comprobar obtenerUsuarioPorNombre(usuario existente)",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      var nombre=usuarioInsertado.nombre;
      var usu=juego.obtenerUsuarioPorNombre(nombre);
      expect(usu.nombre).toEqual(nombre);
      done();
    });
  });

  it("comprobar obtenerUsuarioPorNombre(usuario no existente",function(){
    var usuario=juego.obtenerUsuarioPorNombre(nombre+"NoExiste");
    expect(usuario).toBeUndefined();
  });

  it("comprobar bajaUsuario(usuario existente)",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      juego.bajaUsuario(usuarioInsertado,function(usuarioEliminado){
        expect(usuarioEliminado).toEqual(usuarioInsertado);
        //Depende de si hay más usuarios registrados
        //expect(juego.usuariosRegistrados.length).toEqual(0);
        var usuario=juego.obtenerUsuarioPorId(usuarioEliminado._id);
        expect(usuario).toBeUndefined();
        usuario=juego.obtenerUsuarioPorNombre(usuarioEliminado.nombre);
        expect(usuario).toBeUndefined();
        done();
      });
    });  
  });

  it("comprobar bajaUsuario(usuario no existente)",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      juego.bajaUsuario(new modelo.Usuario(nombre+"NoExiste",email+"NoExiste",password+"NoExiste"),function(usuarioEliminado){
        expect(usuarioEliminado).toBeUndefined();
        expect(juego.usuariosRegistrados.length).toEqual(1);
        done();
      });
    });
  });

  it("comprobar agregarUsuario(usuario existente)",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      juego.agregarUsuario(usuarioInsertado);
      expect(juego.usuariosConectados.length).toEqual(1);
      expect(juego.usuariosConectados[0]).toEqual(usuarioInsertado);
      done();
    });
  });

  xit("comprobar agregarUsuario(usuario no existente)");

  it("comprobar eliminarUsuario(usuario existente)",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      juego.agregarUsuario(usuarioInsertado);
      juego.eliminarUsuario(usuarioInsertado);
      expect(juego.usuariosConectados.length).toEqual(0);
      done();
    });
  });

  it("comprobar eliminarUsuario(usuario no existente)",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      juego.agregarUsuario(usuarioInsertado);
      juego.eliminarUsuario(new modelo.Usuario(nombre+"NoExiste",email+"NoExiste",password+"NoExiste"));
      expect(juego.usuariosConectados.length).toEqual(1);
      done();
    });
  });

  it("comprobar agregar resultado",function(done){
    juego.agregarResultado(new modelo.Resultado(nombre,0,11,3,2,1),function(resultadoInsertado){
      expect(juego.resultados.length).toEqual(1);
      expect(juego.resultados[0].nombre).toEqual(nombre);
      expect(juego.resultados[0].nivel).toEqual(0);
      expect(juego.resultados[0].tiempo).toEqual(11);
      expect(juego.resultados[0].vidas).toEqual(3);
      expect(juego.resultados[0].intentos).toEqual(2);
      expect(juego.resultados[0].score).toEqual(1);
      done();
    });
  });

  it("comprobar obtenerResultadosPorNombre(usuario existente)",function(done){
    juego.agregarResultado(new modelo.Resultado(nombre,0,11,3,2,1),function(resultadoInsertado){
      var resultados=juego.obtenerResultadosPorNombre(nombre);
      expect(resultados.length).toEqual(1);
      expect(resultados[0].nombre).toEqual(nombre);
      expect(resultados[0].nivel).toEqual(0);
      expect(resultados[0].tiempo).toEqual(11);
      expect(resultados[0].vidas).toEqual(3);
      expect(resultados[0].intentos).toEqual(2);
      expect(juego.resultados[0].score).toEqual(1);
      done();
    });
  });

  it("comprobar obtenerResultadosPorNombre(usuario no existente)",function(done){
    juego.agregarResultado(new modelo.Resultado(nombre,0,11,3,2,1),function(resultadoInsertado){
      var resultados=juego.obtenerResultadosPorNombre(nombre+"NoExiste");
      expect(resultados.length).toEqual(0);
      done();
    });
  });

  it("comprobar Usuario.parse()",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      var usuarioAux=new modelo.Usuario().parse(usuarioInsertado);
      expect(usuarioInsertado._id).toEqual(usuarioAux._id);
      expect(usuarioInsertado.key).toEqual(usuarioAux.key);
      expect(usuarioInsertado.nombre).toEqual(usuarioAux.nombre);
      expect(usuarioInsertado.nivel).toEqual(usuarioAux.nivel);
      expect(usuarioInsertado.intentos).toEqual(usuarioAux.intentos);
      expect(usuarioInsertado.email).toEqual(usuarioAux.email);
      expect(usuarioInsertado.password).toEqual(usuarioAux.password);
      expect(usuarioInsertado.activado).toEqual(usuarioAux.activado);
      done();
    });
  });
  
  it("comprobar Usuario.activar()",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      usuarioInsertado.activar(usuarioInsertado.key);
        expect(usuarioInsertado.activado).toBe(true);
        done();
    });
  });

  it("comprobar Usuario.sumarIntento()",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      usuarioInsertado.sumarIntento();
      expect(usuarioInsertado.intentos).toEqual(1);
      done();
    });
  });

  it("comprobar Usuario.nivelCompletado()",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      usuarioInsertado.sumarIntento();
      usuarioInsertado.nivelCompletado();
      expect(usuarioInsertado.nivel).toEqual(1);
      expect(usuarioInsertado.intentos).toEqual(0);
      done();
    });
  });

  it("comprobar Usuario.resetNiveles()",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      usuarioInsertado.nivelCompletado();
      usuarioInsertado.sumarIntento();
      usuarioInsertado.resetNiveles();
      expect(usuarioInsertado.nivel).toEqual(0);
      expect(usuarioInsertado.intentos).toEqual(0);
      done();
    });
  });

  it("comprobar Usuario.actualizar()",function(done){
    juego.nuevoUsuario(new modelo.Usuario(nombre,email,password),function(usuarioInsertado){
      usuarioInsertado.actualizar(nombre+"Actualizado",password+"Actualizado");
      expect(usuarioInsertado.nombre).toEqual(nombre+"Actualizado");
      expect(usuarioInsertado.password).toEqual(password+"Actualizado");
      done();
    });
  });

  it("comprobar Resultado.parse()",function(done){
    juego.agregarResultado(new modelo.Resultado(nombre,0,11,3,2,1),function(resultadoInsertado){
      var resultadoAux=new modelo.Resultado().parse(resultadoInsertado);
      expect(resultadoAux.nombre).toEqual(resultadoInsertado.nombre);
      expect(resultadoAux.nivel).toEqual(resultadoInsertado.nivel);
      expect(resultadoAux.tiempo).toEqual(resultadoInsertado.tiempo);
      expect(resultadoAux.vidas).toEqual(resultadoInsertado.vidas);
      expect(resultadoAux.intentos).toEqual(resultadoInsertado.intentos);
      expect(resultadoAux.score).toEqual(resultadoInsertado.score);
      done();
    });
  });

  it("comprobar Resultado.actualizar()",function(done){
    juego.agregarResultado(new modelo.Resultado(nombre,0,11,3,2,1),function(resultadoInsertado){
      resultadoInsertado.actualizar(nombre+"Actualizado");
      expect(resultadoInsertado.nombre).toEqual(nombre+"Actualizado");
      done();
    });
  });
});