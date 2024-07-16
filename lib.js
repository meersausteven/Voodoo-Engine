
/*
todo: REFACTOR THIS AND CREATE AS OWN SCRIPT ENCHANTMENT
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

// todo: move this to the renderer
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

// clamps a given value between a min and a max value
// returns the clamped value
Math.clamp = function(value, min, max) {
        value = Math.min(max, value);
        value = Math.max(value, min);

        return value;
};

// add degreesToRadians function to Math object
// takes in an angle in degrees and returns that angle as radians
Math.degreesToRadians = function(degrees) {
        const radians = degrees * (this.PI / 180);

        return radians
};

/* calculate the dot product between two points
 * @param Vector2 a: first point
 * @param Vector2 b: second point
 */
Math.dot = function(a, b) {
        const dot = (a.x * b.x) + (a.y * b.y);

        return dot;
};

/*
 * interpolate between two numbers
 * @param number a
 * @param number b
 * @param number t: interpolation value (clamped between 0 and 1)
 */
Math.lerp = function(a, b, t) {
        const lerp = a + ((b - a) * Math.clamp(t, 0, 1));

        return lerp
};

/*
 * interpolate between three numbers
 * @param number a
 * @param number b
 * @param number c
 * @param number t: interpolation value (clamped between 0 and 1)
 */
Math.bezierLerp = function(a, b, c, t) {
        const intermediateA = Math.lerp(a, b, t);
        const intermediateB = Math.lerp(b, c, t);

        const bezierLerp = Math.lerp(intermediateA, intermediateB, t);

        return bezierLerp;
}

// add gravitational constant to Math object
Math.G = 6.67430 * Math.pow(10, -11);


/*
 * create an array with random static noise values between 0 and 1
 * takes in width and height of the noise (texture)
 * returns array with length of width * height
 * @param number width: width of the noise texture
 * @param number height: height of the noise texture 
 */
Math.staticNoise = function(width, height) {
        const noise = [];

        let i = 0;
        const l = width * height;
        while (i < l) {
                noise.push(this.random());

                ++i;
        }

        return noise;
};

/*
 * create an array with random perlin noise values between 0 and 1
 * takes in width and height of the noise (texture)
 * returns array with length of width * height
 * @param number width: width of the noise texture
 * @param number height: height of the noise texture 
 */
Math.perlinNoise = function(width, height) {
        // todo: add perlin noise function

};

/*
 * create a semi-random large integer with a very low probability of being a duplicate (5 in 500.000)
 * used to create semi.unique ids
 */
Math.randomID = function() {
        return Math.abs(Math.floor(Date.now() * Math.random() * 69) << (420 * 1337 * Date.now() * 123456789 * Math.random()));
}

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
