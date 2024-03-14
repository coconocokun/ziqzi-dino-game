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
exports.playSound = void 0;
const AudioContext = window.AudioContext;
const audioContext = new AudioContext();
const soundNames = ["game-over", "jump", "level-up"];
const soundBuffers = {};
let SOUNDS_LOADED = false;
loadSounds().catch(console.error);
function playSound(name) {
    if (SOUNDS_LOADED) {
        audioContext.resume();
        playBuffer(soundBuffers[name]);
    }
}
exports.playSound = playSound;
function loadSounds() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(soundNames.map((soundName) => __awaiter(this, void 0, void 0, function* () {
            soundBuffers[soundName] = yield loadBuffer(`./assets/${soundName}.mp3`);
        })));
        SOUNDS_LOADED = true;
    });
}
function loadBuffer(filepath) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", filepath);
        request.responseType = "arraybuffer";
        request.onload = () => audioContext.decodeAudioData(request.response, resolve);
        request.onerror = reject;
        request.send();
    });
}
function playBuffer(buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
}
