// What the pen writes on the doodle board in About, in order.
// Coordinates are in the board's 800×440 drawing space. Text steps are revealed left to right
// at their measured width; path steps are traced along the path, so keep `d` hand-drawn and loose.

export type DoodleStep =
  | { kind: 'text'; text: string; x: number; y: number; size: number; color: string }
  | { kind: 'path'; d: string; color: string; width?: number }

const INK = '#202124'
const COBALT = '#3657D6'
const TANGERINE = '#F28B54'

export const doodleSteps: DoodleStep[] = [
  { kind: 'text', text: 'Hi, I’m Hridya!', x: 70, y: 92, size: 58, color: INK },
  { kind: 'path', d: 'M72 112 C 130 103, 190 121, 250 110 S 370 103, 418 114', color: COBALT, width: 3 },
  { kind: 'path', d: 'M500 38 L508 61 L532 62 L513 76 L520 99 L500 85 L480 99 L487 76 L468 62 L492 61 Z', color: TANGERINE, width: 2.5 },
  { kind: 'text', text: 'I build full-stack apps & poke at ML', x: 70, y: 158, size: 34, color: INK },
  { kind: 'path', d: 'M670 70 L650 88 L670 106 M702 62 L688 114 M718 70 L738 88 L718 106', color: COBALT, width: 3 },
  { kind: 'text', text: '230+ LeetCode problems, mostly in C++', x: 70, y: 218, size: 34, color: INK },
  { kind: 'text', text: 'debater · MUN delegate · 180DC', x: 70, y: 278, size: 34, color: INK },
  { kind: 'text', text: 'always asking:', x: 70, y: 338, size: 34, color: INK },
  { kind: 'text', text: 'but why?', x: 292, y: 340, size: 42, color: COBALT },
  {
    kind: 'path',
    d: 'M284 318 C 290 290, 424 288, 436 318 C 448 348, 302 354, 282 332 C 274 318, 298 302, 322 300',
    color: TANGERINE,
    width: 2.5,
  },
  { kind: 'path', d: 'M446 336 C 505 356, 565 376, 628 377 M612 365 L629 377 L612 389', color: INK, width: 2 },
  {
    kind: 'path',
    d: 'M680 398 C 648 384, 648 332, 690 326 C 732 332, 732 384, 700 398 L 698 412 L 682 412 Z M684 420 L 696 420 M690 300 L 690 313 M652 318 L 660 326 M728 318 L 720 326',
    color: TANGERINE,
    width: 2.5,
  },
]
