import sprites from "../sprites";

const cache = new Map();

export type SpritesNames =
  | "birdUp"
  | "birdDown"
  | "cactus"
  | "cactusDouble"
  | "cactusDoubleB"
  | "cactusTriple"
  | "cloud"
  | "dino"
  | "dinoDuckLeftLeg"
  | "dinoDuckRightLeg"
  | "dinoLeftLeg"
  | "dinoRightLeg"
  | "ground"
  | "replayIcon";

// analyze the pixels and create a map of the transparent
// and non-transparent pixels for hit testing
function getSpriteAlphaMap(imageData: ImageData, name: SpritesNames) {
  if (cache.has(name)) {
    return cache.get(name);
  }

  const sprite = sprites[name];
  const lines = [];
  const initIVal = imageData.width * sprite.y * 4;

  // for each line of pixels
  for (
    let i = initIVal;
    i < initIVal + sprite.h * imageData.width * 4;
    // (increments by 8 because it skips every other pixel due to pixel density)
    i += imageData.width * 8
  ) {
    const line = [];
    const initJVal = i + sprite.x * 4;
    // for each pixel in the line
    // (increments by 8 because it skips every other pixel due to pixel density)
    for (let j = initJVal; j < initJVal + sprite.w * 4; j += 8) {
      // 0 for transparent, 1 for not
      line.push(imageData.data[j + 3] === 0 ? 0 : 1);
    }

    lines.push(line);
  }

  cache.set(name, lines);
  return lines;
}

export default class Actor {
  private _sprite: SpritesNames;
  x: number;
  y: number;
  height: number;
  width: number;
  imageData?: ImageData;
  alphaMap: any;

  constructor(imageData?: ImageData) {
    this._sprite = "birdDown";
    this.height = 0;
    this.width = 0;
    this.x = 0;
    this.y = 0;

    if (imageData) {
      this.imageData = imageData;
      this.alphaMap = [];
    }
  }

  set sprite(name: SpritesNames) {
    this._sprite = name;
    this.height = sprites[name].h / 2;
    this.width = sprites[name].w / 2;

    if (this.imageData) {
      this.alphaMap = getSpriteAlphaMap(this.imageData, name);
    }
  }

  get sprite() {
    return this._sprite;
  }

  get rightX() {
    return this.width + this.x;
  }

  get bottomY() {
    return this.height + this.y;
  }

  hits(actors: Actor[]) {
    return actors.some((actor) => {
      if (!actor) {
        return false;
      }

      if (this.x >= actor.rightX || actor.x >= this.rightX) {
        return false;
      }

      if (this.y >= actor.bottomY || actor.y >= this.bottomY) {
        return false;
      }

      return true;
    });
  }
}

const tester = new Actor();
tester.sprite = "birdDown";
