// A short two-step stride keeps the tiny pixel sprites readable while moving.
export function animateWalk(body, duration = 180, lift = -3) {
  body.animate([
    { transform: "translateY(0)" },
    { transform: `translateY(${lift}px)`, offset: .45 },
    { transform: "translateY(0)" },
  ], { duration, easing: "steps(4, end)" });

  for (const [side, forward] of [["left", -2], ["right", 2]]) {
    body.querySelector(`.walk-leg--${side}`)?.animate([
      { transform: "translate(0, 0)" },
      { transform: `translate(${forward}px, -2px)`, offset: .3 },
      { transform: `translate(${-forward}px, 0)`, offset: .7 },
      { transform: "translate(0, 0)" },
    ], { duration, easing: "steps(4, end)" });
  }
}
