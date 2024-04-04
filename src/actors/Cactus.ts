import { randItem } from "../utils.js";
import Actor, { SpritesNames } from "./Actor.js";

export default class Cactus extends Actor {
  speed: number;
  variatns: SpritesNames[];

  constructor(imageData?: ImageData) {
    super(imageData);
    this.speed = 0;
    this.variatns = ["cactus", "cactusDouble", "cactusDoubleB", "cactusTriple"];
    this.sprite = randItem(this.variatns);
  }

  nextFrame() {
    this.x = this.x - this.speed;
  }
}
