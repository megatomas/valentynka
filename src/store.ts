import { v4 as uuidv4 } from 'uuid';
import type { Project, Scene, Template, TemplateCategory } from './types';
import { encodeProjectData, decodeProjectData } from './lib/compressedStorage';
import { saveProjectToSupabase, loadProjectFromSupabase } from './lib/supabaseStorage';
import { isSupabaseConfigured } from './lib/supabase';

const PROJECTS_KEY = 'loveletter_projects';
const CURRENT_USER_KEY = 'loveletter_user';

// ============ TEMPLATES ============

export const TEMPLATES: Template[] = [
  {
    id: 'tpl-romantic-dinner',
    name: 'Романтический ужин',
    description: 'Приглашение на особенный ужин при свечах с музыкой и фотографиями',
    category: 'date' as TemplateCategory,
    coverEmoji: '🕯️',
    colorScheme: { primary: '#e11d48', secondary: '#9b6aff', accent: '#f43f5e', bg: '#1a1b1f' },
    isFree: true,
    tier: 'free',
    scenes: [
      {
        id: 's1', title: 'Обложка', type: 'cover',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #1a1b1f 0%, #2d1b3d 50%, #1a1b1f 100%)' },
        elements: [
          { id: 'e1', type: 'heading', props: { text: 'У меня есть идея...', style: 'elegant' }, animation: { type: 'fadeIn', duration: 1, delay: 0.3 } },
          { id: 'e2', type: 'typewriter', props: { text: 'Хочу пригласить тебя на особенный вечер', speed: 50 }, animation: { type: 'typewriter', duration: 2, delay: 1 } },
          { id: 'e3', type: 'button', props: { text: 'Открыть приглашение ✨', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 3 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's2'
      },
      {
        id: 's2', title: 'Письмо', type: 'letter',
        background: { type: 'gradient', value: 'linear-gradient(180deg, #2d1b3d 0%, #1a1b1f 100%)' },
        elements: [
          { id: 'e4', type: 'text', props: { text: 'Дорогая(ой),\n\nЯ хочу пригласить тебя на романтический ужин. Только мы вдвоём, свечи, тихая музыка и всё, что я приготовил(а) специально для тебя.\n\nЭто будет вечер, который мы запомним надолго...', style: 'letter' }, animation: { type: 'fadeIn', duration: 1.5, delay: 0 } },
          { id: 'e5', type: 'button', props: { text: 'Продолжить →', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 2 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's3'
      },
      {
        id: 's3', title: 'Детали', type: 'choice',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #1a1b1f 0%, #3d1b2d 100%)' },
        elements: [
          { id: 'e6', type: 'heading', props: { text: 'Выбери свой вариант ✨', style: 'elegant' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
          { id: 'e7', type: 'choice', props: { question: 'Что тебе больше нравится?', options: ['Ужин дома 🏠', 'Ресторан 🍷', 'Пикник на природе 🌿'] }, animation: { type: 'fadeIn', duration: 1, delay: 0.5 } },
          { id: 'e8', type: 'button', props: { text: 'Далее →', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 1.5 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's4'
      },
      {
        id: 's4', title: 'Финал', type: 'finale',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #3d1b2d 0%, #1a1b1f 50%, #1b2d3d 100%)' },
        elements: [
          { id: 'e9', type: 'heading', props: { text: 'Жду тебя 💕', style: 'elegant' }, animation: { type: 'scaleIn', duration: 1, delay: 0 } },
          { id: 'e10', type: 'text', props: { text: 'Суббота, 19:00\nНаше любимое место', style: 'center' }, animation: { type: 'fadeIn', duration: 1, delay: 0.5 } },
          { id: 'e11', type: 'final-confirm', props: { options: ['Да, с удовольствием! 💖', 'Давай выберем другое время'] }, animation: { type: 'fadeIn', duration: 1, delay: 1 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut'
      },
    ]
  },
  {
    id: 'tpl-anniversary',
    name: 'Годовщина вместе',
    description: 'Нежная история о вашей любви с фотографиями и воспоминаниями',
    category: 'anniversary' as TemplateCategory,
    coverEmoji: '💍',
    colorScheme: { primary: '#e11d48', secondary: '#f43f5e', accent: '#fda4af', bg: '#fdf2f4' },
    isFree: true,
    tier: 'free',
    scenes: [
      {
        id: 's1', title: 'Начало', type: 'cover',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #fdf2f4 0%, #ffe4e6 50%, #fecdd3 100%)' },
        elements: [
          { id: 'e1', type: 'heading', props: { text: 'Наша история любви', style: 'elegant' }, animation: { type: 'fadeIn', duration: 1.5, delay: 0 } },
          { id: 'e2', type: 'typewriter', props: { text: 'Каждый день с тобой — это подарок...', speed: 60 }, animation: { type: 'typewriter', duration: 2.5, delay: 1 } },
          { id: 'e3', type: 'button', props: { text: 'Вспомнить вместе 💝', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 3.5 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's2'
      },
      {
        id: 's2', title: 'Воспоминания', type: 'gallery',
        background: { type: 'gradient', value: 'linear-gradient(180deg, #ffe4e6 0%, #fdf2f4 100%)' },
        elements: [
          { id: 'e4', type: 'heading', props: { text: 'Наши моменты 📸', style: 'elegant' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
          { id: 'e5', type: 'image', props: { src: '', caption: 'Наше первое фото вместе', placeholder: true }, animation: { type: 'scaleIn', duration: 1, delay: 0.5 } },
          { id: 'e6', type: 'button', props: { text: 'Дальше →', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 1.5 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's3'
      },
      {
        id: 's3', title: 'Послание', type: 'envelope',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #fdf2f4 0%, #f9eed9 100%)' },
        elements: [
          { id: 'e7', type: 'envelope', props: { message: 'Спасибо за каждый день, проведённый вместе. Ты — лучшее, что случилось в моей жизни. С годовщиной нас! 💕' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
          { id: 'e8', type: 'button', props: { text: 'Продолжить →', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 1 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's4'
      },
      {
        id: 's4', title: 'Приглашение', type: 'finale',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #f9eed9 0%, #ffe4e6 50%, #fdf2f4 100%)' },
        elements: [
          { id: 'e9', type: 'heading', props: { text: 'С годовщиной, любимая(ый)! 🥂', style: 'elegant' }, animation: { type: 'scaleIn', duration: 1, delay: 0 } },
          { id: 'e10', type: 'text', props: { text: 'Приглашаю тебя отметить наш день вместе.\nВечер, который будет только нашим.', style: 'center' }, animation: { type: 'fadeIn', duration: 1, delay: 0.5 } },
          { id: 'e11', type: 'final-confirm', props: { options: ['Конечно, да! 💖', 'С нетерпением жду!'] }, animation: { type: 'fadeIn', duration: 1, delay: 1 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut'
      },
    ]
  },
  {
    id: 'tpl-proposal',
    name: 'Предложение',
    description: 'Самый важный вопрос в красивой обёртке с анимациями и музыкой',
    category: 'proposal' as TemplateCategory,
    coverEmoji: '💎',
    colorScheme: { primary: '#9b6aff', secondary: '#e11d48', accent: '#d4c0ff', bg: '#0d0e10' },
    isFree: false,
    tier: 'premium',
    scenes: [
      {
        id: 's1', title: 'Начало', type: 'cover',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #0d0e10 0%, #1b1033 50%, #0d0e10 100%)' },
        elements: [
          { id: 'e1', type: 'heading', props: { text: 'У меня есть вопрос...', style: 'elegant' }, animation: { type: 'fadeIn', duration: 2, delay: 0 } },
          { id: 'e2', type: 'typewriter', props: { text: 'Один вопрос, который изменит всё', speed: 70 }, animation: { type: 'typewriter', duration: 3, delay: 1.5 } },
          { id: 'e3', type: 'button', props: { text: 'Узнать ✨', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 4 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's2'
      },
      {
        id: 's2', title: 'Путь', type: 'letter',
        background: { type: 'gradient', value: 'linear-gradient(180deg, #1b1033 0%, #0d0e10 100%)' },
        elements: [
          { id: 'e4', type: 'text', props: { text: 'С того дня, когда я впервые увидел(а) тебя, моя жизнь наполнилась смыслом.\n\nКаждый момент рядом с тобой — это счастье. Ты делаешь меня лучше. Ты — мой дом, моя радость, моя любовь.\n\nИ сегодня я хочу спросить тебя...', style: 'letter' }, animation: { type: 'fadeIn', duration: 2, delay: 0 } },
          { id: 'e5', type: 'button', props: { text: '💎', action: 'next' }, animation: { type: 'scaleIn', duration: 1, delay: 2.5 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's3'
      },
      {
        id: 's3', title: 'Вопрос', type: 'question',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #0d0e10 0%, #2d1b3d 50%, #0d0e10 100%)' },
        elements: [
          { id: 'e6', type: 'heading', props: { text: 'Ты выйдешь за меня? 💍', style: 'elegant' }, animation: { type: 'scaleIn', duration: 1.5, delay: 0 } },
          { id: 'e7', type: 'question', props: { question: '', options: ['Да! 💖', 'Да, тысячу раз да! 💎✨'] }, animation: { type: 'fadeIn', duration: 1, delay: 1 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's4'
      },
      {
        id: 's4', title: 'Финал', type: 'finale',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #2d1b3d 0%, #3d1b2d 50%, #1b1033 100%)' },
        elements: [
          { id: 'e8', type: 'heading', props: { text: 'Ты сделал(а) меня самым счастливым человеком! 🎉', style: 'elegant' }, animation: { type: 'scaleIn', duration: 1.5, delay: 0 } },
          { id: 'e9', type: 'text', props: { text: 'Вместе навсегда 💕', style: 'center' }, animation: { type: 'fadeIn', duration: 1, delay: 1 } },
          { id: 'e10', type: 'hearts', props: { count: 20 }, animation: { type: 'fadeIn', duration: 0.5, delay: 0.5 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut'
      },
    ]
  },
  {
    id: 'tpl-valentine',
    name: 'Валентинка',
    description: 'Нежное признание в любви с сердечками и романтичной атмосферой',
    category: 'valentine' as TemplateCategory,
    coverEmoji: '❤️',
    colorScheme: { primary: '#e11d48', secondary: '#f43f5e', accent: '#fecdd3', bg: '#fff1f2' },
    isFree: true,
    tier: 'free',
    scenes: [
      {
        id: 's1', title: 'Начало', type: 'cover',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)' },
        elements: [
          { id: 'e1', type: 'heading', props: { text: 'С Днём Святого Валентина! ❤️', style: 'elegant' }, animation: { type: 'fadeIn', duration: 1.5, delay: 0 } },
          { id: 'e2', type: 'hearts', props: { count: 15 }, animation: { type: 'fadeIn', duration: 0.5, delay: 0.5 } },
          { id: 'e3', type: 'button', props: { text: 'Открыть валентинку 💌', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 1.5 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's2'
      },
      {
        id: 's2', title: 'Конверт', type: 'envelope',
        background: { type: 'gradient', value: 'linear-gradient(180deg, #ffe4e6 0%, #fff1f2 100%)' },
        elements: [
          { id: 'e4', type: 'envelope', props: { message: 'Ты — моё самое большое счастье. Каждый день рядом с тобой — это праздник. Люблю тебя больше, чем слова могут передать! 💕' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
          { id: 'e5', type: 'button', props: { text: 'Ещё сюрприз →', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 1 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's3'
      },
      {
        id: 's3', title: 'Финал', type: 'finale',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #fecdd3 0%, #ffe4e6 50%, #fff1f2 100%)' },
        elements: [
          { id: 'e6', type: 'heading', props: { text: 'Ты — моя Valentine 💝', style: 'elegant' }, animation: { type: 'scaleIn', duration: 1.5, delay: 0 } },
          { id: 'e7', type: 'text', props: { text: 'Навсегда твоя(ой)', style: 'center' }, animation: { type: 'fadeIn', duration: 1, delay: 1 } },
          { id: 'e8', type: 'hearts', props: { count: 25 }, animation: { type: 'fadeIn', duration: 0.5, delay: 0.5 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut'
      },
    ]
  },
  {
    id: 'tpl-birthday',
    name: 'День рождения',
    description: 'Праздничное приглашение на день рождения с сюрпризами и поздравлениями',
    category: 'birthday' as TemplateCategory,
    coverEmoji: '🎂',
    colorScheme: { primary: '#9b6aff', secondary: '#e11d48', accent: '#e9dfff', bg: '#f8f5ff' },
    isFree: true,
    tier: 'free',
    scenes: [
      {
        id: 's1', title: 'Начало', type: 'cover',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #f8f5ff 0%, #e9dfff 50%, #d4c0ff 100%)' },
        elements: [
          { id: 'e1', type: 'heading', props: { text: 'С Днём Рождения! 🎉', style: 'elegant' }, animation: { type: 'scaleIn', duration: 1.5, delay: 0 } },
          { id: 'e2', type: 'typewriter', props: { text: 'У меня для тебя особенный сюрприз...', speed: 50 }, animation: { type: 'typewriter', duration: 2, delay: 1 } },
          { id: 'e3', type: 'button', props: { text: 'Открыть 🎁', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 3 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's2'
      },
      {
        id: 's2', title: 'Поздравление', type: 'letter',
        background: { type: 'gradient', value: 'linear-gradient(180deg, #e9dfff 0%, #f8f5ff 100%)' },
        elements: [
          { id: 'e4', type: 'text', props: { text: 'В этот особенный день я хочу сказать тебе, как сильно ты важен(а) для меня.\n\nТы делаешь этот мир ярче просто тем, что ты есть. Желаю тебе всего самого прекрасного! 🌟', style: 'letter' }, animation: { type: 'fadeIn', duration: 1.5, delay: 0 } },
          { id: 'e5', type: 'button', props: { text: 'Что дальше? →', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 2 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's3'
      },
      {
        id: 's3', title: 'Приглашение', type: 'finale',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #d4c0ff 0%, #e9dfff 50%, #f8f5ff 100%)' },
        elements: [
          { id: 'e6', type: 'heading', props: { text: 'Праздник в твою честь! 🥳', style: 'elegant' }, animation: { type: 'scaleIn', duration: 1.5, delay: 0 } },
          { id: 'e7', type: 'text', props: { text: 'Приглашаю тебя отметить твой день!\nБудет весело, вкусно и с любовью 💜', style: 'center' }, animation: { type: 'fadeIn', duration: 1, delay: 0.5 } },
          { id: 'e8', type: 'final-confirm', props: { options: ['Приду! 🎉', 'Не могу дождаться! 💜'] }, animation: { type: 'fadeIn', duration: 1, delay: 1 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut'
      },
    ]
  },
  {
    id: 'tpl-surprise',
    name: 'Сюрприз',
    description: 'Загадочное приглашение-сюрприз, которое раскрывается постепенно',
    category: 'surprise' as TemplateCategory,
    coverEmoji: '🎁',
    colorScheme: { primary: '#e11d48', secondary: '#9b6aff', accent: '#fda4af', bg: '#1a1b1f' },
    isFree: false,
    tier: 'premium',
    scenes: [
      {
        id: 's1', title: 'Загадка', type: 'cover',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #1a1b1f 0%, #2d1b3d 100%)' },
        elements: [
          { id: 'e1', type: 'heading', props: { text: 'У меня для тебя сюрприз...', style: 'elegant' }, animation: { type: 'fadeIn', duration: 2, delay: 0 } },
          { id: 'e2', type: 'typewriter', props: { text: 'Но сначала нужно разгадать загадку', speed: 60 }, animation: { type: 'typewriter', duration: 2.5, delay: 1.5 } },
          { id: 'e3', type: 'button', props: { text: 'Я готов(а)! 🎁', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 3.5 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's2'
      },
      {
        id: 's2', title: 'Секрет', type: 'secret',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #2d1b3d 0%, #3d1b2d 100%)' },
        elements: [
          { id: 'e4', type: 'secret-card', props: { hint: 'Нажми, чтобы раскрыть секрет', reveal: 'Ты — самый удивительный человек, которого я знаю! 🌟' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
          { id: 'e5', type: 'button', props: { text: 'Ещё →', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 1 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut', nextSceneId: 's3'
      },
      {
        id: 's3', title: 'Финал', type: 'finale',
        background: { type: 'gradient', value: 'linear-gradient(135deg, #3d1b2d 0%, #1a1b1f 100%)' },
        elements: [
          { id: 'e6', type: 'heading', props: { text: 'А сюрприз вот какой! 🎉', style: 'elegant' }, animation: { type: 'scaleIn', duration: 1.5, delay: 0 } },
          { id: 'e7', type: 'text', props: { text: 'Приглашаю тебя на особенное событие!\nПодробности скоро...', style: 'center' }, animation: { type: 'fadeIn', duration: 1, delay: 0.5 } },
          { id: 'e8', type: 'final-confirm', props: { options: ['Интересно! Расскажи! 🤩'] }, animation: { type: 'fadeIn', duration: 1, delay: 1 } },
        ],
        entryAnimation: 'fadeIn', exitAnimation: 'fadeOut'
      },
    ]
  },
];

// ============ PROJECT STORE ============

export function getProjects(): Project[] {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getProject(id: string): Project | undefined {
  return getProjects().find(p => p.id === id);
}

export function createProjectFromTemplate(templateId: string): Project {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) throw new Error('Template not found');
  
  const project: Project = {
    id: uuidv4(),
    title: template.name,
    description: template.description,
    templateId: template.id,
    scenes: template.scenes.map(s => ({ ...s, id: uuidv4(), elements: s.elements.map(e => ({ ...e, id: uuidv4() })) })),
    settings: {
      bgColor: template.colorScheme.bg,
      fontFamily: 'Inter',
      textColor: '#ffffff',
      accentColor: template.colorScheme.primary,
      musicVolume: 0.7,
      autoplayMusic: false,
    },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    responses: [],
    viewCount: 0,
  };
  
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
  return project;
}

export function updateProject(project: Project) {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === project.id);
  if (idx !== -1) {
    projects[idx] = { ...project, updatedAt: new Date().toISOString() };
    saveProjects(projects);
  }
}

export function deleteProject(id: string) {
  const projects = getProjects().filter(p => p.id !== id);
  saveProjects(projects);
}

// Публикация проекта - использует Supabase если настроен, иначе кодирует в URL
export async function publishProject(id: string): Promise<string> {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  
  if (idx === -1) {
    console.error('Project not found:', id);
    return '';
  }
  
  const projectData = projects[idx];
  
  try {
    // Проверяем, что проект содержит данные
    if (!projectData.scenes || projectData.scenes.length === 0) {
      throw new Error('Проект не содержит сцен. Добавьте хотя бы одну сцену.');
    }
    
    let slug: string;
    
    // Если Supabase настроен, используем его для коротких ссылок
    if (isSupabaseConfigured()) {
      console.log('Using Supabase for short links');
      const supabaseSlug = await saveProjectToSupabase(projectData);
      
      if (supabaseSlug) {
        slug = supabaseSlug;
      } else {
        console.warn('Supabase save failed, falling back to URL encoding');
        slug = encodeProjectData(projectData);
      }
    } else {
      // Fallback: кодируем данные в URL
      console.log('Supabase not configured, using URL encoding');
      slug = encodeProjectData(projectData);
    }
    
    if (!slug) {
      throw new Error('Не удалось создать ссылку для проекта.');
    }
    
    projects[idx].status = 'published';
    projects[idx].publishedSlug = slug;
    projects[idx].updatedAt = new Date().toISOString();
    saveProjects(projects);
    
    return slug;
  } catch (error) {
    console.error('Error publishing project:', error);
    throw error;
  }
}

// Получение опубликованного проекта - использует Supabase если настроен
export async function getPublishedProject(slug: string): Promise<Project | null> {
  // Если Supabase настроен, пробуем загрузить из него
  if (isSupabaseConfigured()) {
    console.log('Trying to load from Supabase');
    const supabaseProject = await loadProjectFromSupabase(slug);
    
    if (supabaseProject) {
      return supabaseProject;
    }
  }
  
  // Fallback: декодируем из URL
  console.log('Falling back to URL decoding');
  return decodeProjectData(slug);
}

export function unpublishProject(id: string) {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx !== -1) {
    projects[idx].status = 'draft';
    projects[idx].publishedSlug = undefined;
    projects[idx].updatedAt = new Date().toISOString();
    saveProjects(projects);
  }
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find(p => p.publishedSlug === slug && p.status === 'published');
}

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function duplicateProject(id: string): Project | undefined {
  const original = getProject(id);
  if (!original) return undefined;
  
  const copy: Project = {
    ...JSON.parse(JSON.stringify(original)),
    id: uuidv4(),
    title: `${original.title} (копия)`,
    status: 'draft',
    publishedSlug: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0,
    responses: [],
  };
  
  // Regenerate all IDs
  copy.scenes = copy.scenes.map(s => ({
    ...s,
    id: uuidv4(),
    elements: s.elements.map(e => ({ ...e, id: uuidv4() })),
  }));
  
  const projects = getProjects();
  projects.push(copy);
  saveProjects(projects);
  return copy;
}

export function createEmptyProject(): Project {
  const project: Project = {
    id: uuidv4(),
    title: 'Новое приглашение',
    description: '',
    scenes: [{
      id: uuidv4(),
      title: 'Обложка',
      type: 'cover',
      background: { type: 'gradient', value: 'linear-gradient(135deg, #1a1b1f 0%, #2d1b3d 100%)' },
      elements: [
        { id: uuidv4(), type: 'heading', props: { text: 'Заголовок', style: 'elegant' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
        { id: uuidv4(), type: 'button', props: { text: 'Начать', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 } },
      ],
      entryAnimation: 'fadeIn',
      exitAnimation: 'fadeOut',
    }],
    settings: {
      bgColor: '#1a1b1f',
      fontFamily: 'Inter',
      textColor: '#ffffff',
      accentColor: '#e11d48',
      musicVolume: 0.7,
      autoplayMusic: false,
    },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    responses: [],
    viewCount: 0,
  };
  
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
  return project;
}
