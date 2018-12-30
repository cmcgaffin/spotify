/*
Connor McGaffin
Section C
cmcgaffi@andrew.cmu.edu
Assignment 11-B
*/

var option = 3; //starting option
var w = 500; //width
var h = 300; //height
var w2 = w / 2; //width / 2
var h2 = h / 2; //height / 2
var x = []; //bubble starting pos
var y = [];
var dx = []; //bubble direction
var dy = [];
var col = []; //bubble color
var np = 50; // how many particles
var nb = 50; //how many bubbles
var title = ["Valerie","Hound Dog", "Step"];
var artist = ["Amy Winehouse", "Elvis Presley", "Vampire Weekend"];
var currentSpot = 200; //current spot and lengths are to be later configured with p5.js addons and Spotify connectivity
var songLength = 300; // placeholder
var tempo = [96,175,78,0]; //stored tempo of songs
var amp = new p5.Amplitude(); //get amplitude
var particles = [];

function preload() {
    img = loadImage("https://i.imgur.com/K3YQPRm.png"); //load spotify logo
    amy = loadSound("https://courses.ideate.cmu.edu/15-104/f2018/wp-content/uploads/2018/12/amy.mp3"); //"Valerie" by Amy Winehouse
    elvis = loadSound("https://courses.ideate.cmu.edu/15-104/f2018/wp-content/uploads/2018/12/elvis.mp3"); //"Hound Dog" by Elvis Presley
    vw = loadSound("https://courses.ideate.cmu.edu/15-104/f2018/wp-content/uploads/2018/12/vw.mp3"); //"Step" by Vampire Weekend 
}

function particleStep() {
    this.x += this.dx;
    this.y += this.dy / 5;
}

function particleDraw() { //draw particle
    strokeWeight(this.s);
    point(this.x, this.y);
}

function makeParticle(px, py, pdx, pdy, ps) { //create particle with starting pos and velocity
    p = {x: px, y: py,
         dx: pdx, dy: pdy, s: ps,
         step: particleStep,
         draw: particleDraw
        }
    return p;
}

function explode() {
    for (var i = 0; i < np; i++) {// make a particle
        fill(255);
        stroke(255);
        var p = makeParticle(w2, h2, random(-30,50), random(-30,50), random(5,10)); //initial location x/y quadrant velocity x/y, size
        particles.push(p); // push the particle onto particles array 
    }
    for (var i = 0; i < np; i++) { // for each particle
        var p = particles[i];
        p.step();
        p.draw();
    }
}

function record () {
    noStroke();
    fill(0);
    ellipse (w2, h2 , 200); //vinyl
    for (i = 0; i < 8; i++){ 
        push();
        noFill();
        stroke(90);
        strokeWeight(1);
        ellipse(w2, h2, 190 - i * 30);
        pop();  //texture
    }
    fill(200); // blue
    ellipse(w2, h2, 75); //label
    push();
    translate(w2,h2);
    rotate(frameCount * 5);
    fill(150);
    ellipse(15, 0, 5); //label spin
    pop();
    fill(255);
    ellipse (w2, h2, 10); // peg
}

function tonearm () {
    angleMode(DEGREES);
    translate(w2 + 100, h2 - 100);
    fill(255);
    ellipse(0, 0, 30); //swivel
    var tonearmPosition = map(currentSpot, 0, songLength, 0, 28);
    push();
    rotate(tonearmPosition);
    push();
    rectMode(CENTER);
    rect(0,125, 12, 25); //cartridge
    pop();
    strokeWeight(3);
    stroke(255);
    line(0, 0, 0, 125); //bar
    pop();
}

function header () {
    image(img,10,10,20,20);
    fill(255);
    textSize(12);
    text(title[option], 35, 20); //display title 12pt
    textSize(9);
    text(artist[option], 35, 30); //display artist 9pt
}


function setup() {
    createCanvas(w, h);
    for (i = 0; i < nb; i++) {  //generate bubbles 
        x[i] = random(width); //randomly 
        y[i] = height; //at the bottom
        dx[i] = random(-.5,.5); //that float sideways randomly 
        dy[i] = random(-2,-1); // and float virtically faster
        col[i] = color(random(255)); //randomly filled in greyscale
    }
}

function draw() {
    background(10,0,0);
    stroke(0);
    strokeWeight(10);
    explode();
    var vol = amp.getLevel();
    var bdiam = map(vol, 0, 1 , 5, 18);
	var vdiam = map(vol, 0, 1, 200, 250); //vinyl amp diameter
    
    for (i = 0; i < nb; i++) {  
        fill(col[i]);
        noStroke();
        ellipse(x[i], y[i], bdiam);
        x[i] += dx[i];
        y[i] += dy[i];
        
    	if (x[i] > width) { //bounce off right wall
        	x[i] = width - (x[i] - width);
        	dx[i] = -dx[i];

    	} else if (x[i] < 0) { //bounce off left wall
        	x[i] = -x[i];
        	dx[i] = -dx[i];

    	}
    	if (y[i] > height) { //bounce off bottom
        	y[i] = height - (y[i] - height);
        	dy[i] = -dy[i];
       
    	} else if (y[i] < 0) { //float off top, appear at bottom
    		y[i] = height;
    	}
	}
	push();
    noStroke();
    fill(180);
    ellipse(w2,h2,vdiam,vdiam);
    pop();
    header();
    record();
    tonearm();         
}

function mouseClicked() {
	particles = []; //clear particles array
	explode(); //create particle explosion
    option ++; //next option when clicked
    if(option > 3){ 
        option = 0;
    }
    if(option == 0){
    	for(i = 0; i < nb; i++){
    		col[i] = color(0, 0, random(255)); //random blue
    		dx[i] = tempo[option] * random(-.1,.1) / 10; //horiz to tempo
    	}
        vw.stop(); //stop "step"
        amy.play(); // play "valerie"
    }
    if(option == 1){
    	for(i = 0; i < nb; i++){
    		col[i] = color(random(255),0,0); //random red
    		dx[i] = tempo[option] * random(-.1,.1) / 10; // horiz to tempo
    	}
        amy.stop(); //stop "valerie"
        elvis.play(); //play "hound dog"
    }
    if(option == 2){
    	for(i = 0; i < nb; i++){
    		col[i] = color(random(255)); //random greyscale
    		dx[i] = tempo[option] * random(-.1,.1) / 10; //horiz to tempo
    	}
        elvis.stop(); //stop "hound dog"
        vw.play(); //play "step"
    }
    if(option == 3){
        vw.stop(); //stop "step"
    	for(i = 0; i < nb; i++){
    		col[i] = color(255); //bubbles fill white
    		dx[i] = random(-.1,.1); //horiz moment unrelated to tempo
    	}
    }
}