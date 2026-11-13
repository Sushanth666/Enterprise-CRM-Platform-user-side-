import { ColorTheme } from '@/store/uiSlice';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  color: string;
  description: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'sunset-copper',
    name: 'Sunset Copper',
    color: 'bg-gradient-to-tr from-[#ca5e3a] to-[#e08a68]',
    description: 'Exact Dark Espresso & Sunset Copper',
  },
  {
    id: 'sapphire',
    name: 'Sapphire Blue',
    color: 'bg-blue-600',
    description: 'Enterprise & Salesforce Style',
  },
];
