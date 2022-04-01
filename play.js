
// instantiate the debugger
var debug = new Debugger();

// instantiate a project
var project = new Project();
project.start();

var testScene = new Scene();
project.addScene(testScene);

var testGameObject = new GameObject(150, 100);
testGameObject.addComponent(
        new BoxRenderer(50, 50, "#ff0000", 2, "#ffffff")
);

var testGameObject2 = new GameObject(250, 100);
testGameObject2.addComponent(
        new CircleRenderer("#ff0000", 2, "#ffffff", 30)
);

var testGameObject3 = new GameObject(350, 100);
testGameObject3.addComponent(
        new SpriteRenderer(40, 40, "objects/nature/rock_xxl.png")
);

var testGameObject4 = new GameObject(500, 100);
testGameObject4.addComponent(
        new PolygonCircleRenderer(
                new PolygonCircle(40, 12), '#ff0000', 2, '#ffffff')
);

var testGameObject5 = new GameObject(700, 100);
testGameObject5.addComponent(
        new PolygonCapsuleRenderer(
                new PolygonCapsule(30, 12, 40), '#ff0000', 2, '#ffffff')
);

var testGameObject6 = new GameObject(850, 100);
testGameObject6.addComponent(
        new PolygonCapsuleRenderer(
                new PolygonCapsule(20, 8, 60, "vertical"), '#ff0000', 2, '#ffffff')
);

project.loadScene(0);

project.activeScene.addGameObject(testGameObject);
project.activeScene.addGameObject(testGameObject2);
project.activeScene.addGameObject(testGameObject3);
project.activeScene.addGameObject(testGameObject4);
project.activeScene.addGameObject(testGameObject5);
project.activeScene.addGameObject(testGameObject6);
