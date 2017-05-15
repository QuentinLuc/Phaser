// Preload function
function preload() {
    game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';

    game.load.image('phaser', 'sprites/phaser-dude.png');

    game.load.image('orb','sprites/orb-blue.png'); 
    
    var frame0 = [
	    '................',
	    '00..0.00...000..',
	    '0.0...0.0..0..0.',
	    '0.0.0.0.0..0...0',
	    '00..0.00...0...0',
	    '0.0.0.0.0..0...0',
	    '0.0.0.0..0.0..0.',
	    '000.0.0..0.000..'
    ];
    game.create.texture('gd', frame0, 4, 4, 0);

    var wall = ['FFFF','FFFF','FFFF','FFFF','FFFF','FFFF','FFFF','FFFF'];
    game.create.texture('wall', wall, 48, 48, 0);

    var frame1 = [
	    '5533',
	    '5533',
	    '3355',
	    '3355'
    ];

    game.create.texture('Fond', frame1, 48, 48, 0);
    game.load.image('buton',' sprites/orb-blue.png');
}

// Create function

var sprite;

var buton;
var wallSize = 96;
var triggers;
var jump = -400;
var scoreTxt;
var score = 0;
var upKey;
var downKey;
var leftKey;
var rightKey;
var walls;
var lostTxt;

var orb;

function create() {
    game.physics.startSystem(Phaser.Physics.Arcade);
    game.physics.arcade.gravity.y = 1000;
    game.stage.backgroundColor = "#000";
    game.add.tileSprite(0, 0, 800, 600, 'Fond');
    scoreTxt = game.add.text(20, 100, "score : " + score, {fill : "#FFFFFF", font : "16px trebuchet ms", align:"center" });
    lostTxt = game.add.text(100, 275, "", {fill : "#FFFFFF", font : "50px trebuchet ms", align : "center" });
    
    sprite = game.add.sprite(300, 300, 'gd');
    game.physics.arcade.enable(sprite);
    sprite.body.collideWorldBounds = true;
    sprite.anchor.setTo(0.5, 0.5);
    
    sprite.isCrossing = false;
    sprite.hasCrossed = false;
    
    //  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    orb = game.add.sprite(300, 75, 'orb');
    game.physics.arcade.enable(orb);
    orb.body.allowGravity = false;
    orb.anchor.setTo(0.5, 0.5)
    
    walls = game.add.group();
    walls.add(game.add.tileSprite(1050, 0, wallSize, 300, 'wall'));
    walls.add(game.add.tileSprite(1050, 500, wallSize, 600, 'wall'));
    walls.add(game.add.tileSprite(1400, 0, wallSize, 100, 'wall'));
    walls.add(game.add.tileSprite(1400, 300, wallSize, 600, 'wall'));
    walls.add(game.add.tileSprite(1750, 0, wallSize, 100, 'wall'));
    walls.add(game.add.tileSprite(1750, 400, wallSize, 600, 'wall'));
    
    game.physics.arcade.enable(walls);
    walls.setAll('body.allowGravity', false);
    walls.setAll('body.collideWorldBounds', false);
    
    triggers = game.add.group();
    triggers.add(game.add.sprite(1050, 300, null));
    triggers.add(game.add.sprite(1400, 100, null));
    triggers.add(game.add.sprite(1750, 200, null));
    
    game.physics.arcade.enable(triggers);
    triggers.setAll('body.allowGravity', false);
    triggers.setAll('body.collideWorldBounds', false);
    
    triggers.forEach(giveSize);
}

function giveSize(item)
{
    item.body.setSize(100, 200);   
}

// Update function

var gameover = false;

function update() {
    if(!gameover)
    {
        checkKeys();
        game.physics.arcade.overlap(sprite, orb, eat, null, this);
        
        sprite.hasCrossed = true;
        
        game.physics.arcade.collide(sprite, walls, pafLePiaf);
        game.physics.arcade.overlap(sprite, triggers, reset);
    
        if(sprite.isCrossing && sprite.hasCrossed)
        {
            score = score+1;
            scoreTxt.text = "score:" + score;
            sprite.isCrossing = false;
            sprite.hasCrossed = false;
        }
    
        walls.forEach(moveWalls);
        triggers.forEach(moveWalls);
    }
}

function eat(spriteA, spriteB)
{
    var newX = game.rnd.integerInRange(50, 750);
    var newY = game.rnd.integerInRange(50, 500);
    
    spriteB.reset(newX,newY)
    score = score + 1;
    scoreTxt.text = "score :" + score;
}

function checkKeys()
{
	sprite.body.velocity.x = 0;
    if (upKey.isDown)
    {
        sprite.body.velocity.y = jump;
    }
    
    if (leftKey.isDown)
    {
        sprite.body.velocity.x = -100;
    }
    else if (rightKey.isDown)
    {
        sprite.body.velocity.x = 100;
    }
}

function moveWalls(item)
{
    item.body.velocity.x = -100;
    
    if(item.x <= -100)
    {
        item.x = 1050;
    }
}

function pafLePiaf(sprite,wall)
{
    gameover = true;
    game.physics.arcade.disable(sprite);
}

function reset(player, trigger)
{
    sprite.hasCrossed = false;
    sprite.isCrossing = true;
}

function retry(){
    score = 0;
    scoreTxt.text = "score:" + score;
    lostTxt.text = "";
    gameover = false;
}
