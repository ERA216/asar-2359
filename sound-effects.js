import partPickup from "./assets/part-pickup.mp3";
import coinPickup from "./assets/coin-pickup.mp3";
import victory from "./assets/victory.mp3";
import defeat from "./assets/defeat.mp3";
import { getAudioVolume, subscribeAudioVolume } from "./audio-settings.js";

const effects = {
  part: new Audio(partPickup),
  coin: new Audio(coinPickup),
  victory: new Audio(victory),
  defeat: new Audio(defeat),
};

for (const sound of Object.values(effects)) {
  sound.preload = "auto";
  sound.volume = getAudioVolume("effects");
}

subscribeAudioVolume((kind, volume) => {
  if (kind === "effects") for (const sound of Object.values(effects)) sound.volume = volume;
});

export function playEffect(name) {
  const sound = effects[name];
  if (!sound) return;
  try {
    sound.pause();
    sound.currentTime = 0;
    void sound.play().catch(() => {});
  } catch { /* Audio failures must not interrupt a move. */ }
}
