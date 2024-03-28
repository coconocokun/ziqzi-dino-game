import DinoGame from "./game/DinoGame";

const game = new DinoGame(600, 100);

const keycodes = {
  // up, spacebar
  JUMP: { 38: 1, 32: 1 },
  // down
  DUCK: { 40: 1 },
};

// Input gate
document.addEventListener("keydown", (e) => {});
