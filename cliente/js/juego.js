
var player;
var platforms;
var platformsGris;
var cursors;
var cielo;

var stars;
var meteoritos;
var explosions;
var score = 0;
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
var coord;
var gravedad;

//inicializarCoordenadas();

function crearNivel(data){
    if (data.nivel<0){
        intentos = 0;
        noHayNiveles();
    } else {
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'juegoId', { preload: preload, create: create, update: update });
        nivel=data.id;
        coord=data.coordenadas;
        coordGris=data.coordenadasGris;
        gravedad=data.gravedad;
    }
    /*ni=parseInt(nivel);
    if(ni<maxNiveles)
    {
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'juegoId', { preload: preload, create: create, update: update });
    }
    else{
        noHayNiveles();
    }*/

}
    

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('space', 'assets/starfield.jpg');
    game.load.image('ground1', 'assets/platform.png');
    game.load.image('ground2', 'assets/platform2.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('dude_bad1', 'assets/dude_bad1.png', 32, 48);
    game.load.spritesheet('dude_bad2', 'assets/dude_bad2.png', 32, 48);
    game.load.image('heaven', 'assets/heaven.png');
    game.load.image('meteorito', 'assets/meteorito.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('bloque', 'assets/bloque.png');
    game.load.image('bloqueGris', 'assets/bloqueGris.png');
    game.load.spritesheet('ball', 'assets/plasmaball.png', 128, 128);
    game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    game.load.image('dead', 'assets/dead.png');
}

function noHayNiveles() {
        alert('No hay niveles');
}

function create() {

        vivo=true;
    
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        //game.add.sprite(0, 0, 'sky');
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();
        platformsGris = game.add.group();
        heaven = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;
        platformsGris.enableBody = true;
        heaven.enableBody = true;

        // Here we create the ground.
        var ground = platforms.create(0, game.world.height - 64, 'ground');
        var end = heaven.create(0,-15,'heaven');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        //ground.scale.setTo(2, 2);
        end.scale.setTo(2,1);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;
        //end.body.immovable = true;

        //  Now let's create two ledges
        /*for(var i=0;i<coordenadas[ni].length;i++){
            ledge = platforms.create(coordenadas[ni][i].x,coordenadas[ni][i].y, 'bloque');
            ledge.body.immovable = true;
        }
        for (var i=0;i<coordenadasGris[ni].length;i++){
            ledge = platformsGris.create(coordenadasGris[ni][i].x,coordenadasGris[ni][i].y, 'bloqueGris');
            ledge.body.immovable = true;  
        }*/

        for(var i=0;i<coord.length;i++){
            ledge = platforms.create(coord[i][0],coord[i][1], 'bloque');
            ledge.body.immovable = true;
        }
        for(var i=0;i<coordGris.length;i++){
            ledge = platformsGris.create(coordGris[i][0],coordGris[i][1], 'bloqueGris');
            ledge.body.immovable = true;
        }

        /*var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        ledge = platforms.create(350, 200, 'ground2');
        ledge.body.immovable = true;*/

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');
        player.vidas=3;
        /*shadow = game.add.sprite(32, game.world.height - 150, 'dude');
        shadow.tint = 0x000000;
        shadow.alpha = 0.6;*/

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        //  Finally some stars to collect
        stars = game.add.group();
        meteoritos = game.add.group();

        //  We will enable physics for any star that is created in this group
        stars.enableBody = true;
        meteoritos.enableBody = true;
    /****/
        stars.physicsBodyType = Phaser.Physics.ARCADE;
        //meteoritos.physicsBodyType = Phaser.Physics.ARCADE;

        //game.physics.arcade.enable(platforms);
        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            //var star = stars.create(i * 70, 0, 'star');
            var meteorito = meteoritos.create(i * 70, 0, 'ball');
            meteorito.scale.setTo(0.25,0.25);
            meteorito.animations.add('pulse');
            meteorito.play('pulse', 30, true);

            //  Let gravity do its thing
            //star.body.gravity.y = 300;
            meteorito.body.gravity.y = 50;

            //  This just gives each star a slightly random bounce value
            //star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        //  The score
        //scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        scoreText = game.add.text(16, game.world.height-45, 'Vidas: '+player.vidas, { fontSize: '32px', fill: '#FFF' });

        tiempoText=game.add.text(game.world.width-170,game.world.height-45,'Tiempo:0',{ fontSize: '32px', fill: '#FFF' });
        
        tiempo=0;
        timer=game.time.events.loop(Phaser.Timer.SECOND,updateTiempo,this);


    explosions = game.add.group();
    explosions.createMultiple(5, 'kaboom');
    explosions.forEach(setupMeteorito, this);
    function setupMeteorito(met){
        //met.anchor.x = 0.5;
        //met.anchor.y = 0.5;
        met.scale.setTo(0.3,0.3);
        met.animations.add('kaboom');
    }

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();
        

    

}

function update() {

    

        //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(player, platformsGris);
        //game.physics.arcade.collide(stars, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        game.physics.arcade.overlap(player, stars, collectStar, null, this);
        game.physics.arcade.overlap(player, meteoritos, collectMeteorito, null, this);
        game.physics.arcade.overlap(player, heaven, endNivel, null, this);
        game.physics.arcade.overlap(platforms, meteoritos, muereMeteorito, null,this);

        //  Reset the players velocity (movement)
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
                player.body.velocity.y = -250;
            }
        }

}

function updateTiempo(){
    tiempo++;
    tiempoText.setText('Tiempo: '+tiempo);
}

function collectStar (player, star) {
        
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        score += 10;
        scoreText.text = 'Score: ' + score;
}

function collectMeteorito (player, meteorito) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(meteorito.body.x, meteorito.body.y);
        explosion.play('kaboom', 30, false, true);
        // Removes the star from the screen
        meteorito.kill();

        //  Add and update the score
        /*score += 10;
        scoreText.text = 'Score: ' + score;*/
        if (player.vidas>0) {
            player.vidas=player.vidas-1;
            scoreText.text = 'Vidas: ' + player.vidas;
            if (player.vidas==0){
                //player.kill();
                player.loadTexture('dead');
                player.body.setSize(48,32);
                vivo=false;
                endText = game.add.text(240, 280, '¡Has muerto!', { fontSize: '50px', fill: '#FFF' });
                game.time.events.remove(timer);
                reiniciarNivel();
            } else {
                player.loadTexture('dude_bad'+player.vidas);
            }
        }

}

function endNivel (player, heaven) {
    player.kill();
    game.time.events.remove(timer);
    nivelCompletado(tiempo, player.vidas);
}

function muereMeteorito(platform,meteorito){
    meteorito.kill();
    lanzarMeteorito(50);
}


function lanzarMeteorito(gravedad){
            
    var i=Math.floor((Math.random()*(game.world.width-2)+1));
    //  Create a meteorito inside of the 'meteoritos' group
    var meteorito = meteoritos.create(i, 0, 'ball'); //i*70,0
    meteorito.scale.setTo(0.25,0.25);
    meteorito.animations.add('pulse');
    meteorito.play('pulse', 30, true);


    //  Let gravity do its thing
    meteorito.body.gravity.y = gravedad;

    //  This just gives each meteorito a slightly random bounce value
    //meteorito.body.bounce.y = 0.7 + Math.random() * 0.2;
     meteorito.checkWorldBounds = true;


    
}