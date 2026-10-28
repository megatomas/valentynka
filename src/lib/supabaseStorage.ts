import { supabase, isSupabaseConfigured } from './supabase';
import type { Project } from '../types';

export interface StoredProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  data: {
    scenes: any[];
    settings: any;
  };
  view_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Сохраняет проект в Supabase и возвращает короткий slug
 */
export async function saveProjectToSupabase(project: Project): Promise<string | null> {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured');
    return null;
  }

  try {
    // Генерируем короткий slug (8 символов)
    const slug = generateShortSlug();

    // Подготавливаем данные для сохранения
    const projectData = {
      scenes: project.scenes,
      settings: project.settings,
    };

    // Сохраняем в Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert({
        slug,
        title: project.title,
        description: project.description || '',
        data: projectData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving project to Supabase:', error);
      return null;
    }

    return data.slug;
  } catch (error) {
    console.error('Error in saveProjectToSupabase:', error);
    return null;
  }
}

/**
 * Загружает проект из Supabase по slug
 */
export async function loadProjectFromSupabase(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('Supabase not configured');
    return null;
  }

  try {
    // Загружаем проект из Supabase
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error('Error loading project from Supabase:', error);
      return null;
    }

    // Увеличиваем счётчик просмотров
    await supabase
      .from('projects')
      .update({ view_count: data.view_count + 1 })
      .eq('slug', slug);

    // Преобразуем в формат Project
    const project: Project = {
      id: data.id,
      title: data.title,
      description: data.description,
      scenes: data.data.scenes,
      settings: data.data.settings,
      status: 'published',
      publishedSlug: data.slug,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      responses: [],
      viewCount: data.view_count + 1,
    };

    return project;
  } catch (error) {
    console.error('Error in loadProjectFromSupabase:', error);
    return null;
  }
}

/**
 * Генерирует короткий slug (8 символов)
 */
function generateShortSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
