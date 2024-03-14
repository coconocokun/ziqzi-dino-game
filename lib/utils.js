"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.randItem = exports.randBoolean = exports.randInteger = exports.loadFont = exports.loadImage = exports.getImageData = void 0;
function getImageData(image) {
    const { width, height } = image;
    const tmpCanvas = document.createElement("canvas");
    const ctx = tmpCanvas.getContext("2d");
    let result;
    tmpCanvas.width = width;
    tmpCanvas.height = height;
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(image, 0, 0);
    result = ctx === null || ctx === void 0 ? void 0 : ctx.getImageData(0, 0, width, height);
    tmpCanvas.remove();
    return result;
}
exports.getImageData = getImageData;
function loadImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = url;
        });
    });
}
exports.loadImage = loadImage;
function getFontName(url) {
    const ext = url.slice(url.lastIndexOf("."));
    const pathParts = url.split("/");
    return pathParts[pathParts.length - 1].slice(0, -1 * ext.length);
}
function loadFont(url, fontName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fontName)
            fontName = getFontName(url);
        const styleEl = document.createElement("style");
        styleEl.innerHTML = `
    @font-face {
      font-family: ${fontName};
      src: url(${url});
    }
  `;
        document.head.appendChild(styleEl);
        yield document.fonts.load(`12px ${fontName}`);
    });
}
exports.loadFont = loadFont;
function randInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.randInteger = randInteger;
function randBoolean() {
    return Boolean(randInteger(0, 1));
}
exports.randBoolean = randBoolean;
function randItem(arr) {
    return arr[randInteger(0, arr.length - 1)];
}
exports.randItem = randItem;
