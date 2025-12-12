// src/game/quantity/quantityTypes.ts
export type CountLevel = {
  id: number;
  number: 1|2;
  title: string;
  name: string;
  objectIcon: string[];
  objectCount: number;
  maxCircles: number;
  promptKey?: string;
  correctVoiceKey?: string;
  correctDrawVoiceKey?: string;
};
