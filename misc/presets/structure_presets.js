
class HorizontalWall1Preset extends GameObject {
        constructor(game, x, y, width = 256, height = 128, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Horizontal Wall 1";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_horizontal_1.png");
        }
}

class HorizontalWall2Preset extends GameObject {
        constructor(game, x, y, width = 128, height = 128, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Horizontal Wall 2";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_horizontal_2.png");
        }
}

class HorizontalWall3Preset extends GameObject {
        constructor(game, x, y, width = 128, height = 128, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Horizontal Wall 3";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_horizontal_3.png");
        }
}

class HorizontalWall4Preset extends GameObject {
        constructor(game, x, y, width = 64, height = 128, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Horizontal Wall 4";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_horizontal_4.png");
        }
}

class HorizontalWall5Preset extends GameObject {
        constructor(game, x, y, width = 104, height = 128, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Horizontal Wall 5";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_horizontal_5.png");
        }
}

class WallStairsPreset extends GameObject {
        constructor(game, x, y, width = 130, height = 192, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Wall Stairs";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, -this.width / 2 + 8));
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, this.width / 2 - 8));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_stairs.png");
        }
}

class WallMossyStairsPreset extends GameObject {
        constructor(game, x, y, width = 130, height = 192, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Mossy Wall Stairs";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, -this.width / 2 + 8));
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, this.width / 2 - 8));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_stairs_mossy.png");
        }
}

class WallLeftStairsPreset extends GameObject {
        constructor(game, x, y, width = 130, height = 192, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Wall Left Stairs";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, -this.width / 2 + 8));
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, this.width / 2 - 8));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_left_stairs.png");
        }
}

class WallLeftMossyStairsPreset extends GameObject {
        constructor(game, x, y, width = 130, height = 192, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Mossy Wall Left Stairs";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, -this.width / 2 + 8));
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, this.width / 2 - 8));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_left_stairs_mossy.png");
        }
}

class WallRightStairsPreset extends GameObject {
        constructor(game, x, y, width = 130, height = 192, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Wall Right Stairs";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, -this.width / 2 + 8));
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, this.width / 2 - 8));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_right_stairs.png");
        }
}

class WallRightMossyStairsPreset extends GameObject {
        constructor(game, x, y, width = 130, height = 192, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Mossy Wall Right Stairs";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, -this.width / 2 + 8));
                this.collider.push(new BoxCollider(this, this.game.activeCamera, 16, this.height, false, this.width / 2 - 8));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_right_stairs_mossy.png");
        }
}

class WallDoorFramePreset extends GameObject {
        constructor(game, x, y, width = 128, height = 128, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Wall Door Frame";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width / 4, this.height / 2, false, -this.width / 2 + this.width / 8));
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width / 4, this.height / 2, false, this.width / 2 - this.width / 8));
                this.renderer = new ImageRenderer(this, "objects/structures/wall_door_frame.png");
        }
}