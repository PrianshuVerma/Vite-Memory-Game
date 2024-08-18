import { Drawable } from "../simplekit/drawable";
import { distance } from "../simplekit/utility/misc";

export class Circle implements Drawable {
    constructor(
        public x: number,
        public y: number,
        public orderNum: number,
        public isHighlighted: boolean,
        public isLarger: boolean = false,
    ){}

    draw(gc: CanvasRenderingContext2D){
        const h: number = 36 * this.orderNum;
        gc.save();

        gc.fillStyle = `hsl(${h}deg 80% 50%)`;
        gc.strokeStyle = "yellow";
        gc.lineWidth = 10;

        gc.beginPath();
        if (this.isLarger){
            gc.arc(this.x, this.y, 94, 0, Math.PI * 2);
            //console.log("I am in Circle Class making it bigger");
        }
        else{
            gc.arc(this.x, this.y, 75, 0, Math.PI * 2);
        }
        
        gc.closePath();
        if (this.isHighlighted){
            gc.stroke();
        }
        gc.fill();
        

        gc.font = "15pt sans-serif";
        gc.fillStyle = "black";
        gc.textAlign = "center";
        gc.textBaseline = "middle";
        gc.fillText(`${this.orderNum}`, this.x, this.y);
        gc.restore();

    }

    hitTest(mx: number, my: number) {
        let hit: boolean = false;
        this.isHighlighted = false;
        const d: number = Math.sqrt((mx - this.x) ** 2 + (my - this.y) ** 2);
        if (d <= 75){
            this.isHighlighted = true;
            hit = true;
        }

        return hit;
      }
}