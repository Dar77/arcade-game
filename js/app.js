// Enemy class
var Enemy = function(speed, imageSprite) {

    this.x = -50; //starting position
    this.y = 70; // was 70 - lane;
    this.charSpeed = speed; //speed passed in by function parameter
    this.sprite = imageSprite;
};

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var sendTheBugs = Math.floor((Math.random() * 4) + 1);
    var lane = Math.floor(Math.random() * 4); // random number between 0 and 4
        this.x += this.charSpeed * dt; // setting enemies movement using their speed parameter
    if (this.x >= 700) { // when enemies reach the far right of canvas, send them again
        this.x = -50 * sendTheBugs; // to send enemies with random spacing
        this.x += this.charSpeed * dt;
        this.y = (77 * lane) + 154; // to send enemies from a random lane, first lane location at 154 y-axis
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, imageSprite) {

    this.x = x;
    this.y = y;
    this.currentScore = 0; // starting score
    this.roadCross = 0; // starting road cross count
    this.currentLives = 5; // starting lives count
    this.won = false;
    this.collision = false;
    this.grab = false;
    this.fall = false;
    this.meetObstacle = false;
    this.width = 40;
    this.height = 40;
    this.sprite = imageSprite; // image used must be (listed) and loaded in engine.js
};

Player.prototype.update = function(dt) {

    this.x = this.x;
    this.y = this.y;
    this.checkEnemyCollision();
    this.checkItemCollection();
};

Player.prototype.checkEnemyCollision = function() {

    for (i = 0; i < allEnemies.length; i++) { // detect collision with enemies
        var bug = {x: allEnemies[i].x, y: allEnemies[i].y, width: 70, height: 60};
        var checkCollision = this.x < bug.x + bug.width && this.x + this.width > bug.x &&
                             this.y < bug.y + bug.height && this.height + this.y > bug.y;
        if (checkCollision) {
            this.reset();
            this.collision = true; // change value of collision variable
            this.currentScore--; // reduce score by 1 after collision
            this.currentLives--; // reduce lives by 1 after a collision
        }
    }
};

Player.prototype.checkItemCollection = function() {

    for (i = 0; i < allItems.length; i++) { // detect collision with pick up items
        var item = {x: allItems[i].x, y: allItems[i].y, width: 50, height: 60};
        var checkGrab = this.x < item.x + item.width && this.x + this.width > item.x &&
                        this.y < item.y + item.height && this.height + this.y > item.y;
        if (checkGrab) {
            allItems[i].x = 700; // grab pick up by moving its position off screen
            this.grab = true;
            this.currentLives += allItems[i].lifeIncrease; // add items life value to player lives total
            this.currentScore += allItems[i].scoreIncrease; // add items point value to score
        }
    }
};

Player.prototype.render = function() {

    var msg;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.score(); // update score
    this.crossed(); // update road crosses
    this.lives(); // update lives
    // this section contains the logic for screen messages
    if (this.won === true && this.x === 303 && this.y === 485) { // if player has crossed road and is in reset position display message
        msg = 'YOU MADE IT!';
        this.screenMessage(msg, 300);
    } else if (this.collision === true && this.x === 303 && this.y === 485) { // if player has been hit by enemy and is in reset position display message
        msg = 'GOT YOU!';
        this.screenMessage(msg, 300);
    } else if (this.grab === true && this.y <= 400 && this.y > -17) { // if player is on the road or higher
        msg = 'PICK UP!';
        this.screenMessage(msg, 300);
    } else if (this.fall === true && this.x === 303 && this.y === 485) { // if player has fallen down hole and is in reset position
        msg = 'WATCH FOR HOLES!';
        this.screenMessage(msg, 300);
    } else {
        this.won = false; // resets value of won, collision, grab and fall back to false after win, collision or grab
        this.collision = false;
        this.grab = false;
        this.fall = false;
    }
};

Player.prototype.handleInput = function(input) {

    var stepX = 101; // player movement x axis
    var stepY = 85; // player movement y axis
    var actionX = this.x;
    var actionY = this.y;

    switch (input) { // handle keyboard input

        case 'left': // left arrow key
            this.x = this.x - stepX;
            if (this.x < -0) { // run this if character tries to move out of bounds
                this.x = -0;
            }
            break;

        case 'right': // right arrow key
            this.x = this.x + stepX;
            if (this.x > 606) { // run this if character tries to move out of bounds
                    this.x = 606;
            }
            break;

        case 'down': // down arrow key
            this.y = this.y + stepY;
                if (this.y > 485) { // run this if character tries to move out of bounds
                    this.y = 485;
            }
            break;

        case 'up': // up arrow key
            this.y = this.y - stepY;
            if (this.y <= 0) { // run this if character reaches the top of screen
                this.currentScore++; // win - player has crossed the road - 1 point
                this.roadCross++; // road cross- increase crossed count
                this.won = true; // change value of won variable
                this.reset();
            }
            break;
    }
    this.checkForObstacle(actionX, actionY);
};

Player.prototype.checkForObstacle = function(actionX, actionY) { // handles player meeting obstacles

    for (i = 0; i < allObstacles.length; i++) { // detect collision with obstacle
        var obstacle = {x: allObstacles[i].x, y: allObstacles[i].y, width: 30, height: 30};
        var checkObstacle = this.x < obstacle.x + obstacle.width && this.x + this.width > obstacle.x &&
                            this.y < obstacle.y + obstacle.height && this.height + this.y > obstacle.y;
        if (checkObstacle) { // if player meets obstacle
            this.x = actionX;
            this.y = actionY;
            if (allObstacles[i] instanceof Hole) { // if obstacle is a Hole
                this.fall = true;
                this.currentLives--; // if player falls into hole, take one life
                this.reset();
            }
        }
    }
};

Player.prototype.reset = function() { // reset x and y to start position if player falls in hole or collision occurs

    this.x = 303;
    this.y = 485;
};

Player.prototype.screenMessage = function(text, y) { // generate screen messages

    ctx.font = '36pt impact';
    ctx.textAlign = 'center';
    ctx.fillStyle = "white";
    ctx.fillText(text, canvas.width/2, y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeText(text, canvas.width/2, y);
};

Player.prototype.score = function() { // generates current score

    var scored;
    var xAxis = 50;
    var align = 'left';
    var text = 'Score: ';
    var color = 'white';

    if (this.currentScore >= 1 && this.currentScore < 50) {
        scored = this.currentScore;
    } else if (this.currentScore >= 50 && this.roadCross >= 15) { // if current score reaches 50+ and road crosses reach 15 player wins game
        scored = this.currentScore;
        $('.game-info-5').addClass('show'); // add class to show div
        $('.show').removeClass('game-info-5'); // remove class that hides div
        $('#newGame').click(function() { // click button to reload page, restart game
            document.location.reload();
        });
    } else if (this.currentScore >= 50) { // changes text color if target score is reached but other target hasn't been reached
        scored = this.currentScore;
        text = '50+ ';
        color = '#2196f3';
    } else {
        this.currentScore = 0; // prevents score counting down below 0
        scored = this.currentScore;
    }
    this.gameData(text, scored, align, xAxis, color); // send score to game data
};

Player.prototype.crossed = function() { // handles current number of times player has crossed road

    var cross;
    xAxis = 350;
    align = 'center';

    if (this.roadCross >= 15 && this.currentScore <= 50) { // changes text color if target road cross is reached but other target hasn't been reached
        cross = this.roadCross;
        text = '15+ ';
        color = '#2196f3';
    } else {
        text = 'Crossed Road: ';
        color = 'white';
        cross = this.roadCross;
    }
    this.gameData(text, cross, align, xAxis, color); // send road cross to game data
};

Player.prototype.lives = function() { // handles players lives data and 'game over' screen

    var lives;
    xAxis = 654;
    align = 'right';

    if (this.currentLives >= 2) {
        lives = this.currentLives;
        text = 'Lives: ';
        color = 'white';
    } else if (this.currentLives === 1) { // changes text and text color if lives are reduced to 1 life
        lives = this.currentLives;
        text = 'Only: ';
        color = 'red';
    } else { // if current lives reaches 0, game over screen is displayed
        this.currentLives = 0; // prevents lives counting down below 0
        $('.game-info-4').addClass('show');
        $('.show').removeClass('game-info-4');
        $('#replayGame').click(function() {
            document.location.reload();
        });
    }
    this.gameData(text, lives, align, xAxis, color);
};

Player.prototype.gameData = function(text, type, align, xAxis, color) { // prints score, road cross and lives data to canvas

    ctx.font = '24pt impact';
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.fillText(text + type, xAxis, 100);
    ctx.strokeStyle = '#3434f8';
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
    lane = Math.floor(Math.random() * 4);
    this.x += this.itemSpeed * dt; // send the pick up items across the screen
    if (this.x >= 700) { // send them all again
        this.x = -700 * sendItems;
        this.x += this.itemSpeed * dt;
        this.y = (77 * lane) + 154;
    }
};

Item.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Obstacle class
var Obstacle = function(x, y) {

    this.x = x;
    this.y = y;
};

Obstacle.prototype.update = function() {

    this.x = this.x;
    this.y = this.y;
};

Obstacle.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Rock obstacle subclass
var Rock = function(x, y) {

    Obstacle.call(this, x, y);
    this.sprite = 'images/rock-1.png';
};

Rock.prototype = Object.create(Obstacle.prototype);
Rock.prototype.constructor = Obstacle;

// Hole obstacle subclass
var Hole = function(x, y) {

    Obstacle.call(this, x, y);
    this.sprite = 'images/hole.png';
};

Hole.prototype = Object.create(Obstacle.prototype);
Hole.prototype.constructor = Obstacle;



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var enemyOne = new Enemy(100, 'images/enemy-bug.png'); // parameters: speed, image
var enemyTwo = new Enemy(150, 'images/enemy-bug.png');
var enemyThree = new Enemy(200, 'images/enemy-bug.png');
var enemyFour = new Enemy(400, 'images/orc-racer.png');
var allEnemies = [enemyOne, enemyTwo, enemyThree, enemyFour];

// Place the player object in a variable called player
var player = new Player(303, 485, "images/char-horn-girl.png"); // parameters: x-position, y-position, image

// Item objects, pick ups
var blueGem = new Item(1, 0, 90, 'images/gem-blue.png'); // parameters: points, life, speed, image
var greenGem = new Item(2, 0, 100, 'images/gem-green.png');
var orangeGem = new Item(3, 0, 110, 'images/gem-orange.png');
var key = new Item(4, 0, 120, 'images/key.png');
var star = new Item(5, 0, 200, 'images/star.png');
var heart = new Item(0, 1, 200, 'images/heart-1.png');
var allItems = [blueGem, greenGem, orangeGem, key, star, heart];

// Rock subclass objects, obstacle
var rock1 = new Rock(202, 400); // parameters: x-position, y-position
var rock2 = new Rock(404, 485);
var rock3 = new Rock(303, 400);
var rock4 = new Rock(0, 60);
var rock5 = new Rock(202, 60);
var rock6 = new Rock(505, 60);
// Hole subclass objects, obstacles
var hole1 = new Hole(606, 485);
var hole2 = new Hole(303, 230);
var hole3 = new Hole(101, 60);
var allObstacles = [rock1, rock2, rock3, rock4, rock5, rock6, hole1, hole2, hole3];

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