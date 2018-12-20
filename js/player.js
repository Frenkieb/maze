/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
export default class Player {
	constructor(scene, x, y) {
		this.scene = scene;
		this.cursors = this.scene.input.keyboard.createCursorKeys();

		// Create the animations we need from the player spritesheet
		const anims = scene.anims;

		if (typeof anims.get('player_left') == 'undefined' ) {
			anims.create({
				key: 'player_left',
				frames: anims.generateFrameNumbers('player', { start: 12, end: 17 }),
				frameRate: 10,
				repeat: -1
			});


			anims.create({
				key: 'player_right',
				frames: anims.generateFrameNumbers('player', { start: 18, end: 23 }),
				frameRate: 10,
				repeat: -1
			});

			anims.create({
				key: 'player_up',
				frames: anims.generateFrameNumbers('player', { start: 0, end: 5 }),
				frameRate: 10,
				repeat: -1
			});

			anims.create({
				key: 'player_down',
				frames: anims.generateFrameNumbers('player', { start: 6, end: 11 }),
				frameRate: 10,
				repeat: -1
			});

			anims.create({
				key: 'player_idle',
				frames: anims.generateFrameNumbers('player', { start: 24, end: 29 }),
				frameRate: 10,
				repeat: -1
			});
		}

		this.sprite = scene.physics.add.sprite(x, y, 'player');
	}

	update() {
		const speed = 200;

		// Stop any previous movement from the last frame.
		this.sprite.body.setVelocity(0);

		if (this.cursors.left.isDown) {
			this.sprite.body.setVelocityX(-speed);
			//this.sprite.setX(this.sprite.x - 32);
			this.sprite.anims.play('player_left', true);
		} else if (this.cursors.right.isDown) {
			this.sprite.body.setVelocityX(speed);
			this.sprite.anims.play('player_right', true);
		} else if (this.cursors.up.isDown) {
			this.sprite.body.setVelocityY(-speed);
			this.sprite.anims.play('player_up', true);
		} else if (this.cursors.down.isDown) {
			this.sprite.body.setVelocityY(speed);
			this.sprite.anims.play('player_down', true);
		} else {
			this.sprite.anims.play('player_idle', true);
		}

		// Normalize and scale the velocity so that player can't move faster along a diagonal
		this.sprite.body.velocity.normalize().scale(speed);
	}

	destroy() {
		this.sprite.destroy();
	}
}
