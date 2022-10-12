
import { HtmlElement } from './html_element.js';

export class Popup {
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
                let popupTitle = new HtmlElement('div', null, {class: 'popup_title'});

                // title text
                let label = new HtmlElement('div', this.title, {class: 'title'});

                // close button
                let closeButton = new HtmlElement('i', null, {class: 'close fa fa-xmark'});
                closeButton.addEventListener('click', function(e) {
                        e.target.closest('.popup').remove();
                });

                popupTitle.appendChild(label);
                popupTitle.appendChild(closeButton);

                // content
                let popupContent = new HtmlElement('div', null, {class: 'popup_content'});
                popupContent.appendChild(this.content);

                this.html.appendChild(popupTitle);
                this.html.appendChild(popupContent);

                document.body.appendChild(this.html);
        }
}