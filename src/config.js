const config = {
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

let bombCount = 0;
let score = 0;
let isJumping = false;

export {config, bombCount, score, isJumping}