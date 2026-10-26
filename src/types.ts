export type SceneType = 
  | 'cover' 
  | 'letter' 
  | 'gallery' 
  | 'envelope' 
  | 'question' 
  | 'choice' 
  | 'timer' 
  | 'audio' 
  | 'secret' 
  | 'finale' 
  | 'freeform';

export type ElementType = 
  | 'heading' 
  | 'text' 
  | 'typewriter' 
  | 'image' 
  | 'photo-card' 
  | 'button' 
  | 'envelope' 
  | 'secret-card' 
  | 'timer' 
  | 'question' 
  | 'choice' 
  | 'divider' 
  | 'hearts' 
  | 'final-confirm';

export interface SceneElement {
  id: string;
  type: ElementType;
  props: Record<string, any>;
  animation?: {
    type: string;
    duration: number;
    delay: number;
  };
}

export interface Scene {
  id: string;
  title: string;
  type: SceneType;
  background: {
    type: 'gradient' | 'color' | 'image';
    value: string;
  };
  elements: SceneElement[];
  entryAnimation: string;
  exitAnimation: string;
  nextSceneId?: string;
  conditions?: Record<string, any>;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  templateId?: string;
  scenes: Scene[];
  settings: {
    bgColor: string;
    fontFamily: string;
    textColor: string;
    accentColor: string;
    musicUrl?: string;
    musicVolume: number;
    autoplayMusic: boolean;
  };
  status: 'draft' | 'published';
  publishedSlug?: string;
  createdAt: string;
  updatedAt: string;
  responses: RecipientResponse[];
  viewCount: number;
}

export interface RecipientResponse {
  id: string;
  sceneId: string;
  elementId: string;
  answer: string;
  timestamp: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  coverEmoji: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
  scenes: Scene[];
  isFree: boolean;
  tier: 'free' | 'premium' | 'creator';
}

export type TemplateCategory = 
  | 'date'
  | 'anniversary'
  | 'birthday'
  | 'proposal'
  | 'valentine'
  | 'reconciliation'
  | 'surprise'
  | 'travel'
  | 'wedding'
  | 'universal';

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  date: 'Романтическое свидание',
  anniversary: 'Годовщина отношений',
  birthday: 'День рождения',
  proposal: 'Предложение руки и сердца',
  valentine: 'День Святого Валентина',
  reconciliation: 'Примирение',
  surprise: 'Сюрприз без повода',
  travel: 'Совместное путешествие',
  wedding: 'Свадьба',
  universal: 'Универсальное приглашение',
};
