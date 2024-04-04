import { randItem } from "../utils.js";
import Actor from "./Actor.js";
export default class Cactus extends Actor {
    constructor(imageData) {
        super(imageData);
        this.speed = 0;
        this.variatns = ["cactus", "cactusDouble", "cactusDoubleB", "cactusTriple"];
        this.sprite = randItem(this.variatns);
    }
    nextFrame() {
        this.x = this.x - this.speed;
    }
}
