

export type HowlerSoundDef = { src: string; volume?: number; loop?: boolean;  html5?: boolean; };

export type AssetItem = { key: string; url: string };

export const QUANTITY_IMAGES: AssetItem[] = [
  // bé
  { key: 'avata_child', url: 'assets/images/characters/avata_child.png' },

  // bóng bay
  { key: 'balloon',  url: 'assets/images/animals/ballon_BLUE.png' },
  { key: 'balloon1', url: 'assets/images/animals/ballon_GREEN.png' },
  { key: 'balloon2', url: 'assets/images/animals/ballon_PURPLE.png' },
  { key: 'balloon3', url: 'assets/images/animals/ballon_RED.png' },
  { key: 'balloon4', url: 'assets/images/animals/ballon_YELLOW.png' },

  // lật đật
  { key: 'hustle', url: 'assets/images/animals/hustle.png' },

  

  // UI
  { key: 'circle_empty', url: 'assets/images/ui/circle.png' },
  { key: 'circle_filled', url: 'assets/images/ui/circle_filled.png' },
  { key: 'objects_panel', url: 'assets/images/ui/board.png' },
  { key: 'title_banner', url: 'assets/images/ui/title_banner.png' },
  { key: 'hint_finger', url: 'assets/images/ui/hand.png' },
  { key: 'icon_check_true', url: 'assets/images/ui/check_true.png' },
  { key: 'icon_check_false', url: 'assets/images/ui/check_false.png' },
];

export const QUANTITY_SOUNDS: Record<string, HowlerSoundDef> = {
  //sfx
  "sfx-correct": { src: "assets/audio/sfx/correct.mp3", volume: 0.9 },
  "sfx-wrong":   { src: "assets/audio/sfx/wrong.mp3",   volume: 0.03 },
  "sfx-click":   { src: "assets/audio/sfx/click.mp3",   volume: 0.2 },
  "complete":   { src: 'assets/audio/sfx/complete.mp3', volume: 1.0 },
  "fireworks":   { src: 'assets/audio/sfx/fireworks.mp3', loop: true,  volume: 0.2 },
  "applause":   { src: 'assets/audio/sfx/click.mp3',   volume: 0.2 },

  //hướng dẫn (prompt)
  "prompt_quantity_1": { src: "assets/audio/prompt/prompt_draw_hustle.mp3", volume: 1.0 },
  "prompt_quantity_2": { src: "assets/audio/prompt/prompt_draw_ballon.mp3", volume: 1.0 },

  //khen
  "correct_quantity_1": { src: "assets/audio/sfx/correct_answer.mp3", volume: 0.9 },
  "correct_quantity_2": { src: "assets/audio/sfx/correct_answer.mp3", volume: 0.9 },

  // đúng khi tô
  "correct_draw_ballon": { src: "assets/audio/sfx/correct_draw_ballon.mp3", volume: 1.0 },
  "correct_draw_hustle": { src: "assets/audio/sfx/correct_draw_hustle.mp3", volume: 1.0 },

  //đếm số
  "count_1": { src: "assets/audio/count/number_one.mp3",   volume: 1.0 },
  "count_2": { src: "assets/audio/count/number_two.mp3",   volume: 1.0 },

  //khác
  "voice_try_again": { src: "assets/audio/prompt/retry_draw.mp3", volume: 1.0 },

   "bgm_quantity": { src: "assets/audio/bg/music_bg.mp3", loop: true, volume: 0.2 },
};
