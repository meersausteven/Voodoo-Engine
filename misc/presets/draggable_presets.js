
class BarrelPreset extends DraggableObject {
        constructor(game, x, y, width = 52, height = 78, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Barrel";
                this.collider.push(new CircleCollider(this, this.game.activeCamera, this.width / 2, false, 0, -this.height / 3));
                this.renderer = new ImageRenderer(this, "objects/obstacles/barrel.png");
        }
}

class CratePreset extends DraggableObject {
        constructor(game, x, y, width = 52, height = 78, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Crate";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height - 30));
                this.renderer = new ImageRenderer(this, "objects/obstacles/crate.png");
        }
}

class LargeCratePreset extends DraggableObject {
        constructor(game, x, y, width = 64, height = 92, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Large Crate";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height - 40));
                this.renderer = new ImageRenderer(this, "objects/obstacles/crate_large.png");
        }
}
