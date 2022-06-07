
class CenterBox extends Component {
        width = 25;
        height = 25;
        
        move(direction) {
                this.gameObject.pos += direction;
        }
}