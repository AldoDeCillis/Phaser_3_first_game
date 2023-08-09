window.onload = function () {
    let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        }
    }
    let game = new Phaser.Game(config);

    let bombCount = 0;
    let score = 0;
    let isJumping = false;

    function preload() {
        this.load.image('background', 'public/assets/background.jpg');
        this.load.image('star', 'public/assets/star.png');
        this.load.image('platform', 'public/assets/platform.png')
        this.load.image('bomb', 'public/assets/bomb.png')
        this.load.spritesheet('dude', 'public/assets/WalkComplete.png', { frameWidth: 67.5, frameHeight: 65 });
    }

    function create() {
        //Score Texts:

        let scoreText;

        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });

        //Victory Text
        let victoryText;

        this.add.image(400, 400, 'background');
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'platform').setScale(2).refreshBody();


        player = this.physics.add.sprite(100, 450, 'dude');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(100);


        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.overlap(player, stars, collectStar, null, this);

        function collectStar(player, star) {
            star.disableBody(true, true);
            score += 10;
            scoreText.setText('Score: ' + score);

            spawnBomb(player)

        }

        function spawnBomb(player) {
            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            if (bombCount < 2) {
                let bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bombCount++;
            }
        }

        // Enemy:
        bombs = this.physics.add.group();

        function hitBomb(player, bomb) {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
        }

        //colliders
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        //Creazione Animazioni
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 7, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 8 }],
            frameRate: 20
        })
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 9, end: 16 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'runRight',
            frames: this.anims.generateFrameNumbers('dude', { start: 26, end: 31 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'runLeft',
            frames: this.anims.generateFrameNumbers('dude', { start: 24, end: 19 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'jumpRight',
            frames: this.anims.generateFrameNumbers('dude', { start: 42, end: 47 }),
            frameRate: 10,
            repeat: 'no-repeat'
        })
        cursor = this.input.keyboard.createCursorKeys();
    }
    
    function update() {
        if (cursor.left.isDown) {
            if (cursor.shift.isDown) {
                player.setVelocityX(-300);
                player.anims.play('runLeft', true);
            } else {
                player.setVelocityX(-160);
                player.anims.play('left', true);
            }
        } else if (cursor.right.isDown) {
            if (cursor.shift.isDown) {
                player.setVelocityX(300);
                player.anims.play('runRight', true);
            } else {
                player.setVelocityX(160);
                player.anims.play('right', true);
            }
        } else {
            if (cursor.up.isDown) {
                if (!isJumping) {
                    player.anims.play('jumpRight', true);
                    isJumping = true;
                }
            } else {
                player.anims.play('turn', true);
            }
            player.setVelocityX(0);

        }

        if (cursor.up.isDown && player.body.touching.down) {

            player.setVelocityY(-160);
        }
        if (!cursor.up.isDown) {
            isJumping = false; // Resetta la variabile quando il tasto "up" non è premuto
        }

        if(score >= 120)
        {
            this.physics.pause();
            gameOver = true;
            victoryText = this.add.text(400,300,'HAI VINTO!', {fontSize: '50px', fill: '#fff'});

        }
    }
}