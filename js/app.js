// Enemies our player must avoid
var Enemy = function(speed, imageSprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -50; //starting position
    this.y = 70; //lane;
    this.charSpeed = speed; //speed passed in by function parameter
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = imageSprite;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    var sendTheBugs = Math.floor((Math.random() * 4) + 1);
    var lane = Math.floor((Math.random() * 3) + 1);
        this.x += this.charSpeed * dt; // setting enemies movement using their speed parameter
    if (this.x >= 510) { // when enemies reach the far right of canvas, send them again
        this.x = -50 * sendTheBugs; // to send enemies with random spacing
        this.x += this.charSpeed * dt;
        this.y = 70 * lane; // to send enemies from a random lane
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(heroX, heroY, imageSprite) {

    // define variables for player
    this.x = heroX;
    this.y = heroY;
    this.currentScore = 0;
    this.currentLives = 5;
    this.won = false;
    this.collision = false;
    this.width = 40;
    this.height = 40;
    this.sprite = imageSprite; // image used must be (listed) and loaded in engine.js
};

Player.prototype.update = function(dt) {

    this.x = this.x;
    this.y = this.y;

for (i = 0; i < allEnemies.length; i++) { // detect collision
    var myPlayer = {x: this.x, y: this.y, width: this.width, height: this.height}
    var bug = {x: allEnemies[i].x, y: allEnemies[i].y, width: 101, height: 60}

    if (myPlayer.x < bug.x + bug.width &&
        myPlayer.x + myPlayer.width > bug.x &&
        myPlayer.y < bug.y + bug.height &&
        myPlayer.height + myPlayer.y > bug.y) {
        player.reset();
        this.collision = true; // change value of collision variable
        this.currentScore--;
        this.currentLives--;
        }
    }
};

Player.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    player.score();
    player.lives();

    var screenMessage = function(text) { // generate screen message function
        var canvas = document.querySelector('canvas');
        ctx.font = '36pt impact';
        ctx.textAlign = 'center';

        ctx.fillStyle = "white";
        ctx.fillText(text, canvas.width/2, 300);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeText(text, canvas.width/2, 300);
    };

   if (this.won === true && this.x === 202 && this.y === 400) { // if player has won game and is in reset position display message
        var msg = 'WIN!';
        screenMessage(msg);
    } else if (this.collision === true && this.x === 202 && this.y === 400) { // if player has been hit by enemy and is in reset position display message
        msg = 'GOTCHA!'
        screenMessage(msg);
    } else {
        this.won = false; // resets value of won or collision back to false after win or collision
        this.collision = false;
    }

};

Player.prototype.handleInput = function(input) {

    var stepX = 101; // player footstep x axis
    var stepY = 85; // player footstep y axis

    switch (input) { // handle keyboard input

        case 'left':
            this.x = this.x - stepX; // left arrow key
            if (this.x < -0) { // run this if character tries to move out of bounds
                this.x = -0;
            }
            break;

        case 'right': // right arrow key
            this.x = this.x + stepX;
            if (this.x > 404) {
                this.x = 404;
            }
            break;

        case 'down': // down arrow key
            this.y = this.y + stepY;
            if (this.y > 400) {
                this.y = 400;
            }
            break;

        case 'up': // up arrow key
            this.y = this.y - stepY;
            if (this.y < -10) {
                this.y = -10;
                this.currentScore++;
                this.won = true; // change value of won variable
                player.reset();
            }
            break;
        }
};

Player.prototype.reset = function() { // reset x and y to start position if player wins game or collision occurs
    this.x = 202;
    this.y = 400;
};

Player.prototype.score = function() {
    var align = 'left';
    var text = 'Score: ';
    var xAxis = 50;
    if (this.currentScore >= 1) {
        var scored = this.currentScore;
    } else {
        this.currentScore = 0; // prevents score counting down below 0
        scored = this.currentScore;
    }

    player.gameData(text, scored, align, xAxis);
};

Player.prototype.lives = function() {
    var align = 'right';
    var text = 'Lives: ';
    var xAxis = 450;
    if (this.currentLives >= 1) {
        var lives = this.currentLives;
    } else {
        this.currentLives <= 0; // prevents score counting down below 0
        lives = '';
        text = 'GAME OVER!'; //TODO add game over function, restart game
        var canvas = document.querySelector('canvas');
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        //document.location.reload(); // reloads page
    }

    player.gameData(text, lives, align, xAxis);
};

Player.prototype.gameData = function(text, type, align, xAxis) { // shared function prints score and lives data to canvas

    ctx.font = "24pt impact";
    ctx.textAlign = align;

    ctx.fillStyle = "white";
    ctx.fillText(text + type, xAxis, 100);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(text + type, xAxis, 100);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var enemyOne = new Enemy(100, 'images/enemy-bug.png');
var enemyTwo = new Enemy(150, 'images/enemy-bug.png'); // 200
var enemyThree = new Enemy(200, 'images/enemy-bug.png'); // 300
var enemyFour = new Enemy(400, 'images/enemy-bug.png'); // 600
var allEnemies = [enemyOne, enemyTwo, enemyThree, enemyFour];

// Place the player object in a variable called player
var player = new Player(202, 400, 'images/char-horn-girl.png');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
