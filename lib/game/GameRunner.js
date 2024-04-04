var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class GameRunner {
    constructor() {
        this.looping = false;
        this.preloaded = false;
        this.targetFrameRate = 60;
        this.frameRate = 0;
        this.frameCount = 0;
        this.stepFrames = null;
        this._lastFrameTime = window.performance.now();
        this.__loop = this._loop.bind(this);
    }
    start(paused = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.preloaded) {
                yield this.preload();
                this.preloaded = true;
            }
            this.looping = true;
            if (!paused) {
                window.requestAnimationFrame(this.__loop);
            }
        });
    }
    preload() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    stop() {
        this.looping = false;
    }
    step(frames = 1) {
        if (this.stepFrames) {
            this.stepFrames += frames;
        }
        else {
            this.stepFrames = frames;
        }
        this.__loop();
    }
    onFrame() { }
    _loop() {
        const now = window.performance.now();
        const timeSinceLast = now - this._lastFrameTime;
        const targetTimeBetweenFrames = 1000 / this.targetFrameRate;
        if (timeSinceLast >= targetTimeBetweenFrames - 5) {
            this.onFrame();
            this.frameRate = 1000 / (now - this._lastFrameTime);
            this._lastFrameTime = now;
            this.frameCount++;
        }
        if (this.looping) {
            window.requestAnimationFrame(this.__loop);
        }
    }
}
