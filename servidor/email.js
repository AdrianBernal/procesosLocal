
//var url="http://procesos.herokuapp.com/";
var url="http://127.0.0.1:5000/";
/***************** EMAIL *********************/
var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://procesosisw%40gmail.com:pr0c3s0s@smtp.gmail.com');

// setup e-mail data with unicode symbols
module.exports.enviarEmail=function(usuario){
	var mailOptions = {
	    from: '"Adrian Juego Procesos" <procesosisw@gmail.com>', // sender address
	    to: usuario.email, // list of receivers
	    subject: 'Bienvenido al juego Conquista Niveles. Confirmación de cuenta.', // Subject line
	    text: 'Confirmar cuenta', // plaintext body
	    html: '<p>Hola '+usuario.nombre+', se ha registrado correctamente en el juego conquista niveles.</p>'+
	    '<p>Para confirmar su cuenta y acceder al juego haga click en el siguiente enlace: <a href="'+url+'confirmarUsuario/'+usuario.nombre+'/'+usuario.key+'">Confirmar cuenta y acceder al juego</a></p>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	    	console.log(err);
	    } else {
	    	console.log('Message sent: ' + info.response);
	    }
	});
}