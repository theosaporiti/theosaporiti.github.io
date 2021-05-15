/*******************************************************************************
|                                                                              |
|                             (c) 2016 Theo Saporiti                           |
|                  LAM in Fisica 2016-2017, Liceo di Lugano 2                  |
|           Rappresentazione grafica della trasformazione di Lorentz           |
|                                                                              |
*******************************************************************************/

//Accedi alla Canvas API presente in HTML5
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");


/*******************************************************************************
*******************************    DEFINIZIONI    ******************************
*******************************************************************************/


//Definisci alcune variabili importanti
var beta=0;					//Rapporto v/c
var points=new Array();		//Array degli eventi
var update=true;			//Permettere il ridisegno del canvas?
var galileo=true;			//Scelta della trasformazione

//Definisci la trasformazione di Lorentz (tempi in metri)
var TL={
	x: function(x,t){
		return gamma()*(x-beta*t);
	},

	t: function(x,t){
		return gamma()*(t-beta*x);
	}
}

//Definisci la trasformazione di Galileo (tempi in metri)
var TG={
	x: function(x,t){
		return x-beta*t;
	},

	t: function(x,t){
		return t;
	}
}

//Definisci la trasformazione delle coordinate: in canvas l'origine è posta nell'angolo superiore sinistro e tutte le coordinate dei punti visibili sono positive
var cartesian={
	x: function(x){
		return canvas.width/2+x;
	},

	y: function(y){
		return canvas.height/2-y;
	}
}

//Definisci il fattore di Lorentz
function gamma()
{
	return 1/Math.sqrt(1-Math.pow(beta,2));
}

//Definisci la funzione che disegnerà il diagramma
function draw()
{
	//Se è consentito il ridisegno...
	if(update)
	{
		//...elimina quanto disegnato in precedenza...
		ctx.clearRect(0,0,canvas.width,canvas.height);

		//...poni lo sfondo nero...
		ctx.fillStyle="black";
		ctx.fillRect(0,0,canvas.width,canvas.height);

		//...e disegna il cono di luce relativo all'origine
		ctx.fillStyle="#262626";
		ctx.strokeStyle="#262626";
		ctx.beginPath();
		ctx.moveTo(
			cartesian.x(-canvas.width/2),
			cartesian.y(-canvas.height/2)
		);
		ctx.lineTo(
			cartesian.x(canvas.width/2),
			cartesian.y(canvas.width/2)
		);
		ctx.lineTo(
			cartesian.x(-canvas.width/2),
			cartesian.y(canvas.width/2)
		);
		ctx.lineTo(
			cartesian.x(canvas.width/2),
			cartesian.y(-canvas.width/2)
		);
		ctx.stroke();
		ctx.fill();
	}
	//...altrimenti continua a disegnare sopra quanto già illustrato in modo da ottenere un effetto "traccia"

	//Per ogni evento dello spaziotempo...
	for(var i=0;i<points.length;i++)
	{
		//...decidi il suo colore a dipendenza del tipo di vettore (space-like o time-like)...
		if(Math.abs(TR.x(points[i].x,points[i].t)) > Math.abs(TR.t(points[i].x,points[i].t))){var color="red";}else{var color="orange";}
		ctx.strokeStyle=color;
		ctx.fillStyle=color;

		//...e disegnalo come un piccolo cerchio
		ctx.beginPath();
		ctx.arc(
			cartesian.x(TR.x(points[i].x,points[i].t)),
			cartesian.y(TR.t(points[i].x,points[i].t)),
			2,0,2*Math.PI);
		ctx.stroke();
		ctx.fill();
	}

	//Disegna ora gli assi dei due referenziali, dapprima quello bianco S'...
	ctx.lineWidth=2;
	ctx.fillStyle="white";

	ctx.fillRect(canvas.width/2,-1,2,canvas.height);
	ctx.fillRect(-1,canvas.height/2,canvas.width,2);

	//...poi quello verde S...
	ctx.strokeStyle="#2ECC40";
	ctx.beginPath();
	
	//...al quale dobbiamo roteare gli assi in funzione di beta
	if(Math.abs(beta)>0 && update)
	{
		//Rotea l'asse degli spazi se e solo se la trasformazoine considerata è quella di Lorentz
		if(!galileo)
		{
			ctx.moveTo(
				cartesian.x(0),
				cartesian.y(0)
			);
			ctx.lineTo(
				cartesian.x(canvas.width/2),
				cartesian.y(-canvas.width/2*beta)
			);
			ctx.lineTo(
				cartesian.x(-canvas.width/2),
				cartesian.y(canvas.width/2*beta)
			);
			ctx.lineTo(
				cartesian.x(0),
				cartesian.y(0)
			);
			ctx.stroke();
		}

		//Rotea l'asse dei tempi qualsiasi sia la trasformazione impiegata
		ctx.moveTo(
			cartesian.x(0),
			cartesian.y(0)
		);
		ctx.lineTo(
			cartesian.x(canvas.width/2),
			cartesian.y(-canvas.width/2*1/beta)
		);
		ctx.lineTo(
			cartesian.x(-canvas.width/2),
			cartesian.y(canvas.width/2*1/beta)
		);
		ctx.lineTo(
			cartesian.x(0),
			cartesian.y(0)
		);
		ctx.stroke();
		
		//Scrivi in alto a sinistra il valore di beta
		ctx.fillStyle="white";
		ctx.font="15px Arial";
		ctx.textAlign="left";
		ctx.textBaseline="hanging";
		ctx.fillText("β = "+beta,5,5);
	}
}


/***************************************************************
*************************    EVENTI    *************************
***************************************************************/


//Definisci le varie azioni che l'utente è in grado di eseguire premendo gli appositi pulsanti, ovvero:
var user={
	//Eliminare tutti gli eventi dallo spaziotempo
	empty: function(){
		points=new Array();
		draw();
	},

	//Aggiungere eventi a caso
	random: function(){
		for(var i=0;i<50;i++)
		{
			var a=1;

			points.push({
				x: Math.floor(Math.random()*a*canvas.width-a*canvas.width/2),
				t: Math.floor(Math.random()*a*canvas.width-a*canvas.width/2)
			});
		}

		draw();
	},

	//Aggiungere un evento specifico (accessibile soltanto da console!)
	specific: function(x,t){
		points.push({
			x: x,
			t: t
		});

		draw();
	},

	//Scegliere se permettere il ridisegno
	refresh: function(){
		update=!update;
		draw();
	},

	//Scegliere quale trasformazione applicare
	transformation: function(){
		galileo=!galileo;
		if(galileo){TR=TG;}else{TR=TL;}
		draw();
	}
}

//Imponi al programma di "ascoltare" qualsiasi cambio dello slider e di immediatamente modificare beta
document.getElementById("beta").oninput=function(){
	beta=Number(this.value);
	draw();
}


/***************************************************************
******************    LANCIO APPLICAZIONE    *******************
***************************************************************/


//Lancia il programma imponendo come default la trasformazione di Lorentz
user.transformation();
draw();