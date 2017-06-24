var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameCanvas',
    {preload: preload, create: create, update: update});

function preload() {

    game.load.image("background", "res/background.jpg");
    game.load.image("paddle", "res/paddle.jpg");
    game.load.image("ball", "res/ball.png");
    game.load.image("food", "res/bricks.jpg");
    game.load.audio('hitbrick', 'res/hitbrick.wav');
    game.load.audio("bgMusic", "res/backgroundMusic.mp3");
}
var paddle;
var ball;
var bricks;

var lives = 3;
var score = 0;

var scoreText;
var livesText;
var introText;


var hitBrickSound;
var bgMusic;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    var background = game.add.sprite(0, 0, "background");
    game.physics.arcade.checkCollision.down = false;
    paddle = game.add.sprite(game.world.centerX, 550, "paddle");
    paddle.anchor.set(0.5, 0.5);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

    ball = game.add.sprite(game.world.centerX, 500, "ball");
    ball.checkWorldBounds = true;
    ball.anchor.set(0.5, 0.5);
    ball.scale.set(0.5, 0.5);

    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);


    ball.events.onOutOfBounds.add(ballLost, this);
    game.input.onDown.add(launchBall, this);


    bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;

    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 15; x++) {
            brick = bricks.create(120 + (x * 36), 100 + (y * 52), 'food');
            brick.scale.set(0.15);
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }


    scoreText = game.add.text(32, 550, 'score: 0', {font: "20px Arial", fill: "#ffffff", align: "left"});
    livesText = game.add.text(680, 550, 'lives: 3', {font: "20px Arial", fill: "#ffffff", align: "left"});
    introText = game.add.text(game.world.centerX, 400, '- click to start -', {
        font: "40px Arial",
        fill: "#ffffff",
        align: "center"
    });
    introText.anchor.setTo(0.5, 0.5);


    hitBrickSound = game.add.audio('hitbrick');
    bgMusic = game.add.audio('bgMusic');
    bgMusic.play();


    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.input.onDown.add(gofull, this);


}
function gofull() {

    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen();
    }
    else {
        game.scale.startFullScreen(false);
    }

}
var bHasLaunch = false;

function update() {
    paddle.x = game.input.x;
    if (bHasLaunch) {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
    }
}


function launchBall() {

    if (!bHasLaunch) {
        bHasLaunch = true;
        ball.body.velocity.y = -250;
        ball.body.velocity.x = 75;
        // ball.animations.play('spin');
        introText.visible = false;
    }

}


function ballLost() {

    lives--;
    livesText.text = 'lives: ' + lives;

    if (lives === 0) {
        gameOver();
    }
    else {
        bHasLaunch = false;

        ball.reset(paddle.body.x + 16, paddle.y - 16);

        ball.animations.stop();
    }

}

function ballHitBrick(_ball, _brick) {

    _brick.kill();

    score += 10;
    hitBrickSound.play();
    scoreText.text = 'score: ' + score;

    //  Are they any bricks left?
    if (bricks.countLiving() == 0) {
        //  New level starts
        score += 1000;
        scoreText.text = 'score: ' + score;
        introText.text = '- Next Level -';

        //  Let's move the ball back to the paddle
        ballOnPaddle = true;
        ball.body.velocity.set(0);
        ball.x = paddle.x + 16;
        ball.y = paddle.y - 16;
        ball.animations.stop();

        //  And bring the bricks back from the dead :)
        bricks.callAll('revive');
    }

}

// function ballReset() {
//     bHasLaunch = false;
//     ball.reset(paddle.body.x, paddle.body.y - 20);
// }

function ballHitPaddle(p_ball, p_paddle) {
    var diff = 0;
    if (p_ball.x < p_paddle.x) {
        diff = p_paddle.x - p_ball.x;
        p_ball.body.velocity.x = (-10 * diff);
    } else if (p_ball.x > p_paddle.x) {
        diff = p_ball.x - p_paddle.x;
        p_ball.body.velocity.x = (10 * diff);
    } else {
        p_ball.body.velocity.x = 2 + Math.random() * 8;
    }
}


function gameOver() {

    ball.body.velocity.setTo(0, 0);

    introText.text = 'Game Over!';
    introText.visible = true;
    //
    // var request = new XMLHttpRequest();
    // request.open('POST', '/my/url', true);
    // request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    // request.send(data);
}





















