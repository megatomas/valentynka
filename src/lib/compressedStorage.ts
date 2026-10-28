import type { Project } from '../types';

// Простое кодирование проекта в URL-safe формат (без сжатия)
export function encodeProjectData(project: Project): string {
  try {
    // Убираем лишние данные для компактности
    const compactProject = {
      id: project.id,
      title: project.title,
      scenes: project.scenes,
      settings: project.settings,
    };
    
    const json = JSON.stringify(compactProject);
    
    // Кодируем в base64
    const base64 = btoa(unescape(encodeURIComponent(json)));
    
    // Заменяем символы для URL-safe
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    console.error('Error encoding project:', error);
    throw error;
  }
}

// Декодирование проекта из URL
export function decodeProjectData(encoded: string): Project | null {
  try {
    console.log('Decoding project, encoded length:', encoded.length);
    
    // Восстанавливаем base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    
    // Добавляем padding
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Декодируем
    const json = decodeURIComponent(escape(atob(base64)));
    console.log('Decoded JSON length:', json.length);
    
    const data = JSON.parse(json);
    console.log('Parsed data:', { id: data.id, title: data.title, scenesCount: data.scenes?.length });
    
    // Восстанавливаем полную структуру Project
    const project: Project = {
      ...data,
      description: data.description || '',
      templateId: data.templateId,
      status: 'published',
      publishedSlug: encoded,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      responses: [],
      viewCount: 0,
    };
    
    console.log('Project restored successfully');
    return project;
  } catch (error) {
    console.error('Error decoding project:', error);
    console.error('Encoded string (first 100 chars):', encoded.substring(0, 100));
    return null;
  }
}
