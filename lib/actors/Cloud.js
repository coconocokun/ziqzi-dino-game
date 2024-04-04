import { randInteger } from "../utils.js";
import Actor from "./Actor.js";
export default class Cloud extends Actor {
    constructor(imageData) {
        super(imageData);
        this.sprite = "cloud";
        this.speed = 0;
        this.speedMode = randInteger(6, 14) / 10;
        this.x = 0;
        this.y = 0;
    }
    nextFrame() {
        this.x = this.x - this.speed * this.speedMode;
    }
}
