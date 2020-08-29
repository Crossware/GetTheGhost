var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');
var canvasGhost = document.getElementById('canvasGhost');
var ctxGhost = canvasGhost.getContext('2d');
var canvasEnemy = document.getElementById('canvasEnemy');
var ctxEnemy = canvasEnemy.getContext('2d');
var canvasHUD = document.getElementById('canvasHUD');
var ctxHUD = canvasHUD.getContext('2d');
ctxHUD.fillStyle = "hsla(360, 88%, 23%, 1)";
ctxHUD.font = "bold 20px Arial";


var Ghost1 = new Ghost();
var btnPlay = new Button(317, 505, 235, 315);
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var mouseX = 0;
var mouseY = 0;
var isPlaying = false;
var requestAnimFrame = window.requestAnimationFrame ||
					   window.webkitRequestAnimationFrame ||
					   window.mozRequestAnimationFrame ||
					   window.msRequestAnimationFrame ||
					   window.oRequestAnimationFrame;

var enemies = [];		// a list / an array ^ list referencing starts from 0 as in 0-1-2-3...		
						// if enemies[3] it will refer the 3rd number
var spawnAmount = 5;
					   
					   
		


var imgSprite = new Image();
imgSprite.src = 'images/sprite2.png';
imgSprite.addEventListener('load',init,false);


var bgDrawX1 =0;
var bgDrawX2 =1600;

function moveBg(){
		bgDrawX1 -= 5;
		bgDrawX2 -= 5;
		if(bgDrawX1 <= -1600){
		   bgDrawX1 = 1600;	
		}
		else if(bgDrawX2 <= -1600){
			bgDrawX2 = 1600;  	
		}
		drawBg();
}


	// main functions
	

function init() {
	spawnEnemy(5);
	drawMenu();
	document.addEventListener('click',mouseClicked,false);
}

function playGame(){
	drawBg();
    startLoop();
	updateHUD();	
	document.addEventListener('keydown',checkKeyDown,false);
	document.addEventListener('keyup',checkKeyUp,false);

	
}


function spawnEnemy(number){ 					//number can also be writen as n
	for (var i = 0; i < number; i++) {			//for is a loop / i++ adds to the n
		enemies[enemies.length] = new Enemy();
	}
}



function drawAllEnemies(){
	clearCtxEnemy();
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].draw();
	}
}




 // if !isPlaying is used, its the same as isPlaying === false
 // if isPlaying is used, its the same as isPlaying === true
function loop() {
	if (isPlaying) {
		moveBg();
		Ghost1.draw();
		drawAllEnemies();	
		requestAnimFrame(loop);
	}
}


function startLoop(){
	isPlaying = true;
	loop();

}

function stopLoop(){
	isPlaying = false;	
}

function drawMenu() {
    var srcX = 0;
    var srcY = 600;
    var drawX = 0;
    var drawY = 0;
    ctxBg.drawImage(imgSprite,srcX,srcY,gameWidth,gameHeight,drawX,drawY,gameWidth,gameHeight);
}



function drawBg() {
	ctxBg.clearRect(0,0,gameWidth,gameHeight);
    ctxBg.drawImage(imgSprite, 0, 0, 1600, gameHeight ,bgDrawX1 ,0 ,1600, gameHeight);
	ctxBg.drawImage(imgSprite, 0, 0, 1600, gameHeight ,bgDrawX2 ,0, 1600, gameHeight);
}




function updateHUD(){
	ctxHUD.clearRect(0,0,gameWidth,gameHeight);
	ctxHUD.fillText("Score: " + Ghost1.score, 680, 30);
}
	// end of main functions
	
	
	
	
	
	
	// ghost functions
	
	
function Ghost() {
	this.srcX = 0;
	this.srcY = 500;
	this.width = 100;
	this.height = 100;
	this.speed = 2;
	this.drawX = 220;
	this.drawY = 200;
	this.noseX = this.drawX + 100;
	this.noseY = this.drawY + 30;
	this.leftX = this.drawX;
	this.rightX = this.drawX + this.width;
	this.topY = this.drawY;
	this.bottomY = this.drawY + this.height;
	this.isUpKey = false;
	this.isRightKey = false;
	this.isDownKey = false;
	this.isLeftKey = false;
	this.isSpacebat = false;
	this.isShooting = false;
	this.bullets = [];
	this.currentBullet = 0;
	for (var i = 0; i < 25; i++){
		this.bullets[this.bullets.length] = new Bullet(this);	
	}
	this.score = 0;
}



Ghost.prototype.draw = function () {
	clearCtxGhost();
	this.updateCoords();
	this.checkDirection();
	this.noseX = this.drawX + 100;
	this.noseY = this.drawY + 30;
	this.checkShooting();
	this.drawAllBullets();
    ctxGhost.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	
};



Ghost.prototype.updateCoords = function(){
		this.noseX = this.drawX + 100;
		this.noseY = this.drawY + 30;
		this.leftX = this.drawX;
		this.rightX = this.drawX + this.width;
		this.topY = this.drawY;
		this.bottomY = this.drawY + this.height;	
}



Ghost.prototype.checkDirection = function () {
	if(this.isUpKey && this.topY >0){
		this.drawY -= this.speed;
	}
	if(this.isRightKey && this.rightX < gameWidth){
		this.drawX += this.speed;
	}
	if(this.isDownKey && this.bottomY < gameHeight){
		this.drawY += this.speed;
	}
	if(this.isLeftKey && this.leftX > 0){
		this.drawX -= this.speed;
	}
}

Ghost.prototype.drawAllBullets = function(){
	for (var i = 0; i < this.bullets.length; i++) {
		if (this.bullets[i].drawX >= 0) this.bullets[i].draw();
		if (this.bullets[i].explosion.hasHit) this.bullets[i].explosion.draw();
	}
}


//this.isSpacebar is the same as this.isSpacebar === true
Ghost.prototype.checkShooting = function(){
	if(this.isSpacebar && !this.isShooting){
		this.isShooting = true;
		this.bullets[this.currentBullet].fire(this.noseX, this.noseY);
		this.currentBullet++;
		if (this.currentBullet >= this.bullets.length) this.currentBullet = 0;
	}else if(!this.isSpacebar){
			this.isShooting = false;			
			}
	
}

Ghost.prototype.updateScore = function(points){
	this.score += points;
	updateHUD();
}


function clearCtxGhost() {
    ctxGhost.clearRect(0,0,gameWidth,gameHeight);
}

	// end of ghost functions
	
	
	
	//tear functions
	
function Bullet(j){
	this.Ghost = j;
	this.srcX = 217;
	this.srcY = 500;
	this.drawX = -20;
	this.drawY = 0;
	this.width = 5;
	this.height	= 5;
	this.explosion = new Explosion();
}

Bullet.prototype.draw = function () {
	this.drawX += 3;
    ctxGhost.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkHitEnemy();
	if(this.drawX > gameWidth) this.recycle();	
	
};

Bullet.prototype.fire = function (startX, startY) {
	this.drawX = startX;
	this.drawY = startY;	
}

Bullet.prototype.checkHitEnemy = function(){
	 for (var i = 0; i < enemies.length; i++){
		  if(this.drawX >= enemies[i].drawX &&
		  	 this.drawX <= enemies[i].drawX + enemies[i].width &&
			 this.drawY >= enemies[i].drawY &&
			 this.drawY <= enemies[i].drawY + enemies[i].height){
				 this.explosion.drawX = enemies[i].drawX - (this.explosion.width / 2);
				 this.explosion.drawY = enemies[i].drawY;
				 this.explosion.hasHit = true;
				 this.recycle();
				 enemies[i].recycleEnemy();
				 this.Ghost.updateScore(enemies[i].rewardPoints);
			 }
	 }
};

	
Bullet.prototype.recycle = function () {
	this.drawX = -20;
	
};
	
	
	
	//end of tear functions
	
	
	
	//explosion functions
	
	function Explosion(){
		this.srcX = 750;
		this.srcY = 500;
		this.drawX = 0;
		this.drawY = 0;
		this.width = 50;
		this.height	= 50;
		this.hasHit = false;
		this.currentFrame = 0;
		this.totalFrames = 3;
	}	
	
	
	Explosion.prototype.draw = function (){
		if(this.currentFrame <= this.totalFrames){
			ctxGhost.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
			this.currentFrame++;			
		}
		else {
			this.hasHit = false;
			this.currentFrame = 0;			
		}
};
	
	//end of explosion functions
	
	
	//enemy functions
	
	function Enemy() {
	this.srcX = 100;
	this.srcY = 500;
	this.width = 115;
	this.height = 100;
	this.speed = 2;
	this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
	this.drawY = Math.floor(Math.random() * 380);
	this.rewardPoints = 5;
	
	}
	
	
	
	Enemy.prototype.draw = function() {
	this.drawX -=this.speed;
    ctxEnemy.drawImage(imgSprite,this.srcX,this.srcY,this.width,this.height,this.drawX,this.drawY,this.width,this.height);
	this.checkEscaped();
	
};

	Enemy.prototype.checkEscaped = function(){
		if(this.drawX + this.width  <= 0){
		   this.recycleEnemy();
		}
	}
	
	Enemy.prototype.recycleEnemy = function(){
		this.drawX = Math.floor(Math.random() * 1000) + gameWidth;
		this.drawY = Math.floor(Math.random() * 380);
	}

function clearCtxEnemy() {
    ctxEnemy.clearRect(0,0,gameWidth,gameHeight);
}



	//end enemy functions	
	
	//button object
	
	function Button(xL, xR, yT, yB){
		this.xLeft = xL;
		this.xRight = xR;
		this.yTop = yT;
		this.yBottom = yB;	
	}
	
	Button.prototype.checkClicked = function(){
		if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) return true;
	}
	
	
	//end of button obj
	
	
	//event functions
	
	function mouseClicked(e){
		mouseX = e.pageX - canvasBg.offsetLeft;
		mouseY = e.pageY - canvasBg.offsetTop;
		if(!isPlaying){
			if(btnPlay.checkClicked()) playGame();
		}
				
	}
	
	


// e is a parameter
function checkKeyDown(e){
	var keyID = e.keyCode || e.which;
	if (keyID === 38 || keyID === 87) { /* 38 up arrow, 87  W key */
		Ghost1.isUpKey = true;		
		e.preventDefault();
	}
	if (keyID === 39 || keyID === 68) { /* 39 right arrow, 68  D key */
		Ghost1.isRightKey = true;
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83) { /* 40 down arrow, 83  S key */
		Ghost1.isDownKey = true;
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65) { /* 37 left arrow, 65  A key */
		Ghost1.isLeftKey = true;
		e.preventDefault();
	}
	if (keyID === 32) { /* 32 is spacebar! */
		Ghost1.isSpacebar = true;
		e.preventDefault();
	}
}

function checkKeyUp(e){
	var keyID = e.keyCode || e.which;
	if (keyID === 38 || keyID === 87) { /* 38 up arrow, 87  W key */
		Ghost1.isUpKey = false;
		e.preventDefault();
	}
	if (keyID === 39 || keyID === 68) { /* 39 right arrow, 68  D key */
		Ghost1.isRightKey = false;
		e.preventDefault();
	}
	if (keyID === 40 || keyID === 83) { /* 40 down arrow, 83  S key */
		Ghost1.isDownKey = false;
		e.preventDefault();
	}
	if (keyID === 37 || keyID === 65) { /* 37 left arrow, 65  A key */
		Ghost1.isLeftKey = false;
		e.preventDefault();
	}
	if (keyID === 32) { /* 32 is spacebar! */
		Ghost1.isSpacebar = false;
		e.preventDefault();
	}
}


	//end of event functions
	
	
	
