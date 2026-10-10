import campusLoop from "./assets/campus-loop.mp3";
import tickingClock from "./assets/ticking-clock.mp3";

const music = new Audio();
music.loop = true;
music.volume = 0.3;

let activeTrack;

function playMusic() {
  if (music.paused) void music.play().catch(() => {});
}

// Browsers may require the first player interaction before allowing audio.
window.addEventListener("pointerdown", playMusic);
window.addEventListener("keydown", playMusic);

export function syncLevelMusic(level) {
  const track = level >= 15 ? tickingClock : campusLoop;
  if (track !== activeTrack) {
    activeTrack = track;
    music.src = track;
  }
  playMusic();
}
