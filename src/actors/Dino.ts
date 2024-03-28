import Actor from "./Actor";

export default class Dino extends Actor {
  vVelocity: number | null;
  gravity: number;
  baseY: number;
  relativeY: number;
  lift: number;

  constructor(imageData?: ImageData) {
    super(imageData);
    this.vVelocity = null; // from minus to plus
    this.gravity = 0;
    this.baseY = 0; // always plus. constant
    this.relativeY = 0; // always minus
    this.lift = 0;
    this.sprite = "dino";
  }

  get dy() {
    return this.baseY - this.height + this.relativeY;
  }

  reset() {
    this.vVelocity = null;
    this.relativeY = 0;
  }

  jump() {
    // button clicked -> return true if possible
    // return false if already jumping
    if (this.relativeY == 0) {
      this.vVelocity = -this.lift;
      return true;
    } else {
      return false;
    }
  }

  nextFrame() {
    if (this.vVelocity != null) {
      this.vVelocity += this.gravity;
      this.relativeY += this.vVelocity;
    }

    if (this.relativeY > 0) {
      this.vVelocity = null;
      this.relativeY = 0;
    }
  }
}
