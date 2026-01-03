// client/src/main.js
import { initScene, updateScene, setPlayerModels } from "./scene/scene.js";
import { initUI, updateHPUI } from "./ui/ui.js";
import { initNetwork } from "./net/socket.js";

// ----- GLOBAL CLIENT STATE -----
export const state = {
  roomId: null,
  playerId: null,
  isHost: false,
  hp: {
    player: 100,
    enemy: 100
  }
};

// ----- INIT EVERYTHING -----
const canvas = document.getElementById("scene");

// 1️⃣ 3D SCENE
const sceneAPI = initScene(canvas);

// 2️⃣ UI
initUI({
  onAttack: (attackType) => {
    if (!state.roomId) return;
    sceneAPI.playAttackAnimation();
    network.sendAttack(attackType);
  }
});

// 3️⃣ NETWORK
const network = initNetwork({
  onRoomJoined: ({ roomId, playerId, isHost }) => {
    state.roomId = roomId;
    state.playerId = playerId;
    state.isHost = isHost;
  },

  onBattleStart: () => {
    sceneAPI.spawnPlayers();
  },

  onStateUpdate: (serverState) => {
    state.hp.player = serverState.players[state.playerId].hp;
    state.hp.enemy = Object.values(serverState.players)
      .find(p => p.id !== state.playerId).hp;

    updateHPUI(state.hp);
    updateScene(serverState);
  },

  onPlayerLeft: () => {
    alert("Opponent disconnected");
    location.reload();
  }
});

// ----- RENDER LOOP -----
function animate() {
  sceneAPI.update();
  requestAnimationFrame(animate);
}
animate();

