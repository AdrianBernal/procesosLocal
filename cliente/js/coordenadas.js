function Punto(x,y){
	this.x=x;
	this.y=y;
}

var coordenadas=[];
var coordenadasGris=[];
    
function inicializarCoordenadas(){
	//coordenadas[0]=[new Punto(80,456),new Punto(240,376),new Punto(400,296),new Punto(560,216)];
	coordenadas[0]=[new Punto(80,456),new Punto(240,376),new Punto(400,296),new Punto(560,216),new Punto(720,136)];
    //coordenadas[3]=[new Punto(200,450),new Punto(100,350),new Punto(0,250),new Punto(200,150)];
    //coordenadas[1]=[new Punto(700,450),new Punto(600,350),new Punto(700,250),new Punto(600,150)];
    coordenadas[1]=[new Punto(700,450),new Punto(500,350),new Punto(700,250),new Punto(500,150)];
    //coordenadas[2]=[new Punto(200,450),new Punto(100,350),new Punto(0,250),new Punto(200,150)];
    coordenadas[2]=[new Punto(700,450),new Punto(700,250)];
    coordenadas[3]=[];

    coordenadasGris[0]=[];
    coordenadasGris[1]=[];
    coordenadasGris[2]=[new Punto(500,350),new Punto(500,150)];
    coordenadasGris[3]=[new Punto(80,456),new Punto(240,376),new Punto(400,296),new Punto(560,216),new Punto(720,136)];
}