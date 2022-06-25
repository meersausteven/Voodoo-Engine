
class Renderer {
        settings = {

        };
        componentRenderer = [];

        addComponentRenderer(renderer) {
                if (renderer instanceof ComponentRenderer) {
                        let i = 0;
                        let l = this.componentRenderer.length;

                        while (i < l) {
                                if (this.componentRenderer[i] === renderer) {
                                        return;
                                }

                                ++i;
                        }

                        this.componentRenderer.push(renderer);

                        return true;
                }
        }

        removeComponentRenderer(index) {
                if ((typeof index == "number") &&
                    ((this.componentRenderer[index] !== null) &&
                    (typeof this.componentRenderer[index] != "undefined"))
                ) {
                        this.componentRenderer[index] = null;

                        dispatchEvent(new Event('component_renderer_list_changed'));

                        return true;
                }
        }

        renderToCameraView(camera) {
                let i = 0;
                let l = this.componentRenderer.length;

                while (i < l) {
                        if (this.componentRenderer[i] instanceof PolygonRenderer) {
                                return;
                        }

                        // get camera view bounds
                        let cameraPosX = camera.gameObject.transform.attributes['position'].value.x;
                        let cameraPosY = camera.gameObject.transform.attributes['position'].value.y;

                        let cameraBorderLeft = cameraPosX - camera.attributes['viewWidth'].value / 2;
                        let cameraBorderRight = cameraPosX + camera.attributes['viewWidth'].value / 2;
                        let cameraBorderTop = cameraPosY - camera.attributes['viewHeight'].value / 2;
                        let cameraBorderBottom = cameraPosY + camera.attributes['viewHeight'].value / 2;

                        // get renderer bounds
                        let rendererPosX = this.componentRenderer[i].attributes.worldPos.x;
                        let rendererPosY = this.componentRenderer[i].attributes.worldPos.y;
                        let rendererWidth = (this.componentRenderer[i] instanceof CircleRenderer) ? this.componentRenderer[i].attributes['radius'].value : this.componentRenderer[i].attributes['width'].value;
                        let rendererHeight = (this.componentRenderer[i] instanceof CircleRenderer) ? this.componentRenderer[i].attributes['radius'].value : this.componentRenderer[i].attributes['height'].value;

                        let rendererBorderLeft = rendererPosX - rendererWidth / 2;
                        let rendererBorderRight = rendererPosX + rendererWidth / 2;
                        let rendererBorderTop = rendererPosY - rendererHeight / 2;
                        let rendererBorderBottom = rendererPosY + rendererHeight / 2;
                        /*
                        console.log("component right: " + rendererBorderRight + " - camera left: " + cameraBorderLeft);
                        console.log("component left: " + rendererBorderLeft + " - camera right: " + cameraBorderRight);
                        console.log("component bottom: " + rendererBorderBottom + " - camera top: " + cameraBorderTop);
                        console.log("component top: " + rendererBorderTop + " - camera bottom: " + cameraBorderBottom);
                        */

                        // check if renderer bounds are inside camera view
                        if ((rendererBorderRight >= cameraBorderLeft) ||
                            (rendererBorderLeft <= cameraBorderRight) ||
                            (rendererBorderBottom >= cameraBorderTop) ||
                            (rendererBorderTop <= cameraBorderBottom)
                        ) {
                                this.componentRenderer[i].render(camera);
                        }

                        ++i;
                }
        }

        // @todo: THIS COMPONENTS GETS OBJECTS PASSED FROM COMPONENT RENDERERS
        //        THESE ARE CONTAINED IN this.componentRenderer AS AN ARRAY AND
        //        HOLD INFORMATION ABOUT THEIR WORLD POSITION, ROTATION AND SIZE
        //        LATER THE CAMERA COMPONENTS CHECK WHICH OF THE OBJECTS IN this.componentRenderer ARE IN VIEW
        //        THE CAMERA COMPONENT WILL ONLY DRAW OBJECTS THAT ARE IN VIEW AS AN OPTIMIZATION
        //        AT LAST THE FRAMES OF THE CAMERA COMPONENTS OF THE SCENES .activeCamera WILL BE SHOWN IN THE GAME VIEW
}