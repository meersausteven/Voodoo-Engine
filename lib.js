
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

// globally available array with currently pressed/held down keys
var currentKeyInput = [];

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
// @todo: MOVE THIS TO COLLIDER COMPONENT
// check if a circle and a square are overlapping
// takes in a circles x, y and radius and a box colliders' x, y, width and height
function circleBoxOverlapping(circle, box, checkPos = null, checkingType = null) {
        if (checkPos != null) {
                switch (checkingType) {
                        case "Circle Collider":
                                circle.worldPos.x = checkPos.x;
                                circle.worldPos.y = checkPos.y;
                                break;

                        case "Box Collider":
                                box.worldPos.x = checkPos.x;
                                box.worldPos.y = checkPos.y;
                                break;

                        default: 
                                break;
                }
        }
        
        // temporary variables to set edges for testing
        let testX = circle.worldPos.x;
        let testY = circle.worldPos.y;

        // which edge is closest?
        if (circle.worldPos.x < box.worldPos.x - (box.width / 2)) {
                // left edge
                testX = box.worldPos.x - (box.width / 2);
        } else if (circle.worldPos.x > box.worldPos.x + (box.width / 2)) {
                // right edge
                testX = box.worldPos.x + (box.width / 2);
        }

        if (circle.worldPos.y < box.worldPos.y - box.height) {
                // top edge
                testY = box.worldPos.y - box.height;
        } else if (circle.worldPos.y > box.worldPos.y) {
                // bottom edge
                testY = box.worldPos.y;
        }
      
        // get distance from closest edges
        let distX = circle.worldPos.x - testX;
        let distY = circle.worldPos.y - testY;
        let dist = Math.sqrt((distX * distX) + (distY * distY));

        if (dist <= circle.radius) {
                return true;
        }

        return false;
}

// @todo: MOVE THIS TO COLLIDER COMPONENT
// check if two squares are overlapping
// takes in the two squares' x and y from their sides
function boxesOverlapping(box1, box2, checkPos = null) {
        if (checkPos != null) {
                box1.worldPos.x = checkPos.x;
                box1.worldPos.y = checkPos.y;
        }

        let b1LeftEdge = box1.worldPos.x - (box1.width / 2);
        let b1RightEdge = box1.worldPos.x + (box1.width / 2);
        let b1BottomEdge = box1.worldPos.y;
        let b1TopEdge = box1.worldPos.y - box1.height;
        
        let b2LeftEdge = box2.worldPos.x - (box2.width / 2);
        let b2RightEdge = box2.worldPos.x + (box2.width / 2);
        let b2BottomEdge = box2.worldPos.y;
        let b2TopEdge = box2.worldPos.y - box2.height;

        let b1_leftOf_b2 = b1RightEdge < b2LeftEdge;
        let b1_rightOf_b2 = b1LeftEdge > b2RightEdge;
        let b1_above_b2 = b1BottomEdge > b2TopEdge;
        let b1_below_b2 = b1TopEdge < b2BottomEdge;

        if (!b1_leftOf_b2 || !b1_rightOf_b2 || !b1_above_b2 || !b1_below_b2) {
                return true;
        }

        return false;
}

// @todo: MOVE THIS TO COLLIDER COMPONENT
// check if two cirlces are overlapping
// takes in the two circles' x, y and radius
function circlesOverlapping(circle1, circle2, checkPos = null) {
        if (checkPos != null) {
                circle1.worldPos.x = checkPos.x;
                circle1.worldPos.y = checkPos.y;
        }

        let distX = circle1.worldPos.x - circle2.worldPos.x;
        let distY = circle1.worldPos.y - circle2.worldPos.y;
        let dist = Math.sqrt((distX * distX) + (distY * distY));

        if (dist <= circle1.radius + circle2.radius) {
                return true;
        }

        return false;
}

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

// checks if a given value is between two other values
// returns true if true
function valueBetween(value, start, end) {
        if ( (value > start) && (value < end) ) {
                return true;
        }

        return false;
}

// calculate length of vector inside a circle with radius 1
function getRadialLength(angle) {
        let radial = angle * (Math.PI / 180);

        return radial;
}

// add clamp function to Math object
// clamps if a given value is between a min and a max value
// returns the clamped value
Math.clamp = function(value, min, max) {
        if (value < min) {
                value = min;
        } else if (value > max) {
                value = max;
        }

        return value;
}

// add remove funtion to array prototype
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

//////////////////
/* Editor stuff */
//////////////////

function tabClick(element) {
        let target = element.dataset.target;
        let wasOpen = !!element.classList.contains('active');

        // remove classes from all tabs
        let tabs = element.parentElement.querySelectorAll('.tab');
        for (let i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove('active');
        }
        
        let tabContents = document.querySelectorAll('#menuBar .tab-content');
        for (let i = 0; i < tabContents.length; i++) {
                tabContents[i].classList.remove('open');
        }

        // toggle class for own tab
        if (!wasOpen) {
                element.classList.toggle('active');
                document.querySelector(target).classList.add('open');
        }
}