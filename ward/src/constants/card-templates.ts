export type CardGradient = {
  colors: [string, string, string];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

export type CardTemplate = {
  id: string;
  name: string;
  gradient: CardGradient;
  accent: string;
};

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'obsidian',
    name: 'Obsidiana',
    gradient: { colors: ['#1a1a2e', '#16213e', '#0f3460'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#e94560',
  },
  {
    id: 'ember',
    name: 'Brasa',
    gradient: { colors: ['#3d0000', '#7a1f1f', '#c0392b'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#ff8a65',
  },
  {
    id: 'forest',
    name: 'Bosque',
    gradient: { colors: ['#0a2e1a', '#1b5e20', '#2e7d32'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#a5d6a7',
  },
  {
    id: 'arctic',
    name: 'Ártico',
    gradient: { colors: ['#006064', '#00838f', '#26c6da'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#e0f7fa',
  },
  {
    id: 'dusk',
    name: 'Crepúsculo',
    gradient: { colors: ['#1a0533', '#4a148c', '#7b1fa2'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#ce93d8',
  },
  {
    id: 'sand',
    name: 'Arena',
    gradient: { colors: ['#3e2723', '#795548', '#a1887f'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#efebe9',
  },
  {
    id: 'slate',
    name: 'Pizarra',
    gradient: { colors: ['#263238', '#37474f', '#546e7a'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#b0bec5',
  },
  {
    id: 'midnight',
    name: 'Medianoche',
    gradient: { colors: ['#0d0d0d', '#1c1c2e', '#2c2c54'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#a78bfa',
  },
  {
    id: 'gold',
    name: 'Oro',
    gradient: { colors: ['#1a0f00', '#5d4037', '#8d6e63'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#ffd54f',
  },
  {
    id: 'copper',
    name: 'Cobre',
    gradient: { colors: ['#2e1500', '#bf360c', '#e64a19'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#ffccbc',
  },
  {
    id: 'ocean',
    name: 'Océano',
    gradient: { colors: ['#01182a', '#01579b', '#0288d1'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#b3e5fc',
  },
  {
    id: 'neon',
    name: 'Neón',
    gradient: { colors: ['#0a0a0a', '#1a1a1a', '#111827'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#39ff14',
  },
  {
    id: 'wine',
    name: 'Vino',
    gradient: { colors: ['#1b0012', '#6a0572', '#880e4f'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#f48fb1',
  },
  {
    id: 'ice',
    name: 'Hielo',
    gradient: { colors: ['#e3f2fd', '#bbdefb', '#90caf9'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#0d47a1',
  },
  {
    id: 'charcoal',
    name: 'Carbón',
    gradient: { colors: ['#1c1c1c', '#2d2d2d', '#3d3d3d'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#f2542d',
  },
  {
    id: 'mint',
    name: 'Menta',
    gradient: { colors: ['#003828', '#00695c', '#00897b'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#b2dfdb',
  },
  {
    id: 'rose',
    name: 'Rosa',
    gradient: { colors: ['#880e4f', '#ad1457', '#e91e63'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#fce4ec',
  },
  {
    id: 'indigo',
    name: 'Índigo',
    gradient: { colors: ['#1a237e', '#283593', '#3949ab'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#c5cae9',
  },
  {
    id: 'smoke',
    name: 'Humo',
    gradient: { colors: ['#f5f5f5', '#e0e0e0', '#bdbdbd'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#212121',
  },
  {
    id: 'volcanic',
    name: 'Volcánico',
    gradient: { colors: ['#1a0000', '#4e0000', '#8b0000'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    accent: '#ff8a65',
  },
];

export function getTemplate(id: string | undefined): CardTemplate {
  return CARD_TEMPLATES.find((t) => t.id === id) ?? CARD_TEMPLATES[0];
}
