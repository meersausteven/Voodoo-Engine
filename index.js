
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

project.loadScene(0);

project.activeScene.addGameObject(testGameObject);
project.activeScene.addGameObject(testGameObject2);
project.activeScene.addGameObject(testGameObject3);

