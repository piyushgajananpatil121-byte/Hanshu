export function initUI({ onAttack }) {
  const buttons = document.querySelectorAll(".actions button");
  buttons.forEach(btn => btn.addEventListener("click", () => onAttack(btn.dataset.attack)));
  updateHPUI({ playerHP: 100, enemyHP: 100 });
}

export function updateHPUI(state) {
  document.getElementById("player-hp").style.width = state.playerHP + "%";
  document.getElementById("enemy-hp").style.width = state.enemyHP + "%";

  document.getElementById("player-hp").style.background = `linear-gradient(90deg, #4aff80, #00c800)`;
  document.getElementById("enemy-hp").style.background = `linear-gradient(90deg, #ff5555, #aa0000)`;
}
