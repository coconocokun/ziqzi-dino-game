import Actor from "./Actor.js";
export default class Dino extends Actor {
    vVelocity;
    gravity;
    baseY;
    relativeY;
    lift;
    constructor(imageData) {
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
    set dy(value) {
        this.baseY = value;
    }
    get bottomY() {
        return this.height + this.dy;
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
        }
        else {
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
    hits(actors) {
        return actors.some((actor) => {
            if (!actor) {
                return false;
            }
            if (this.x >= actor.rightX || actor.x >= this.rightX) {
                return false;
            }
            if (this.dy >= actor.bottomY || actor.y >= this.bottomY) {
                console.log("y position not satisified");
                console.log("dy: " + this.dy);
                console.log("bottomY: " + this.bottomY);
                console.log("actor bottom: " + actor.bottomY);
                console.log("actor y: " + actor.y);
                return false;
            }
            return true;
        });
    }
}
