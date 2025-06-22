const config = {
  type: Phaser.AUTO,
  width: 1300,
  height: 750,
  backgroundColor: "#f0e6d6",
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let player;
let cursors;
let boostKey;
let sutraScroll;
let whiteBoneSpirit;
let score = 0;
let scoreText;
let gameOver = false;
let gameOverText;
let playTime = 0;
let timeText;
let timerEvent;
let playAgainButton;

const game = new Phaser.Game(config);

function preload() {
  this.load.image("tan-sanzang", "tan-sanzang.png");
  this.load.image("sutra-scrolls", "sutra-scrolls.png");
  this.load.image("white-bone-spirit", "white-bone-spirit.png");
  this.load.image("play-again", "play-again.png");
}

function create() {
  player = this.physics.add.sprite(200, 100, "tan-sanzang").setScale(0.05);
  player.setCollideWorldBounds(true);

  sutraScroll = this.physics.add.sprite(100, 100, "sutra-scrolls").setScale(0.05);

  whiteBoneSpirit = this.physics.add.sprite(300, 200, "white-bone-spirit").setScale(0.07);
  whiteBoneSpirit.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();
  boostKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "24px",
    fill: "#000",
    fontFamily: "Arial"
  });

  timeText = this.add.text(1100, 16, "time: 0s", {
    fontSize: "24px",
    fill: "#000",
    fontFamily: "Arial"
  });

  gameOverText = this.add.text(650, 300, "", {
    fontSize: "48px",
    fill: "#800000",
    fontFamily: "Arial"
  }).setOrigin(0.5);

  timerEvent = this.time.addEvent({
    delay: 1000,
    callback: updatePlayTime,
    callbackScope: this,
    loop: true
  });

  playAgainButton = this.add.sprite(650, 370, "play-again").setInteractive().setScale(0.15);
  playAgainButton.setVisible(false);

  playAgainButton.on("pointerdown", () => {
    restartGame.call(this);
  });
  playAgainButton.on("pointerover", () => playAgainButton.setScale(0.18));
  playAgainButton.on("pointerout", () => playAgainButton.setScale(0.15));

  this.physics.add.overlap(player, sutraScroll, collectSutraScroll, null, this);
  this.physics.add.overlap(player, whiteBoneSpirit, hitBySpirit, null, this);
}

function update() {
  if (gameOver) {
    player.setVelocity(0);
    whiteBoneSpirit.setVelocity(0);
    return;
  }

  player.setVelocity(0);
  let speed = 200;
  if (boostKey.isDown) {
    speed = 350;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.setVelocityY(speed);
  }

  this.physics.moveToObject(whiteBoneSpirit, player, 160);
}

function collectSutraScroll(player, sutraScroll) {
  score += 10;
  scoreText.setText("score: " + score);

  sutraScroll.disableBody(true, true);

  setTimeout(() => {
    const newX = Phaser.Math.Between(50, 1200);
    const newY = Phaser.Math.Between(50, 700);
    sutraScroll.enableBody(true, newX, newY, true, true);
  }, 500);
}

function hitBySpirit(player, whiteBoneSpirit) {
  gameOver = true;
  gameOverText.setText("GAME OVER!");
  timerEvent.remove();
  playAgainButton.setVisible(true);
}

function updatePlayTime() {
  if (!gameOver) {
    playTime += 1;
    timeText.setText("time: " + playTime + "s");
  }
}

function restartGame() {
  score = 0;
  playTime = 0;
  gameOver = false;
  gameOverText.setText("");
  scoreText.setText("score: 0");
  timeText.setText("time: 0s");
  playAgainButton.setVisible(false);

  player.setPosition(400, 300);
  whiteBoneSpirit.setPosition(100, 100);

  sutraScroll.enableBody(true, Phaser.Math.Between(50, 1200), Phaser.Math.Between(50, 700), true, true);

  timerEvent = this.time.addEvent({
    delay: 1000,
    callback: updatePlayTime,
    callbackScope: this,
    loop: true
  });
}
