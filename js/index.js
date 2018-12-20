import GameScene from './game-scene.js';

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game-container',
	pixelArt: true,
	scene: [GameScene],
	physics: {
		default: "arcade",
		arcade: {
		  gravity: { y: 0 }
		}
	}
};

const game = new Phaser.Game(config);
