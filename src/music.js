import campusLoop from "../assets/campus-loop.mp3";
import tickingClock from "../assets/ticking-clock.mp3";
import { getAudioVolume, subscribeAudioVolume } from "./audio-settings.js";

const music = new Audio();
music.loop = true;
music.volume = getAudioVolume("music");

let activeTrack;
let pausedByGame = false;

function playMusic() {
  if (pausedByGame) return;
  if (music.paused) void music.play().catch(() => {});
}

subscribeAudioVolume((kind, volume) => { if (kind === "music") music.volume = volume; });

export function setMusicPaused(paused) {
  pausedByGame = paused;
  if (paused) music.pause();
  else playMusic();
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
