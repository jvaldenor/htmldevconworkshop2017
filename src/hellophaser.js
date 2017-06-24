var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameCanvas',
    {preload: preload, create: create, update: update});

function preload() {

    game.load.image("background", "res/background.jpg");
    game.load.image("paddle", "res/paddle.jpg");
    game.load.image("ball", "res/ball.png");
}
var paddle;
var ball;

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


    ball.events.onOutOfBounds.add(ballReset, this);
    game.input.onDown.add(launchBall, this);


    bricks=game.add.group();
    bricks.enableBody=true;
    bricks.physicsBodyType=Phaser.Physics.ARCADE;
    var bricksPreFab;
    var rowCount=4;
    var columnCount=8;

    for(var y;y<rowCount;y++){
        for(var x=0;x<columnCount;x++){
            bricksPreFab=bricks.create(0,0,"bricks");
            bricksPreFab.body.bounce.set(1);
            bricksPreFab.body.immovable=true;
        }
    }

}
var bHasLaunch = false;

function update() {
    paddle.x = game.input.x;
    if (bHasLaunch) {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
    }
}


function launchBall() {

    if (!bHasLaunch) {
        bHasLaunch = true;
        ball.body.velocity.y = -250;
        ball.body.velocity.x = 75;
    }

}


function ballReset() {
    bHasLaunch = false;
    ball.reset(paddle.body.x, paddle.body.y - 20);
}

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
























