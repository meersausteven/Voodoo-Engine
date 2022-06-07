
class Renderer extends Component {
        type = "Renderer";

        constructor(offset = new Vector2()) {
                super();
                
                this.attributes['offset'] = new AttributeVector2('Offset', offset);
        }
}
