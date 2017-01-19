
var player;
var playerX=32;
var playerY=150;
var platforms;
var platformsGris;
var cursors;
var cielo;

var bloques;
var pesos;
var objetoMata;
var objetoQuitaVida;
var coleccionable;
var decoracion;
var final;

var stars;
var meteoritos;
var meteoritosSalida;
var vidas;
var explosions;
var scoreText;
var endTest;
var timer;
var tiempo=0;
var tiempoText;
var shadow;
var offset = new Phaser.Point(10, 8);
var vivo;

var maxNiveles=4;
var ni;

var nivel;
var coordenadas;
var gravedad=50;
var usuariosJugando=[];
var lives;

function crearNivel(data){

    if (data.nivel<0){
        intentos = 0;
        noHayNiveles();
    } else {
        game = new Phaser.Game(800, 576, Phaser.AUTO, 'juegoId', { preload: preload, create: create, update: update });
        nivel=data.id;
        coordenadas=JSON.stringify(data.data);
    }

}
    

function preload() {
    game.load.tilemap('level', null, coordenadas, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/tileset.png', 32, 32);
    game.load.spritesheet('tileset_background', 'assets/tileset_background.png', 32, 32);

    game.load.image('sky', 'assets/sky.png');
    game.load.image('space', 'assets/starfield.jpg');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('dudeGris', 'assets/dudeGris.png', 32, 48);
    game.load.spritesheet('dude_bad1', 'assets/dude_bad1.png', 32, 48);
    game.load.spritesheet('dude_bad2', 'assets/dude_bad2.png', 32, 48);
    game.load.image('heaven', 'assets/heaven.png');
    game.load.spritesheet('ball', 'assets/plasmaball.png', 128, 128);
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    game.load.image('dead', 'assets/dead.png');
    game.load.image('vida', 'assets/firstaid.png');
    game.load.image('heart', 'assets/heart.png');

    game.load.audio('castle', 'assets/audio/castle.mp3');
    game.load.audio('dungeon', 'assets/audio/dungeon.mp3');
    game.load.audio('spring', 'assets/audio/spring.mp3');
    game.load.audio('summer', 'assets/audio/summer.mp3');
    meteoritosSalida=[];
}

function noHayNiveles() {
        alert('No hay niveles');
}

function create() {
    vivo=true
    game.map = game.add.tilemap('level');
    game.layer=game.map.layers[game.map.getLayerIndex('layer')];
    game.background=game.map.layers[game.map.getLayerIndex('background')];
    game.stage.backgroundColor=game.background.properties.background_color;
    game.audio = game.add.audio(game.background.properties.audio,0.5,true);
    game.audio.play();
    game.world.resize(game.layer.widthInPixels,game.layer.heightInPixels);
    //game.add.tileSprite(0, 0, game.layer.widthInPixels, game.layer.heightInPixels, 'space');

    bloques=game.add.group();
    bloques.enableBody = true;
    objetoMata=game.add.group();
    objetoMata.enableBody = true;
    objetoQuitaVida=game.add.group();
    objetoQuitaVida.enableBody = true;
    coleccionable=game.add.group();
    coleccionable.enableBody = true;
    decoracion=game.add.group();
    decoracion.enableBody = true;
    final=game.add.group();
    final.enableBody = true;
    meteoritos = game.add.group();
    meteoritos.enableBody = true;
    pesos = game.add.group();
    pesos.enableBody = true;

    generarSprites();

    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = game.add.sprite(playerX, playerY, 'dude');
    player.vidas=3;
    player.score=0;
    player.invencible=false;
    game.physics.arcade.enable(player);
    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
    player.body.setSize(player.width -6, player.height - 6, 3, 6);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 400;
    player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    tiempoText=game.add.text(game.width/2-100,20,'Tiempo: 0',{ fontSize: '32px', fill: '#FFF' });
    tiempoText.fixedToCamera=true;
    scoreText=game.add.text(game.width-200,20,'Score: 0',{ fontSize: '32px', fill: '#FFF' });
    scoreText.fixedToCamera=true;
        
    tiempo=0;
    timer=game.time.events.loop(Phaser.Timer.SECOND,updateTiempo,this);

    cursors = game.input.keyboard.createCursorKeys();

    socket.on('updatePosicion', function(usuario) {
        if (usuario.nombre!=$.cookie("nombre") && usuario.nivel==$.cookie("nivel")) {
            var playerOtro = undefined;
            $.each(usuariosJugando, function(index,elem){
                if (elem.nombre===usuario.nombre){
                    playerOtro=elem;
                };
            });
            if (playerOtro==undefined){
                playerOtro = game.add.sprite(usuario.x, usuario.y, 'dudeGris');
                game.physics.arcade.enable(playerOtro);
                game.world.bringToTop(player);
                playerOtro.nombre=usuario.nombre;
                playerOtro.socketid=usuario.socketid;
                playerOtro.text=game.add.text(usuario.x+16, usuario.y, playerOtro.nombre, { fontSize: '10px', fill: '#FFF' });
                playerOtro.text.anchor.set(0.5);
                usuariosJugando.push(playerOtro);
            } else {
                playerOtro.x=usuario.x;
                playerOtro.y=usuario.y;
                playerOtro.text.x=usuario.x+16;
                playerOtro.text.y=usuario.y;
            }
            playerOtro.frame=usuario.frame;
        }
    });

    socket.on('nojugando', function(usuario) {
        var playerOtro = undefined;
        $.each(usuariosJugando, function(index,elem){
            if (elem.socketid==usuario.socketid){
                playerOtro=elem;
            };
        });

        if (playerOtro!=undefined){
            playerOtro.text.destroy();
            playerOtro.kill();
        }
        usuariosJugando=$.grep(usuariosJugando, function(elem, index){
            return elem.socketid!=usuario.socketid;
        });
    });

    socket.emit('updatePosicion', {nombre:$.cookie("nombre"), nivel:$.cookie("nivel") , x:player.body.x-3, y:player.body.y-6, frame:4});

    lives = this.game.add.group();
    lives.fixedToCamera=true;
    lives.create(32, 30, 'heart').anchor.set(0.5);
    lives.create(64, 30, 'heart').anchor.set(0.5);
    lives.create(96, 30, 'heart').anchor.set(0.5);

    meteoritosSalida.forEach(function(meteoritoSalida){
        var meteorito = meteoritos.create(meteoritoSalida.x, 0, 'tileset_background');
        meteorito.body.gravity.y = 100 + (100 * Math.random() * 0.2);
        meteorito.frame=meteoritoSalida.frame;
        meteorito.checkWorldBounds=true;
        meteorito.outOfBoundsKill=true;
        game.time.events.loop(Phaser.Timer.SECOND*(3+2 * Math.random()), function(){
            var meteoritoAux = meteoritos.create(meteoritoSalida.x, 0, 'tileset_background');
            meteoritoAux.body.gravity.y = 100 + (100 * Math.random() * 0.4);
            meteoritoAux.frame=meteoritoSalida.frame;
            meteoritoAux.checkWorldBounds=true;
            meteoritoAux.outOfBoundsKill=true;
        }, this);
    });

    explosions = game.add.group();
    explosions.createMultiple(5, 'kaboom');
    explosions.forEach(setupMeteorito, this);
    function setupMeteorito(met){
        met.scale.setTo(0.3,0.3);
        met.animations.add('kaboom');
    } 
}

function update() {
        game.physics.arcade.collide(player, bloques);
        game.physics.arcade.overlap(player, final, endNivel, null, this);
        game.physics.arcade.overlap(player, coleccionable, collect, null, this);
        game.physics.arcade.overlap(player, objetoQuitaVida, collectQuitaVida, null, this);
        game.physics.arcade.overlap(player, pesos, collectQuitaVida, null, this);
        game.physics.arcade.overlap(player, meteoritos, collectMeteorito, null, this);
        game.physics.arcade.overlap(player, objetoMata, collectMata, null, this);
        game.physics.arcade.collide(player, objetoQuitaVida);
        pesos.forEach(function(peso){
            if (player.x>(peso.x-40)){
                peso.body.gravity.y = 300;
            }
        });
        // //  Reset the players velocity (movement)
         player.body.velocity.x = 0;

         if (vivo) {
             if (cursors.left.isDown)
             {
                 //  Move to the left
                 player.body.velocity.x = -150;
                 player.animations.play('left');
             }
             else if (cursors.right.isDown)
             {
                 //  Move to the right
                 player.body.velocity.x = 150;
                 player.animations.play('right');
             }
             else
             {
                 //  Stand still
                 player.animations.stop();
    
                 player.frame = 4;
             }
          
             //  Allow the player to jump if they are touching the ground.
             if (cursors.up.isDown && player.body.touching.down)
             {
                 player.body.velocity.y = -225;
             }
 
             socket.emit('updatePosicion', {nombre:$.cookie("nombre"), nivel:$.cookie("nivel") , x:(player.body.x-3), y:(player.body.y-6), frame:player.frame});
        }
}

function updateTiempo(){
    tiempo++;
    tiempoText.setText('Tiempo: '+tiempo);
    //if (tiempo == 10) lanzarVida();
}

function collectStar (player, star) {
        
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        player.score += 10;
}

function collect (player, objeto) {
        if (objeto.tipo=="moneda"){
            player.score+=objeto.valor;
            scoreText.setText('Score: '+player.score);
        }
        // Removes the star from the screen
        objeto.kill();

        //  Add and update the score
}

function collectQuitaVida (player, objeto) {
        //  Add and update the score
        if (player.vidas>0 && !player.invencible) {
            lives.getTop().destroy();
            player.vidas=player.vidas-1;
            if (player.vidas==0){
                player.loadTexture('dead');
                player.body.setSize(48,32);
                vivo=false;
                endText = game.add.text(240, 280, '¡Has muerto!', { fontSize: '50px', fill: '#FFF' });
                game.time.events.remove(timer);
                comunicarNoJugandoSocket();
                reiniciarNivel();
            } else {
                player.tween = game.add.tween(player).to( { alpha: 0 }, 100, Phaser.Easing.Linear.None, false,0,-1,true);
                toggleInvencible();
                game.time.events.add(2000, toggleInvencible, this);
                if (player.vidas>2) {
                    player.loadTexture('dude_bad2');
                } else {
                    player.loadTexture('dude_bad'+player.vidas);
                }

            }
        }

}

function toggleInvencible(){
    player.invencible= !player.invencible;
    if (player.invencible) {
        player.tween.start();
    } else {
        player.tween.repeat(0);
    }
}


function collectMata (player, objeto) {

        //  Add and update the score
        if (player.vidas>0) {
            lives.destroy();
            player.vidas=0;
            player.loadTexture('dead');
            player.body.setSize(48,32);
            vivo=false;
            endText = game.add.text(240, 280, '¡Has muerto!', { fontSize: '50px', fill: '#FFF' });
            game.time.events.remove(timer);
            comunicarNoJugandoSocket();
            reiniciarNivel();
        }

}

function collectMeteorito (player, meteorito) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(meteorito.body.x, meteorito.body.y);
        explosion.play('kaboom', 30, false, true);
        // Removes the star from the screen
        meteorito.kill();
        collectQuitaVida (player, meteorito);
}

function collectVida (player, vida) {
    player.vidas=player.vidas+1;
    lives.create(32*player.vidas,30, 'heart').anchor.set(0.5);
    vida.kill();
}

function endNivel (player, heaven) {
    if (player.vidas>0) {
        comunicarNoJugandoSocket();
        player.kill();
        game.time.events.remove(timer);
        nivelCompletado(tiempo, player.vidas, player.score);
    }
}

function muereMeteorito(platform,meteorito){
    meteorito.kill();
    lanzarMeteorito(gravedad);
}


function lanzarMeteorito(gravedad){
            
    var i=Math.floor((Math.random()*(game.world.width-2)+1));
    //  Create a meteorito inside of the 'meteoritos' group
    var meteorito = meteoritos.create(i, 0, 'ball');
    meteorito.scale.setTo(0.25,0.25);
    meteorito.animations.add('pulse');
    meteorito.play('pulse', 30, true);


    //  Let gravity do its thing
    meteorito.body.gravity.y = gravedad + (gravedad * Math.random() * 0.2);;

    //  This just gives each meteorito a slightly random bounce value
     meteorito.checkWorldBounds = true;


    
}

function lanzarVida(){
    var i=Math.floor((Math.random()*(game.world.width-2)+1));
    var vida = vidas.create(i,0,'vida');
    vida.body.gravity.y = 100;
}

function generarSprites(){
    for (var i = 0; i < game.background.height; i++) {
            for (var j = 0; j < game.background.width; j++) {
                var tileDecoracion=game.background.data[i][j];
                    configurarBackgroundTile(tileDecoracion);
            }
        }
        for (var i = 0; i < game.layer.height; i++) {
            for (var j = 0; j < game.layer.width; j++) {
                var tile = game.layer.data[i][j];
                configurarTile(tile);
            }
        }
}

function configurarBackgroundTile(tile){
    var tileSprite;
    switch(tile.index){
        case -1:
        case 0:
            break;
        case 111: //roca
        case 158: //bomba
            meteoritosSalida.push({x:tile.worldX, y:tile.worldY, frame:tile.index-100});
            break;
        default:
            createBackgroundSpriteFromTile(decoracion,tile);
            break;
    }
}

function configurarTile(tile){
    var tileSprite;
    switch(tile.index){
        case -1:
        case 0:
            break;
        case 10: //puente troncos
            tileSprite=crearSpriteFromTile(bloques,tile);
            tileSprite.body.setSize(32,11,0,21);
            break;
        case 11: //puente madera
            tileSprite=crearSpriteFromTile(bloques,tile);
            tileSprite.body.setSize(32,9,0,23);
            break;
        case 12: //moneda oro
            tileSprite=crearSpriteFromTile(coleccionable,tile);
            tileSprite.body.setSize(16,16,8,9);
            tileSprite.tipo="moneda";
            tileSprite.valor=10;
            break;
        case 13: //moneda plata
            tileSprite=crearSpriteFromTile(coleccionable,tile);
            tileSprite.body.setSize(16,16,8,9);
            tileSprite.tipo="moneda";
            tileSprite.valor=5;
            break;
        case 14: //moneda bronce
            tileSprite=crearSpriteFromTile(coleccionable,tile);
            tileSprite.body.setSize(16,16,8,9);
            tileSprite.tipo="moneda";
            tileSprite.valor=2;
            break;
        case 15: //llave roja
            tileSprite=crearSpriteFromTile(coleccionable,tile);
            tileSprite.body.setSize(28,16,2,7);
            tileSprite.tipo="llave";
            tileSprite.color="roja";
            break;
        case 16: //llave verde
            tileSprite=crearSpriteFromTile(coleccionable,tile);
            tileSprite.body.setSize(28,16,2,7);
            tileSprite.tipo="llave";
            tileSprite.color="verde";
            break;
        case 17: //llave amarilla
            tileSprite=crearSpriteFromTile(coleccionable,tile);
            tileSprite.body.setSize(28,16,2,7);
            tileSprite.tipo="llave";
            tileSprite.color="amarilla";
            break;
        case 18: //llave azul
            tileSprite=crearSpriteFromTile(coleccionable,tile);
            tileSprite.body.setSize(28,16,2,7);
            tileSprite.tipo="llave";
            tileSprite.color="azul";
            break;
        case 41:
        case 19: //cartel exit
            tileSprite=crearSpriteFromTile(final,tile);
            break;
        case 32:
            tileSprite=crearSpriteFromTile(final,tile);
            tileSprite.body.setSize(32,18,0,14);
            break;
        case 23: //pinchos derecha
            tileSprite=crearSpriteFromTile(objetoMata,tile);
            tileSprite.body.setSize(13,28,19,2);
            break;
        case 24: //pinchos izquierda
            tileSprite=crearSpriteFromTile(objetoMata,tile);
            tileSprite.body.setSize(13,28,0,2);
            break;
        case 25: //pinchos arriba
            tileSprite=crearSpriteFromTile(objetoMata,tile);
            tileSprite.body.setSize(28,13,2,0);
            break;
        case 26: //peso
            tileSprite=crearSpriteFromTile(pesos,tile);
            break;
        case 20: //fecha izquierda
        case 21: //flecha derecha
        case 27: //seta roja
            tileSprite=crearSpriteFromTile(decoracion,tile);
            break;
        case 22: //player
            playerX=tile.worldX;
            playerY=tile.worldY;
            break;
        case 28: //superficie agua
        case 29: //superficie lava
            tileSprite=crearSpriteFromTile(objetoMata,tile);
            tileSprite.body.setSize(32,20,0,12);
            break;
        case 30: //pinchos abajo
            tileSprite=crearSpriteFromTile(objetoMata,tile);
            tileSprite.body.setSize(28,13,2,19);
            break;
        case 33:
        case 37: //agua cuadrado
        case 38: //lava cuadrado
            tileSprite=crearSpriteFromTile(objetoMata,tile);
            break;
        case 39: //cactus
            tileSprite=crearSpriteFromTile(objetoQuitaVida,tile);
            tileSprite.body.setSize(16,26,8,6);
            break;
        case 47:
        case 50:
        case 53:
        case 55:
        case 56:
        case 57:
        case 58:
        case 59:
        case 60:
        case 61:
        case 62:
        case 63:
        case 74:
        case 77:
        case 80:
        case 82:
        case 83:
        case 84:
        case 85:
        case 86:
        case 87:
        case 88:
        case 89:
        case 90:
            tileSprite=crearSpriteFromTile(bloques,tile);
            //cambiar medio bloque
            break;
        default:
            tileSprite=crearSpriteFromTile(bloques,tile);
    }
}

function crearSpriteFromTile(grupo,tile){
    var tileSprite=grupo.create(tile.worldX, tile.worldY, 'tileset');
    tileSprite.frame=tile.index-1;
    tileSprite.body.immovable = true;
    return tileSprite;
}

function createBackgroundSpriteFromTile(grupo,tile){
    var tileSprite=grupo.create(tile.worldX, tile.worldY, 'tileset_background');
    tileSprite.frame=tile.index-100;
    tileSprite.body.immovable = true;
    return tileSprite;
}