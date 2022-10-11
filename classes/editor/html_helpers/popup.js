
class Popup {
        html;
        title;
        content;
        id;

        constructor(title, content, id = null) {
                // string title: title that is displayed on top of the popup
                // html content: html that is displayed inside the popup
                this.title = title;
                this.content = content;
                this.id = id;

                this.html = new HtmlElement('div', null, {class: 'popup', id: this.id});

                // title
                let label = new HtmlElement('div', this.title, {class: 'label'});

                // close button
                let closeButton = new HtmlElement('i', null, {class: 'close_button fa fa-xmark'});
                closeButton.addEventListener('click', function(e) {
                        e.target.closest('.popup').remove();
                });

                // content
                let popupContent = new HtmlElement('div', null, {class: 'popup_content'});
                popupContent.appendChild(this.content);

                this.html.appendChild(label);
                this.html.appendChild(closeButton);
                this.html.appendChild(popupContent);

                document.body.appendChild(this.html);
        }
}