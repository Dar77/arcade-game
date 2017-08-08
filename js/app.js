// Enemies our player must avoid
var Enemy = function(speed, imageSprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -50; //starting position
    this.y = 70; // was 70 - lane;
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
        this.y = 70 * lane; // was 70 - to send enemies from a random lane
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, imageSprite) {

    // define variables for player
    this.x = x;
    this.y = y;
    this.currentScore = 0;
    this.currentLives = 5;
    this.won = false;
    this.collision = false;
    this.grab = false;
    this.width = 40;
    this.height = 40;
    this.sprite = imageSprite; // image used must be (listed) and loaded in engine.js
};

Player.prototype.update = function() {

    this.x = this.x;
    this.y = this.y;

for (i = 0; i < allEnemies.length; i++) { // detect collision with enemies
    var myPlayer = {x: this.x, y: this.y, width: this.width, height: this.height};
    var bug = {x: allEnemies[i].x, y: allEnemies[i].y, width: 70, height: 60};
    var checkCollision = myPlayer.x < bug.x + bug.width && myPlayer.x + myPlayer.width > bug.x &&
                         myPlayer.y < bug.y + bug.height && myPlayer.height + myPlayer.y > bug.y;
    if (checkCollision) {
        player.reset();
        this.collision = true; // change value of collision variable
        this.currentScore--; // reduce score by 1 after collision
        this.currentLives--; // reduce lives by 1 after a collision
        }
    }

for (i = 0; i < allItems.length; i++) { // detect collision with pick up items
    var item = {x: allItems[i].x, y: allItems[i].y, width: 50, height: 60};
    var grab = function() {allItems[i].x = 520;}; // grab pick up by moving its position off screen
    var checkGrab = myPlayer.x < item.x + item.width && myPlayer.x + myPlayer.width > item.x &&
                    myPlayer.y < item.y + item.height && myPlayer.height + myPlayer.y > item.y;
    if (checkGrab) {
            grab();
            this.grab = true;
            this.currentLives += allItems[i].lifeIncrease; // add items life value to player lives total
            this.currentScore += allItems[i].scoreIncrease; // add items point value to score
        }
    }
};

Player.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    player.score();
    player.lives();

   if (this.won === true && this.x === 202 && this.y === 400) { // if player has won game and is in reset position display message
        var msg = 'WIN!';
        player.screenMessage(msg, 300);
    } else if (this.collision === true && this.x === 202 && this.y === 400) { // if player has been hit by enemy and is in reset position display message
        msg = 'GOT YOU!'
        player.screenMessage(msg, 300);
    } else if (this.grab === true && this.y <= 310 && this.y > -10) { // if player is on the road or sea but not the grass
        msg = 'PICK UP!';
        player.screenMessage(msg, 300);
    } else {
        this.won = false; // resets value of won, collision or grab back to false after win, collision or grab
        this.collision = false;
        this.grab = false;
    }
};

Player.prototype.handleInput = function(input) {

    var stepX = 101; // player movement x axis
    var stepY = 85; // player movement y axis

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
                this.currentScore++; // win - player has crossed the road - 1 point
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

Player.prototype.screenMessage = function(text, y) { // generate screen messages

    var canvas = document.querySelector('canvas');
    ctx.font = '36pt impact';
    ctx.textAlign = 'center';
    ctx.fillStyle = "white";
    ctx.fillText(text, canvas.width/2, y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeText(text, canvas.width/2, y);
};

Player.prototype.score = function() { // generates current score

    var align = 'left';
    var text = 'Score: ';
    var xAxis = 50;
    if (this.currentScore >= 1) {
        var scored = this.currentScore;
    } else {
        this.currentScore = 0; // prevents score counting down below 0
        scored = this.currentScore;
    }
    player.gameData(text, scored, align, xAxis); // send score to game data
};

Player.prototype.lives = function() { // handles players lives data and 'game over' screen

    align = 'right';
    text = 'Lives: ';
    xAxis = 450;
    if (this.currentLives >= 1) {
        var lives = this.currentLives;
    } else {
        this.currentLives = 0; // prevents lives counting down below 0
        lives = '';
        text = 'click to replay';

        var canvas = document.querySelector('canvas'); // paint canvas black on game over
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,canvas.width,canvas.height);

        msg = 'GAME OVER!'
        player.screenMessage(msg, 400); // game over message

        var newGame = function() {  // reload page
            document.location.reload();
        };
        canvas.addEventListener('click', newGame); // for new game click screen
    }

    player.gameData(text, lives, align, xAxis);
};

Player.prototype.gameData = function(text, type, align, xAxis) { // prints score and lives data to canvas

    ctx.font = '24pt impact';
    ctx.textAlign = align;

    ctx.fillStyle = "white";
    ctx.fillText(text + type, xAxis, 100);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(text + type, xAxis, 100);
};

// Item pick up class
var Item = function(points, life, speed, imageSprite) {

    this.y = 700;
    this.x = -50;
    this.itemSpeed = speed;
    this.scoreIncrease = points;
    this.lifeIncrease = life;
    this.sprite = imageSprite;
};

Item.prototype.update = function(dt) {

    var sendItems = Math.floor((Math.random() * 4) + 1);
    lane = Math.floor((Math.random() * 3) + 1);
    this.x += this.itemSpeed * dt; // send the pick up items across the screen
    if (this.x >= 510) { // send them all again
        this.x = -500 * sendItems;
        this.x += this.itemSpeed * dt;
        this.y = 70 * lane;
    }
};

Item.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var enemyOne = new Enemy(100, 'images/enemy-bug.png'); // parameters: speed, image
var enemyTwo = new Enemy(150, 'images/enemy-bug.png');
var enemyThree = new Enemy(200, 'images/enemy-bug.png');
var enemyFour = new Enemy(400, 'images/orc-racer.png');
var allEnemies = [enemyOne, enemyTwo, enemyThree, enemyFour];

// Place the player object in a variable called player
var player = new Player(202, 400, 'images/char-horn-girl.png'); // parameters: x-position, y-position, image

// Item objects, pick ups
var blueGem = new Item(1, 0, 90, 'images/gem-blue.png'); // parameters: points, life, speed, image
var greenGem = new Item(2, 0, 100, 'images/gem-green.png');
var orangeGem = new Item(3, 0, 110, 'images/gem-orange.png');
var key = new Item(4, 0, 120, 'images/Key.png');
var star = new Item(5, 0, 200, 'images/Star.png');
var heart = new Item(0, 1, 200, 'images/heart.png');
var allItems = [blueGem, greenGem, orangeGem, key, star, heart];

// Rock object, obstacle
//var rock = new Rock('Rock.png');


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
