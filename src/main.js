import { initScene, spawnPlayers, playAttackAnimation } from "./scene/scene.js";
import { initUI, updateHPUI } from "./ui/ui.js";

// ----- GAME STATE -----
let state = { playerHP: 100, enemyHP: 100, turn: "player" };

// ----- INIT SCENE -----
const canvas = document.getElementById("scene");
const sceneAPI = initScene(canvas);
spawnPlayers();

// ----- INIT UI -----
initUI({
  onAttack: (type) => {
    if (state.turn !== "player") return;
    handleAttack(type, "player");
  }
});

// ----- ATTACK LOGIC -----
function handleAttack(type, attacker) {
  const attackMap = { tackle: 12, flame: 20, heal: -15 };
  const dmg = attackMap[type] ?? 10;

  playAttackAnimation(type);

  if (type === "heal") state.playerHP = Math.min(state.playerHP - dmg, 100);
  else if (attacker === "player") state.enemyHP = Math.max(state.enemyHP - dmg, 0);
  else state.playerHP = Math.max(state.playerHP - dmg, 0);

  updateHPUI(state);

  state.turn = attacker === "player" ? "enemy" : "player";

  if (state.turn === "enemy") {
    setTimeout(() => {
      const attacks = ["tackle", "flame"];
      const enemyAttack = attacks[Math.floor(Math.random()*attacks.length)];
      handleAttack(enemyAttack, "enemy");
    }, 1200);
  }
}
