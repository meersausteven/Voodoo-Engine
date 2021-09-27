
class SceneList {
        constructor(game) {
                this.game = game;
                this.scenes = {
                        testScene: {
                                gameObjects: [
                                        new Player(this.game, 690, 460),
                        
                                        new CratePreset(this.game, 200, 250),
                                        new LargeCratePreset(this.game, 500, 350),
                                        new BarrelPreset(this.game, 350, 250),
                                        new HorizontalWall1Preset(this.game, 700, 700),
                                        new HorizontalWall2Preset(this.game, 828, 700),
                                        new HorizontalWall3Preset(this.game, 956, 700),
                                        new HorizontalWall4Preset(this.game, 1020, 700),
                                        new HorizontalWall5Preset(this.game, 1104, 700),
                                        new DoorPreset(this.game, 1208, 700),
                                        new WallDoorFramePreset(this.game, 1208, 700),
                                        new WallLeftStairsPreset(this.game, 1335, 764),
                                        new LargeTreePreset(this.game, 700, 1000),
                                        new MediumTreePreset(this.game, 920, 1000),
                                        new SmallTreePreset(this.game, 1110, 1000),
                                        new BoulderPreset(this.game, 1200, 400),
                                        new WellPreset(this.game, 600, 500),
                                        new StatuePreset(this.game, 900, 500),
                                        new CrossTombstonePreset(this.game, 100, 300),
                                        new TallTombstonePreset(this.game, 100, 400),
                                        new ShortTombstonePreset(this.game, 100, 500),
                                        new PillarPreset(this.game, 200, 100),
                                        new BrokenPillarPreset(this.game, 300, 100),
                                        new BrokenRunestonePreset(this.game, 400, 100),
                                        new TallRunestonePreset(this.game, 500, 100),
                                        new ShortRunestonePreset(this.game, 600, 100),

                                ],
                                groundObjects: [
                                        
                                ]
                        },
                        level1: {
                                gameObjects: [
                                        new Player(this.game, 400, 700),
                                        new HorizontalWall2Preset(this.game, 328, 400),
                                        new HorizontalWall3Preset(this.game, 456, 400),
                                        new HorizontalWall4Preset(this.game, 520, 400),
                                        new HorizontalWall5Preset(this.game, 604, 400),
                                        new DoorPreset(this.game, 708, 400),
                                        new WallDoorFramePreset(this.game, 708, 400),
                                        new HorizontalWall1Preset(this.game, 900, 400),
                                ],
                                groundObjects: []
                        },
                        house1: {
                                gameObjects: [
                                        new Player(this.game, 200, 800),
                                ],
                                groundObjects: []
                        }
                };

                for (var x = 0; x < 40; x++) {
                        for (var y = 0; y < 20; y++) {
                                let newGrass = new GroundObject(this.game, 0, 0, "/grass/4.png");
                                        newGrass.pos.x = (newGrass.width - 1) * (1 + x);
                                        newGrass.pos.y = (newGrass.height - 1) * (1 + y);

                                this.scenes.testScene.groundObjects.push(newGrass);
                        }
                }
        }
}       