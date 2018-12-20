// https://labs.phaser.io/edit.html?src=src\scenes\passing%20data%20to%20a%20scene.js

import Player from './player.js';

export default class GameScene extends Phaser.Scene {
	init(data) {
		if (data.hasOwnProperty( 'mazeSize' )) {
			this.mazeSize = data.mazeSize;
		}  else {
			this.mazeSize = 2;
		}

		if (this.mazeSize > 3 ) {
			this.mazeSize = 3;
		}
	}

	preload() {
		this.load.image('wall_1', 'assets/wall_1.png');
		this.load.image('wall_2', 'assets/wall_2.png');
		this.load.image('wall_3', 'assets/wall_3.png');
		this.load.image('door', 'assets/door.png');
		this.load.spritesheet('player', 'assets/skeleton.png', { frameWidth: 32, frameHeight: 34 });
	}

	create() {
		// this.mazeSize = 2;

		this.start();
	}

	update(time, delta) {
		// Collision player with wall group.
		this.physics.add.collider(this.player.sprite, this.wall_group);

		// Collission player with door
		this.physics.add.collider(this.player.sprite, this.door_group, this.doorCollision, null, this);

		this.player.update();
	}

	start() {
		this.createMaze();

		this.displayMaze();

		this.placePlayer();
	}

	placePlayer() {
		this.player = new Player(this, 50, 48);
		this.player.sprite.setScale(0.75,0.75);
	}

	displayMaze() {
		this.wall_group = this.physics.add.group({immovable:true});
		this.door_group = this.physics.add.group({immovable:true});

		var sprite_x_y = 32;

		for (var j = 0; j < this.maze.x * 2 + 1; j++) {
			var line = [];

			if (0 == j % 2) {
				for (var k = 0; k < this.maze.y * 2 + 1; k++)
					if (0 == k % 2) {
						// Cross sections.
						this.wall_group.add( this.add.sprite(k * sprite_x_y + 16,j * sprite_x_y + 16,'wall_1', 0, this.wall_group) );
					} else {
						if (j > 0 && this.maze.verti[j / 2 - 1][Math.floor(k / 2)]) {

						} else {
							// Horizontal walls.
							this.wall_group.add( this.add.sprite(k * sprite_x_y + 16,j * sprite_x_y + 16,'wall_2') );
						}
					}
			} else {
				for (var k = 0; k < this.maze.y * 2 + 1; k++) {
					if (0 == k % 2) {
						if (k > 0 && this.maze.horiz[(j - 1) / 2][k / 2 - 1]) {

						} else {

							if (k == this.maze.y * 2 && j == this.maze.y * 2 -1) {
								this.door_group.add(this.add.sprite(k * sprite_x_y + 16,j * sprite_x_y + 16,'door'));
							} else {
								// vertical walls
								this.wall_group.add( this.add.sprite(k * sprite_x_y + 16,j * sprite_x_y + 16,'wall_3', 0, this.wall_group) );
							}
						}
					} else {
						// line[k] = ' ';
					}
				}
			}
		}
	}

	doorCollision(player, door) {
		this.mazeSize += 1;

		//this.start();
		this.scene.restart({mazeSize: this.mazeSize});
	}

	createMaze() {
		var x = this.mazeSize;
		var y = this.mazeSize;
		var n = x * y - 1;

		if (n < 0) {
			alert("illegal maze dimensions");
			return;
		}

		var horiz = [];
		var verti = [];
		var here = [];
		var path = [];
		var unvisited = [];

		for (var j = 0; j < x + 1; j++) {
			horiz[j] = [];
			verti[j] = [];
			here = [Math.floor(Math.random() * x), Math.floor(Math.random() * y)];
			path = [here];
			unvisited = [];
		}

		for (var j = 0; j < x + 2; j++) {
			unvisited[j] = [];
			for (var k = 0; k < y + 1; k++) {
				unvisited[j].push(j > 0 && j < x + 1 && k > 0 && (j != here[0] + 1 || k != here[1] + 1));
			}
		}

		while (0 < n) {
			var potential = [
				[here[0] + 1, here[1]],
				[here[0], here[1] + 1],
				[here[0] - 1, here[1]],
				[here[0], here[1] - 1]
			];

			var neighbors = [];

			for (var j = 0; j < 4; j++) {
				if (unvisited[potential[j][0] + 1][potential[j][1] + 1]) {
					neighbors.push(potential[j]);
				}
			}

			if (neighbors.length) {
				n = n - 1;
				var next = neighbors[Math.floor(Math.random() * neighbors.length)];
				unvisited[next[0] + 1][next[1] + 1] = false;

				if (next[0] == here[0]) {
					horiz[next[0]][(next[1] + here[1] - 1) / 2] = true;
				} else {
					verti[(next[0] + here[0] - 1) / 2][next[1]] = true;
				}

				path.push(here = next);
			} else {
				here = path.pop();
			}
		}

		this.maze = {
			x: x,
			y: y,
			horiz: horiz,
			verti: verti
		};
	}
}
