export default class GameRunner {
  looping: boolean;
  preloaded: boolean;

  targetFrameRate: number;
  frameRate: number;
  frameCount: number;
  stepFrames: number | null;
  private _lastFrameTime;

  __loop: any;

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

  async start(paused = false) {
    if (!this.preloaded) {
      await this.preload();
      this.preloaded = true;
    }
    this.looping = true;
    if (!paused) {
      window.requestAnimationFrame(this.__loop);
    }
  }

  async preload() {}

  stop() {
    this.looping = false;
  }

  step(frames = 1) {
    if (this.stepFrames) {
      this.stepFrames += frames;
    } else {
      this.stepFrames = frames;
    }

    this.__loop();
  }

  onFrame() {}

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
