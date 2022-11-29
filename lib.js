
///////////////
/* Variables */
///////////////

// timeout with which the mouse movement will be reset
var mouseMoveTimeout;

// globally available time object
// time values in ms
var time = {
        startTime: null,
        lastFrame: null,
        totalTime: null,
        deltaTime: null
};

/////////////
/* Methods */
/////////////

/* @todo: MOVE THIS SOMEWHERE ELSE; ONLY NEEDED INSIDE A PROJECT AS AN ASSET
// simple movement in 8 directions (wasd / arrows)
function simple8DirMovement(obj) {
        let directionX = 0;
        let directionY = 0;
        
        // get pressed directions
        if (currentKeyInput.includes("KeyW") || currentKeyInput.includes("ArrowUp")) {
                directionY -= 1;
        }

        if (currentKeyInput.includes("KeyS") || currentKeyInput.includes("ArrowDown")) {
                directionY += 1;
        }

        if (currentKeyInput.includes("KeyA") || currentKeyInput.includes("ArrowLeft")) {
                directionX -= 1;
        }

        if (currentKeyInput.includes("KeyD") || currentKeyInput.includes("ArrowRight")) {
                directionX += 1;
        }

        // calculate returning values
        let returning = {
                direction: {
                        x: directionX * getRadialLength(45),
                        y: directionY * getRadialLength(45)
                },
                moving: obj.moving,
                facing: obj.facing
        };
        
        // get which direction the object should face
        if ( (directionX == 0) && (directionY == 0) ) {
                returning.moving = false;
        } else {
                returning.moving = true;
        }
        
        if (directionX == 0) {
                if (directionY == 1) {
                        returning.facing = 'down';
                } else if (directionY == -1) {
                        returning.facing = 'up';
                }
        } else if (directionX == 1) {
                if (directionY == 0) {
                        returning.facing = 'right';
                } else if (directionY == 1) {
                        returning.facing = 'down_right';
                } else if (directionY == -1) {
                        returning.facing = 'up_right';
                }
        } else if (directionX == -1) {
                if (directionY == 0) {
                        returning.facing = 'left';
                } else if (directionY == 1) {
                        returning.facing = 'down_left';
                } else if (directionY == -1) {
                        returning.facing = 'up_left';
                }
        }

        return returning;
}
*/

// used for array.sort()
// works only with game objects
function sortByYPos(a, b) {
        if (a.pos.y > b.pos.y) {
                return 1;
        }

        if (a.pos.y < b.pos.y) {
                return -1;
        }

        return 0;
}

/* MATH EXPANSION */

// checks if a given value is between two other values
// takes in a value to check and start and end values
// returns true if true
Math.valueBetween = function(value, start, end) {
        if ((value > start) &&
            (value < end))
        {
                return true;
        }

        return false;
};

// add clamp function to Math object
// clamps a given value between a min and a max value
// returns the clamped value
Math.clamp = function(value, min, max) {
        if (value < min) {
                value = min;
        } else if (value > max) {
                value = max;
        }

        return value;
};

// add degreesToRadians function to Math object
// takes in an angle in degrees and returns that angle as radians
Math.degreesToRadians = function(degrees) {
        let radians = degrees * (this.PI / 180);

        return radians
};

/* calculate the dot product between two points
 * @param Vector2 a: first point
 * @param Vector2 b: second point
 */
Math.dot = function(a, b) {
        let dot;

        dot = (a.x * b.x) + (a.y * b.y);

        return dot;
};

/* interpolate between two numbers
 * @param Number a: minimum
 * @param Number b: maximum
 * @param Number t: interpolation value
 */
Math.lerp = function(a, b, t) {
        let lerp;

        lerp = a + ((b - a) * t);

        return lerp
};

/* create an array with random static noise values between 0 and 1
 * takes in width and height of the noise (texture)
 * returns array with length of width * height
 * @param Number width: width of the noise texture
 * @param Number height: height of the noise texture 
 */
Math.staticNoise = function(width, height) {
        let noise = [];
        
        let i = 0;
        let l = width * height;
        while (i < l) {
                noise[i] = this.random();

                ++i;
        }

        return noise;
};

/* create an array with random perlin noise values between 0 and 1
 * takes in width and height of the noise (texture)
 * returns array with length of width * height
 * @param Number width: width of the noise texture
 * @param Number height: height of the noise texture 
 */
Math.perlinNoise = function(width, height) {
        // @todo: add perlin noise function

};

// add remove function to array prototype
// removes item from array with given value
Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;

        while (L && this.length) {
                what = a[--L];

                while ((ax = this.indexOf(what)) !== -1) {
                        this.splice(ax, 1);
                }
        }

        return this;
};

// add filter function to array prototype
// removes empty indexes
Array.prototype.clear = function() {
        return true;
}
