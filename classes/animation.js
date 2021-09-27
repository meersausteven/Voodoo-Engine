
class Animation {
        constructor(imageRenderer, animationName, numberOfFrames = 1, timePerFrame = 100, looping = true) {
                // imageRenderer: an image renderer as GameObject.renderer
                // animationName: directory named after the animation /images (contains all frames named after position in animation starting with 0)
                // numberOfFrames: number of images/frames in the animation directory
                // timePerFrame: time each frame in the animation will be shown in ms
                // looping: should the animation repeat after finishing
                
                this.imageRenderer = imageRenderer;
                this.animationName = animationName;
                this.numberOfFrames = numberOfFrames;
                this.timePerFrame = timePerFrame / 1000;
                this.looping = looping;

                this.currentFrame = 0;
                this.currentFrameTime = 0;
                this.animationSources = [];

                for (let i = 0; i < this.numberOfFrames; i++) {
                        this.animationSources.push("animations/" + this.animationName + "/" + i + ".png");
                }

                this.imagePath = this.animationSources[this.currentFrame];
                
                this.imageRenderer.imagePath = this.imagePath;
                this.imageRenderer.updateSource();
        }
        
        update() {
                if (this.numberOfFrames > 1) {
                        if (this.currentFrameTime >= this.timePerFrame) {
                                this.currentFrame++;
                                this.currentFrameTime = 0;

                                if ( (this.looping == true) && (this.currentFrame >= this.animationSources.length) ) {
                                        this.currentFrame = 0;
                                }
                        } else {
                                this.currentFrameTime += time.deltaTime;
                        }

                        this.imagePath = this.animationSources[this.currentFrame];
                        
                        this.imageRenderer.imagePath = this.imagePath;
                        this.imageRenderer.updateSource();
                }
        }
}