var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Dino from "../actors/Dino.js";
import { getImageData, loadFont, loadImage, randInteger } from "../utils.js";
import GameRunner from "./GameRunner.js";
import sprites from "../sprites.js";
import Cactus from "../actors/Cactus.js";
import { playSound } from "../sounds.js";
import Cloud from "../actors/Cloud.js";
export default class DinoGame extends GameRunner {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
        const { canvas, ctx } = this.createCanvas(width, height);
        this.canvas = canvas;
        this.canvasCtx = ctx;
        this.spriteImage = null;
        this.spriteImageData = null;
        this.defaultSettings = {
            bgSpeed: 8,
            cactiSpawnRate: 50,
            cloudSpawnRate: 60,
            dinoGravity: 0.5,
            dinoGroundOffset: 4,
            dinoLift: 10,
            dinoX: 25,
        };
        this.state = {
            settings: Object.assign({}, this.defaultSettings),
            dino: null,
            cacti: [],
            cloud: [],
            gameOver: false,
            isRunning: false,
            groundX: 0,
            groundY: 0,
            score: {
                value: 0,
                frame: 0,
                frameRate: 6,
            },
        };
    }
    createCanvas(width, height) {
        // Create HTML canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const scale = window.devicePixelRatio;
        // canvas width, height, style....
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.width = Math.floor(width * scale);
        canvas.height = Math.floor(height * scale);
        ctx === null || ctx === void 0 ? void 0 : ctx.scale(scale, scale);
        // Append the canvas to the HTML document
        document.body.appendChild(canvas);
        return { canvas, ctx };
    }
    preload() {
        return __awaiter(this, void 0, void 0, function* () {
            // Load assets (image, inital state)
            const { settings } = this.state;
            const [spriteImage] = yield Promise.all([
                loadImage("./assets/sprite.png"),
                loadFont("./assets/PressStart2P-Regular.ttf", "PressStart2P"),
            ]);
            this.spriteImage = spriteImage;
            this.spriteImageData = getImageData(this.spriteImage);
            const dino = new Dino(this.spriteImageData);
            dino.lift = settings.dinoLift;
            dino.gravity = settings.dinoGravity;
            dino.x = settings.dinoX;
            dino.baseY = this.height - settings.dinoGroundOffset;
            this.state.dino = dino;
            this.state.groundY = this.height - sprites.ground.h / 2;
        });
    }
    onInput() {
        const state = this.state;
        // if running -> dino jump
        if (state.isRunning) {
            if (state.dino.jump()) {
                playSound("jump");
            }
        }
        else {
            this.reset();
        }
        // if gameover -> game reset
    }
    reset() {
        // Initialize dino position
        this.state.dino.reset();
        // Initialize all other objects (ground, cactus)
        Object.assign(this.state, {
            settings: Object.assign({}, this.defaultSettings),
            cacti: [],
            gameOver: false,
            isRunning: true,
            score: {
                value: 0,
                frame: 0,
                frameRate: 6,
            },
        });
        // Initialize score
        // restart the game
        this.start();
    }
    onFrame() {
        this.drawBackground();
        // Draw Grond
        this.drawGround();
        // Draw Dino
        this.drawDino();
        this.drawCloud();
        // Draw Score
        this.drawScore();
        if (this.state.isRunning) {
            // Draw Cactus
            this.drawCactus();
            if (this.state.dino.hits(this.state.cacti)) {
                console.log("game over");
                playSound("game-over");
                this.state.gameOver = true;
            }
            if (this.state.gameOver) {
                // end game
                this.endGame();
            }
        }
        // if gameover -> end game
    }
    endGame() {
        // stop the game
        this.stop();
        this.state.isRunning = false;
        // game over text
        this.paintText("GAME OVER", this.width / 2, this.height / 2 - 10, {
            font: "PressStart2P",
            size: "12px",
            align: "center",
            baseline: "bottom",
            color: "#535353",
        });
    }
    drawBackground() {
        // draw gray rectangle
        this.canvasCtx.fillStyle = "#f7f7f7";
        this.canvasCtx.fillRect(0, 0, this.width, this.height);
    }
    drawGround() {
        // bgSpeed;
        const state = this.state;
        const bgSpeed = state.settings.bgSpeed;
        const groundImageWidth = sprites.ground.w / 2;
        this.paintSprite("ground", state.groundX, state.groundY);
        state.groundX = state.groundX - bgSpeed;
        // append other ground if first ground passed
        if (state.groundX <= -groundImageWidth + this.width) {
            this.paintSprite("ground", state.groundX + groundImageWidth, state.groundY);
            if (state.groundX <= -groundImageWidth) {
                state.groundX = -bgSpeed;
            }
        }
    }
    drawCactus() {
        const state = this.state;
        const cacti = state.cacti;
        const settings = state.settings;
        this.progressInstances(cacti);
        if (this.frameCount % settings.cactiSpawnRate == 0) {
            // spawn new cacti
            const newCacti = new Cactus(this.spriteImageData);
            newCacti.speed = settings.bgSpeed;
            newCacti.x = this.width;
            newCacti.y = this.height - newCacti.height - 2;
            cacti.push(newCacti);
        }
        for (let i = 0; i < cacti.length; i++) {
            const element = cacti[i];
            this.paintSprite(element.sprite, element.x, element.y);
        }
    }
    drawCloud() {
        const state = this.state;
        const cloud = state.cloud;
        const settings = state.settings;
        this.progressInstances(cloud);
        if (this.frameCount % settings.cloudSpawnRate == 0) {
            // spawn new cacti
            const newCloud = new Cloud(this.spriteImageData);
            newCloud.speed = settings.bgSpeed;
            newCloud.x = this.width;
            newCloud.y = this.height - newCloud.height - randInteger(40, 60);
            cloud.push(newCloud);
        }
        for (let i = 0; i < cloud.length; i++) {
            const element = cloud[i];
            this.paintSprite(element.sprite, element.x, element.y);
        }
    }
    drawDino() {
        const dino = this.state.dino;
        dino.nextFrame();
        this.paintSprite(dino.sprite, dino.x, dino.dy);
    }
    drawScore() {
        const { state } = this;
        const fontSize = 12;
        if (state.isRunning) {
            state.score.frame++;
            if (state.score.frame >= state.score.frameRate) {
                state.score.frame = 0;
                state.score.value++;
            }
        }
        // paint text
        this.paintText((state.score.value + "").padStart(5, "0"), this.width, 0, {
            font: "PressStart2P",
            size: `${fontSize}px`,
            align: "right",
            baseline: "top",
            color: "#535353",
        });
    }
    paintText(text, x, y, opts) {
        const { canvasCtx } = this;
        // set font size, font type
        const { font, size } = opts;
        // set font color
        canvasCtx.font = `${size} ${font}`;
        if (opts.color) {
            canvasCtx.fillStyle = opts.color;
        }
        // set alignment
        if (opts.align) {
            canvasCtx.textAlign = opts.align;
        }
        if (opts.baseline) {
            canvasCtx.textBaseline = opts.baseline;
        }
        // draw on the x, y
        canvasCtx.fillText(text, x, y);
    }
    paintSprite(spriteName, dx, dy) {
        const { h, w, x, y } = sprites[spriteName];
        this.canvasCtx.drawImage(this.spriteImage, x, y, w, h, dx, dy, w / 2, h / 2);
    }
    progressInstances(instances) {
        for (let i = instances.length - 1; i >= 0; i--) {
            const element = instances[i];
            element.nextFrame();
            if (element.rightX <= 0) {
                instances.splice(i, 1);
            }
        }
    }
}
