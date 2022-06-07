
// instantiate the editor
var editor = new Editor();

var testGameObject = new GameObject(150, 100);
testGameObject.attributes.name.value = "Test-Box (red)";
testGameObject.addComponent(
        new BoxRenderer(50, 50, "#ff0000", 2, "#ffffff")
);
testGameObject.addComponent(
        new BoxCollider(50, 50)
);

var testGameObject2 = new GameObject(250, 100);
testGameObject2.attributes.name.value = "Test-Circle (blue)";
testGameObject2.addComponent(
        new CircleRenderer("#2299ff", 4, "#ffffff", 30)
);
testGameObject2.addComponent(
        new CircleCollider(30)
);
testGameObject2.addComponent(
        new Rigidbody()
);

var testGameObject3 = new GameObject(350, 100);
testGameObject3.attributes.name.value = "Rock";
testGameObject3.addComponent(
        new SpriteRenderer(50, 50, "objects/nature/rock_xxl.png")
);
testGameObject3.addComponent(
        new CircleCollider(20)
);

var testGameObject4 = new GameObject(500, 100);
testGameObject4.attributes.name.value = "Polygonal Circle";
testGameObject4.addComponent(
        new PolygonCircleRenderer(
                new PolygonCircle(40, 12), '#ffff00', 8, '#ff0000')
);
testGameObject4.addComponent(
        new CapsuleCollider(20, 5)
);

var testGameObject5 = new GameObject(700, 100);
testGameObject5.attributes.name.value = "Horizontal Polygon Capsule";
testGameObject5.addComponent(
        new PolygonCapsuleRenderer(
                new PolygonCapsule(30, 12, 40), '#ff00ff', 0, 'transparent')
);
testGameObject5.addComponent(
        new CapsuleCollider(30, 40)
);

var testGameObject6 = new GameObject(850, 100);
testGameObject6.attributes.name.value = "Vertical Polygon Capsule";
testGameObject6.addComponent(
        new PolygonCapsuleRenderer(
                new PolygonCapsule(20, 8, 60, "vertical"), '#ffffff', 6, '#bbbbbb')
);
testGameObject6.addComponent(
        new CapsuleCollider(20, 60, true, new Vector2(), 'vertical')
);

editor.start();

editor.project.activeScene.addGameObject(testGameObject);
editor.project.activeScene.addGameObject(testGameObject2);
editor.project.activeScene.addGameObject(testGameObject3);
editor.project.activeScene.addGameObject(testGameObject4);
editor.project.activeScene.addGameObject(testGameObject5);
editor.project.activeScene.addGameObject(testGameObject6);

editor.loadEditorElements();
/*
// TESTING - STATIC NOISE TO IMAGE
let width = 150;
let height = 150;
function createNoiseTexture(width, height, noise) {
        // set image data
        let data = new Uint8ClampedArray(width * height * 4);

        let i = 0;
        let j = 0;
        let l = data.length;
        while (i < l) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = (noise[j] * 255);
                
                i += 4;
                ++j;
        }

        let imageData = new ImageData(data, width);

        // create image using a canvas
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        let ctx = canvas.getContext("2d");
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
        ctx.putImageData(imageData, 0, 0);

        let img = new Image();
        img.src = canvas.toDataURL();

        document.getElementById('scenes-container').appendChild(img);

        canvas.remove();
}

createNoiseTexture(width, height, Math.staticNoise(width, height));
*/