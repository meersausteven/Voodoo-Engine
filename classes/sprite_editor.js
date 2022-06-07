
class SpriteEditor {
        sprite;
        
        constructor(sprite = null) {
                // Image sprite: sprite that is to be edited
                this.sprite = sprite;
        }

        getPopupTitle() {
                let title;

                title = "Sprite Editor: " + this.sprite.name;

                return title;
        }

        getPopupContent() {
                let content;

                content = document.createElement('canvas');
                content.width = this.sprite.width;
                content.height = this.sprite.height;

                return content;
        }

        createPopup() {
                popupTitle = this.getPopupTitle();
                popupContent = this.getPopupContent();

                let popup = document.createElement('div');
                popup.classList.add('popup_window');

                // title bar
                let titleBar = document.createElement('div');
                titleBar.classList.add('title_bar');
                
                let startPosX, startPosY = 0;
                titleBar.addEventListener('mousedown', function(e) {
                        startPosX = e.clientX;
                        startPosY = e.clientY;
                        
                        document.onmousemove = function(e) {
                                let popup = this.closest('.popup_window');

                                let posDiffX = startPosX - e.clientX;
                                let posDiffY = startPosY - e.clientY;

                                startPosX = e.clientX;
                                startPosY = e.clientY;

                                popup.style.left = (popup.offsetLeft - posDiffX) + "px";
                                popup.style.top = (popup.offsetTop - posDiffY) + "px";
                        }.bind(this);
                });
                titleBar.addEventListener('mouseup', function() {
                        startPosX = 0;
                        startPosY = 0;
                        
                        document.onmousemove = null;
                });

                // title
                let title = document.createElement('div');
                title.classList.add('title');
                title.innerHTML = popupTitle;

                titleBar.appendChild(title);

                // close button
                let closeButton = document.createElement('div');
                closeButton.classList.add('close');
                closeButton.addEventListener('click', function() {
                        this.closest('.popup_window').remove();
                });

                titleBar.appendChild(closeButton);

                popup.appendChild(titleBar);

                // content
                let content = document.createElement('div');
                content.classList.add('content');
                content.innerHTML = popupContent;

                popup.appendChild(content);

                document.body.appendChild(popup);
        }
}