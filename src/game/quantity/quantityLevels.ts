// src/game/quantity/quantityLevels.ts
import type { CountLevel } from './quantityTypes';

export function buildQuantityLevels(): CountLevel[] {
  return [
    {
      id: 1,
      number: 1,
      title: 'SỐ LƯỢNG 1',
      name: 'con lật đật',
      objectIcon: ['hustle'],
      objectCount: 1,
      maxCircles: 4,
      promptKey: 'prompt_quantity_1',
      correctVoiceKey: 'correct_quantity_1',
      correctDrawVoiceKey: 'correct_draw_hustle',
    },
    {
      id: 2,
      number: 2,
      title: 'SỐ LƯỢNG 2',
      name: 'quả bóng bay',
      objectIcon: [
        'balloon',
        'balloon1',
        'balloon2',
        'balloon3',
        'balloon4',
      ],
      objectCount: 2,
      maxCircles: 4,
      promptKey: 'prompt_quantity_2',
      correctVoiceKey: 'correct_quantity_1',
      correctDrawVoiceKey: 'correct_draw_ballon',
    },
  ]
}
