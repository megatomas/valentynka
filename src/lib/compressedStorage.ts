import { deflate, inflate } from 'pako';
import type { Project } from '../types';

// Сжатие и кодирование проекта в URL-safe формат
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
    
    // Проверяем размер данных (максимум ~500KB для URL)
    if (json.length > 500000) {
      throw new Error('Проект слишком большой. Уменьшите количество сцен или текста.');
    }
    
    // Сжимаем данные с помощью pako (deflate)
    const compressed = deflate(json, { level: 9 });
    
    // Конвертируем Uint8Array в base64 по частям
    // (String.fromCharCode не работает с большими массивами)
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < compressed.length; i += chunkSize) {
      const chunk = compressed.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const base64 = btoa(binary);
    
    // Заменяем символы для URL-safe
    const encoded = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    
    // Проверяем, что результат не пустой
    if (!encoded || encoded.length === 0) {
      throw new Error('Не удалось закодировать данные.');
    }
    
    return encoded;
  } catch (error) {
    console.error('Error encoding project:', error);
    throw error;
  }
}

// Декодирование и распаковка проекта из URL
export function decodeProjectData(encoded: string): Project | null {
  try {
    // Восстанавливаем base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    
    // Добавляем padding
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Конвертируем из base64 в Uint8Array
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Распаковываем данные
    const decompressed = inflate(bytes);
    
    // Конвертируем Uint8Array в строку
    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decompressed);
    
    const data = JSON.parse(jsonString);
    
    // Восстанавливаем полную структуру Project
    return {
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
  } catch (error) {
    console.error('Error decoding project:', error);
    return null;
  }
}
