
class PillarPreset extends GameObject {
        constructor(game, x, y, width = 64, height = 154, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Pillar";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 3));
                this.renderer = new ImageRenderer(this, "objects/obstacles/pillar.png");
        }
}

class BrokenPillarPreset extends GameObject {
        constructor(game, x, y, width = 64, height = 114, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Broken Pillar";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2.3));
                this.renderer = new ImageRenderer(this, "objects/obstacles/pillar_broken.png");
        }
}

class TallRunestonePreset extends GameObject {
        constructor(game, x, y, width = 52, height = 132, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Tall Runestone";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 4));
                this.renderer = new ImageRenderer(this, "objects/obstacles/runestone_tall.png");
        }
}

class ShortRunestonePreset extends GameObject {
        constructor(game, x, y, width = 52, height = 104, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Short Runestone";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 3));
                this.renderer = new ImageRenderer(this, "objects/obstacles/runestone_short.png");
        }
}

class BrokenRunestonePreset extends GameObject {
        constructor(game, x, y, width = 52, height = 76, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Broken Runestone";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2.25));
                this.renderer = new ImageRenderer(this, "objects/obstacles/runestone_broken.png");
        }
}

class WellPreset extends GameObject {
        constructor(game, x, y, width = 110, height = 98, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Well";
                this.collider.push(new CapsuleCollider(this, this.game.activeCamera, this.height / 2 - 20, this.width / 2, false, 0, -10));
                this.renderer = new ImageRenderer(this, "objects/obstacles/well.png");
        }
}

class StatuePreset extends GameObject {
        constructor(game, x, y, width = 72, height = 144, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Statue";
                this.collider.push(new CapsuleCollider(this, this.game.activeCamera, this.height / 6, 30, false, 0, -5));
                this.renderer = new ImageRenderer(this, "objects/obstacles/statue.png");
        }
}

class CrossTombstonePreset extends GameObject {
        constructor(game, x, y, width = 52, height = 80, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Cross Tombstone";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2.5));
                this.renderer = new ImageRenderer(this, "objects/obstacles/tombstone_cross.png");
        }
}

class TallTombstonePreset extends GameObject {
        constructor(game, x, y, width = 60, height = 82, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Tall Tombstone";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 2.45));
                this.renderer = new ImageRenderer(this, "objects/obstacles/tombstone_tall.png");
        }
}

class ShortTombstonePreset extends GameObject {
        constructor(game, x, y, width = 60, height = 58, rotationAngle = 0) {
                super(game, x, y, width, height, rotationAngle);

                this.name = "Short Tombstone";
                this.collider.push(new BoxCollider(this, this.game.activeCamera, this.width, this.height / 1.55));
                this.renderer = new ImageRenderer(this, "objects/obstacles/tombstone_short.png");
        }
}