
import {Editor} from './classes/editor.js';

// instantiate the editor
const editor = new Editor();
editor.start();

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