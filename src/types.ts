export type Language = 'zh-CN' | 'en' | 'zh-TW' | 'ja' | 'ko';

export interface ElementTranslation {
  name: string;
  symbol: string;
  category: string;
  description: string;
  story: string;
}

import { ElementPhysicalProperty } from './data/elementProperties';

export interface PeriodicElement {
  number: number;
  symbol: string;
  weight: string;
  category: Category;
  group: number;
  period: number;
  translations: Record<Language, ElementTranslation>;
  properties?: ElementPhysicalProperty;
}

export const CATEGORIES = [
  'alkali-metal',
  'alkaline-earth-metal',
  'transition-metal',
  'post-transition-metal',
  'metalloid',
  'reactive-nonmetal',
  'noble-gas',
  'lanthanide',
  'actinide',
  'unknown'
] as const;

export type Category = typeof CATEGORIES[number];
