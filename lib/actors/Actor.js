"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sprites_1 = __importDefault(require("../sprites"));
const cache = new Map();
// analyze the pixels and create a map of the transparent
// and non-transparent pixels for hit testing
function getSpriteAlphaMap(imageData, name) {
    if (cache.has(name)) {
        return cache.get(name);
    }
    const sprite = sprites_1.default[name];
    const lines = [];
    const initIVal = imageData.width * sprite.y * 4;
    // for each line of pixels
    for (let i = initIVal; i < initIVal + sprite.h * imageData.width * 4; 
    // (increments by 8 because it skips every other pixel due to pixel density)
    i += imageData.width * 8) {
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
class Actor {
}
exports.default = Actor;
