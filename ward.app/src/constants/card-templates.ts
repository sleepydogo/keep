/**
 * 20 distinct card visual templates for WARD.
 * Each one has a unique gradient + accent color so they never look the same.
 * Backgrounds are intentionally varied: dark, light, warm, cool, neon, earthy, etc.
 */
export type CardTemplate = {
  id: string;
  name: string;
  gradient: string;
  accent: string; // text / icon accent inside the card
};

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: 'obsidian',
    name: 'Obsidiana',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accent: '#e94560',
  },
  {
    id: 'ember',
    name: 'Brasa',
    gradient: 'linear-gradient(135deg, #3d0000 0%, #7a1f1f 50%, #c0392b 100%)',
    accent: '#ff8a65',
  },
  {
    id: 'forest',
    name: 'Bosque',
    gradient: 'linear-gradient(135deg, #0a2e1a 0%, #1b5e20 50%, #2e7d32 100%)',
    accent: '#a5d6a7',
  },
  {
    id: 'arctic',
    name: 'Ártico',
    gradient: 'linear-gradient(135deg, #006064 0%, #00838f 50%, #26c6da 100%)',
    accent: '#e0f7fa',
  },
  {
    id: 'dusk',
    name: 'Crepúsculo',
    gradient: 'linear-gradient(135deg, #1a0533 0%, #4a148c 50%, #7b1fa2 100%)',
    accent: '#ce93d8',
  },
  {
    id: 'sand',
    name: 'Arena',
    gradient: 'linear-gradient(135deg, #3e2723 0%, #795548 50%, #a1887f 100%)',
    accent: '#efebe9',
  },
  {
    id: 'slate',
    name: 'Pizarra',
    gradient: 'linear-gradient(135deg, #263238 0%, #37474f 50%, #546e7a 100%)',
    accent: '#b0bec5',
  },
  {
    id: 'midnight',
    name: 'Medianoche',
    gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1c1c2e 50%, #2c2c54 100%)',
    accent: '#a78bfa',
  },
  {
    id: 'gold',
    name: 'Oro',
    gradient: 'linear-gradient(135deg, #1a0f00 0%, #5d4037 50%, #8d6e63 100%)',
    accent: '#ffd54f',
  },
  {
    id: 'copper',
    name: 'Cobre',
    gradient: 'linear-gradient(135deg, #2e1500 0%, #bf360c 50%, #e64a19 100%)',
    accent: '#ffccbc',
  },
  {
    id: 'ocean',
    name: 'Océano',
    gradient: 'linear-gradient(135deg, #01182a 0%, #01579b 50%, #0288d1 100%)',
    accent: '#b3e5fc',
  },
  {
    id: 'neon',
    name: 'Neón',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #111827 100%)',
    accent: '#39ff14',
  },
  {
    id: 'wine',
    name: 'Vino',
    gradient: 'linear-gradient(135deg, #1b0012 0%, #6a0572 50%, #880e4f 100%)',
    accent: '#f48fb1',
  },
  {
    id: 'ice',
    name: 'Hielo',
    gradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
    accent: '#0d47a1',
  },
  {
    id: 'charcoal',
    name: 'Carbón',
    gradient: 'linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 50%, #3d3d3d 100%)',
    accent: '#f2542d',
  },
  {
    id: 'mint',
    name: 'Menta',
    gradient: 'linear-gradient(135deg, #003828 0%, #00695c 50%, #00897b 100%)',
    accent: '#b2dfdb',
  },
  {
    id: 'rose',
    name: 'Rosa',
    gradient: 'linear-gradient(135deg, #880e4f 0%, #ad1457 50%, #e91e63 100%)',
    accent: '#fce4ec',
  },
  {
    id: 'indigo',
    name: 'Índigo',
    gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)',
    accent: '#c5cae9',
  },
  {
    id: 'smoke',
    name: 'Humo',
    gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #bdbdbd 100%)',
    accent: '#212121',
  },
  {
    id: 'volcanic',
    name: 'Volcánico',
    gradient: 'linear-gradient(135deg, #1a0000 0%, #4e0000 40%, #8b0000 70%, #d32f2f 100%)',
    accent: '#ff8a65',
  },
];

export function getTemplate(id: string | undefined): CardTemplate {
  return CARD_TEMPLATES.find((t) => t.id === id) ?? CARD_TEMPLATES[0];
}
