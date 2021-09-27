
class LargeTreePreset extends GameObject {
        constructor(game, x, y, width = 226, height = 278, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Large Tree";
                this.collider.push(new CircleCollider(this, this.game.activeCamera, 13, false, -2, -13));
                this.renderer = new ImageRenderer(this, "objects/nature/tree_large.png");
        }
}

class MediumTreePreset extends GameObject {
        constructor(game, x, y, width = 190, height = 272, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Medium Tree";
                this.collider.push(new CircleCollider(this, this.game.activeCamera, 13, false, -2, -13));
                this.renderer = new ImageRenderer(this, "objects/nature/tree_medium.png");
        }
}

class SmallTreePreset extends GameObject {
        constructor(game, x, y, width = 158, height = 240, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Small Tree";
                this.collider.push(new CircleCollider(this, this.game.activeCamera, 11, false, 3, -11));
                this.renderer = new ImageRenderer(this, "objects/nature/tree_small.png");
        }
}

class BoulderPreset extends GameObject {
        constructor(game, x, y, width = 114, height = 84, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Boulder";
                this.collider.push(new CapsuleCollider(this, this.game.activeCamera, this.height / 2 - 15, this.width / 2 - 10, false, 0, -7));
                this.renderer = new ImageRenderer(this, "objects/nature/boulder.png");
        }
}
