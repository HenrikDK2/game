//Initialize
const app = new PIXI.Application({ antialias: true, transparent: 1 });
const graphics = new PIXI.Graphics();
let gravity = 1;
let playerVelocity = gravity;
let woodAmount = 0;
let playerSheet = {};
let treeSheet = {};
let tree;
let isAttack = false;
let player;
let playerFalling;
document.body.appendChild(app.view);

//Loading
function doneLoading(e) {
  createPlayerSheet();
  createPlayer();
  createWorld();
  app.ticker.add(gameLoop)
}

//Textures
app.loader.add('woodcutterIdleRight', '/images/woodcutter/woodcutter_idleRight.png');
app.loader.add('woodcutterAttack2', '/images/woodcutter/woodcutter_attack2.png');
app.loader.add('woodcutterAttack2Left', '/images/woodcutter/woodcutter_attack2Left.png');
app.loader.add('tree', '/images/tree.png');
app.loader.add('woodcutterIdleLeft', '/images/woodcutter/woodcutter_idleLeft.png');
app.loader.add('woodcutterWalkRight', '/images/woodcutter/Woodcutter_walkRight.png');
app.loader.add('woodcutterWalkLeft', '/images/woodcutter/Woodcutter_walkLeft.png');
app.loader.load(doneLoading)

//Movement
let keyState = {};
let lastKey;
document.addEventListener("keydown", checkKey);
document.addEventListener("keyup", checkKey);

function checkKey(e) {
  if (e.type === "keydown" && player.textures !== playerSheet.attack2) {
    keyState[e.keyCode || e.which] = true;
  } else {
    keyState[e.keyCode || e.which] = false;
    lastKey = e.keyCode;
  }
}

function movement() {
  if (playerFalling === false) {
    if (keyState[68]) {
      if (player.textures !== playerSheet.walkRight) {
        player.textures = playerSheet.walkRight;
        player.play();
      }
      player.x += 1;
    } else if (keyState[65]) {
      if (player.textures !== playerSheet.walkLeft) {
        player.textures = playerSheet.walkLeft;
        player.play();
      }
      player.x -= 1;
    } else {
      if (lastKey === 68 && player.textures !== playerSheet.idleRight && isAttack === false) {
        player.textures = playerSheet.idleRight;
        player.play();
      } else if (lastKey === 65 && player.textures !== playerSheet.idleLeft && isAttack === false) {
        player.textures = playerSheet.idleLeft;
        player.play();
      }
    }

    if (player.x < 0) player.x = app.view.width;
    else if (player.x > app.view.width) player.x = 0;
  }
}
console.log(lastKey)
//Actions
document.addEventListener('mousedown', (e) => {
  if (e.button === 0 && isAttack === false) {
    isAttack = true;
    if (lastKey === undefined || lastKey === 68) {
      player.textures = playerSheet.attack2;
    } else if (lastKey === 65) {
      player.textures = playerSheet.attack2Left;
    }
    player.loop = false;
    player.play();

    if (playerHitbox(tree, -15) === true) {
      woodAmount++;
    }
  }
})

//Collision
function playerBoxIntersect(box) {
  let ab = player.getBounds();
  let bb = box.getBounds();
  let result = ab.y + ab.height > bb.y && ab.y < bb.y + bb.height && ab.x + ab.width > bb.x && ab.x < bb.x + bb.width;

  if (result === false) {
    playerFalling = true;
    playerVelocity = playerVelocity * 1.01;
    player.y += playerVelocity;
  } else playerFalling = false;
}

function playerHitbox(object, range) {
  let ab = player.getBounds();
  let bb = object.getBounds();
  return ab.y + ab.height > bb.y && ab.y < bb.y + bb.height && ab.x + ab.width + range > bb.x && ab.x < bb.x + bb.width + range;
}

//Animations
function createPlayerSheet() {
  let sshetIdleRight = new PIXI.BaseTexture.from(app.loader.resources["woodcutterIdleRight"].url);
  let sshetIdleLeft = new PIXI.BaseTexture.from(app.loader.resources["woodcutterIdleLeft"].url);
  let sshetWalkRight = new PIXI.BaseTexture.from(app.loader.resources["woodcutterWalkRight"].url);
  let sshetWalkLeft = new PIXI.BaseTexture.from(app.loader.resources["woodcutterWalkLeft"].url);
  let sshetWalkAttack2 = new PIXI.BaseTexture.from(app.loader.resources["woodcutterAttack2"].url);
  let sshetWalkAttack2Left = new PIXI.BaseTexture.from(app.loader.resources["woodcutterAttack2Left"].url);
  let sshetTree = new PIXI.BaseTexture.from(app.loader.resources["tree"].url);

  treeSheet["tree"] = [
    new PIXI.Texture(sshetTree, new PIXI.Rectangle(0, 0, 64, 64))
  ]

  playerSheet["attack2Left"] = [
    new PIXI.Texture(sshetWalkAttack2Left, new PIXI.Rectangle(0, 0, 26, 34)),
    new PIXI.Texture(sshetWalkAttack2Left, new PIXI.Rectangle(26, 0, 26, 34)),
    new PIXI.Texture(sshetWalkAttack2Left, new PIXI.Rectangle(52, 0, 24, 34)),
    new PIXI.Texture(sshetWalkAttack2Left, new PIXI.Rectangle(76, 0, 22, 34)),
    new PIXI.Texture(sshetWalkAttack2Left, new PIXI.Rectangle(98, 0, 38, 34)),
    new PIXI.Texture(sshetWalkAttack2Left, new PIXI.Rectangle(136, 0, 22, 34))
  ];

  playerSheet["attack2"] = [
    new PIXI.Texture(sshetWalkAttack2, new PIXI.Rectangle(0, 0, 26, 34)),
    new PIXI.Texture(sshetWalkAttack2, new PIXI.Rectangle(26, 0, 26, 34)),
    new PIXI.Texture(sshetWalkAttack2, new PIXI.Rectangle(52, 0, 24, 34)),
    new PIXI.Texture(sshetWalkAttack2, new PIXI.Rectangle(76, 0, 22, 34)),
    new PIXI.Texture(sshetWalkAttack2, new PIXI.Rectangle(98, 0, 38, 34)),
    new PIXI.Texture(sshetWalkAttack2, new PIXI.Rectangle(136, 0, 22, 34))
  ];


  playerSheet["idleRight"] = [
    new PIXI.Texture(sshetIdleRight, new PIXI.Rectangle(0, 0, 26, 32)),
    new PIXI.Texture(sshetIdleRight, new PIXI.Rectangle(1 * 26, 0, 26, 32)),
    new PIXI.Texture(sshetIdleRight, new PIXI.Rectangle(2 * 26, 0, 26, 32)),
    new PIXI.Texture(sshetIdleRight, new PIXI.Rectangle(3 * 26, 0, 26, 32))
  ];

  playerSheet["idleLeft"] = [
    new PIXI.Texture(sshetIdleLeft, new PIXI.Rectangle(0, 0, 26, 32)),
    new PIXI.Texture(sshetIdleLeft, new PIXI.Rectangle(1 * 26, 0, 26, 32)),
    new PIXI.Texture(sshetIdleLeft, new PIXI.Rectangle(2 * 26, 0, 26, 32)),
    new PIXI.Texture(sshetIdleLeft, new PIXI.Rectangle(3 * 26, 0, 26, 32))
  ];

  playerSheet["walkRight"] = [
    new PIXI.Texture(sshetWalkRight, new PIXI.Rectangle(0, 0, 17, 34)),
    new PIXI.Texture(sshetWalkRight, new PIXI.Rectangle(18, 0, 14, 34)),
    new PIXI.Texture(sshetWalkRight, new PIXI.Rectangle(32, 0, 14, 34)),
    new PIXI.Texture(sshetWalkRight, new PIXI.Rectangle(46, 0, 26, 34)),
    new PIXI.Texture(sshetWalkRight, new PIXI.Rectangle(72, 0, 16, 34)),
    new PIXI.Texture(sshetWalkRight, new PIXI.Rectangle(88, 0, 13, 34))
  ];

  playerSheet["walkLeft"] = [
    new PIXI.Texture(sshetWalkLeft, new PIXI.Rectangle(0, 0, 13, 34)),
    new PIXI.Texture(sshetWalkLeft, new PIXI.Rectangle(13, 0, 16, 34)),
    new PIXI.Texture(sshetWalkLeft, new PIXI.Rectangle(29, 0, 26, 34)),
    new PIXI.Texture(sshetWalkLeft, new PIXI.Rectangle(55, 0, 14, 34)),
    new PIXI.Texture(sshetWalkLeft, new PIXI.Rectangle(70, 0, 14, 34)),
    new PIXI.Texture(sshetWalkLeft, new PIXI.Rectangle(84, 0, 17, 34))
  ]
}

//Create
function createWorld() {
  tree = new PIXI.AnimatedSprite(treeSheet.tree)
  tree.anchor.set(0.5);
  player.animationSpeed = .1;
  tree.x = 300;
  tree.y = app.view.height - 70;
  graphics.beginFill(0xDE3249);
  graphics.drawRect(0, app.view.height - 50, 800, 100);
  graphics.endFill();
  app.stage.addChild(graphics)
  app.stage.addChild(tree)
}

function createPlayer() {
  player = new PIXI.AnimatedSprite(playerSheet.idleRight);
  player.anchor.set(0.5);
  player.animationSpeed = .1;
  player.loop = true;
  player.x = app.view.width / 2;
  player.y = 20;
  app.stage.addChild(player);
  player.play();
}

//UI
const woodUi = new PIXI.Text(`WoodAmount: ${woodAmount}`);
woodUi.x = 5;
woodUi.y = 0;
app.stage.addChild(woodUi);

function updateUi() {
  woodUi.text = `WoodAmount: ${woodAmount}`;
}

//Update
function gameLoop() {
  updateUi();
  if (isAttack === true && !player.playing) {
    isAttack = false;
    player.loop = true;
  }
  playerBoxIntersect(graphics);
  movement();
}