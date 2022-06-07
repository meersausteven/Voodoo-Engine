
class rgba {
        red;
        green;
        blue;
        alpha;

        constructor(red = 0, green = 0, blue = 0, alpha = 1) {
                // int red: value between 0 and 255
                // int green: value between 0 and 255
                // int blue: value between 0 and 255
                // float alpha: value between 0 and 1
                this.red = red;
                this.green = green;
                this.blue = blue;
                this.alpha = alpha;
        }

        toClampedArray() {
                let arr = [];

                arr.push(this.red);
                arr.push(this.green);
                arr.push(this.blue);
                arr.push(Math.floor(this.alpha * 255));

                return arr;
        }
}