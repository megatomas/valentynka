import { useState } from 'react';
import { encodeProjectData, decodeProjectData } from '../lib/compressedStorage';
import type { Project } from '../types';

export function TestPage() {
  const [testResult, setTestResult] = useState<string>('');
  const [encodedData, setEncodedData] = useState<string>('');
  const [decodedData, setDecodedData] = useState<string>('');

  const testEncoding = () => {
    try {
      // Создаём тестовый проект
      const testProject: Project = {
        id: 'test-123',
        title: 'Тестовое приглашение',
        description: 'Описание',
        scenes: [
          {
            id: 'scene-1',
            title: 'Обложка',
            type: 'cover',
            background: { type: 'gradient', value: 'linear-gradient(135deg, #1a1b1f 0%, #2d1b3d 100%)' },
            elements: [
              {
                id: 'elem-1',
                type: 'heading',
                props: { text: 'Привет, мир!', style: 'elegant' },
                animation: { type: 'fadeIn', duration: 1, delay: 0 },
              },
            ],
            entryAnimation: 'fadeIn',
            exitAnimation: 'fadeOut',
          },
        ],
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

      // Кодируем
      const encoded = encodeProjectData(testProject);
      setEncodedData(encoded);

      // Декодируем
      const decoded = decodeProjectData(encoded);
      setDecodedData(JSON.stringify(decoded, null, 2));

      // Проверяем
      if (decoded && decoded.title === testProject.title) {
        setTestResult('✅ Тест пройден! Кодирование и декодирование работают корректно.');
      } else {
        setTestResult('❌ Тест не пройден! Данные не совпадают.');
      }
    } catch (error) {
      setTestResult(`❌ Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Тест кодирования/декодирования</h1>
        
        <button
          onClick={testEncoding}
          className="px-6 py-3 bg-rose-600 rounded-lg font-medium hover:bg-rose-700 transition-colors mb-6"
        >
          Запустить тест
        </button>

        {testResult && (
          <div className="mb-6 p-4 bg-white/5 rounded-lg">
            <p className="text-lg">{testResult}</p>
          </div>
        )}

        {encodedData && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Закодированные данные:</h2>
            <div className="p-4 bg-white/5 rounded-lg break-all text-sm font-mono">
              {encodedData}
            </div>
            <p className="text-sm text-white/50 mt-2">
              Длина: {encodedData.length} символов
            </p>
          </div>
        )}

        {decodedData && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Декодированные данные:</h2>
            <pre className="p-4 bg-white/5 rounded-lg overflow-auto text-sm font-mono max-h-96">
              {decodedData}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="font-semibold mb-2">Инструкция по тестированию:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-white/70">
            <li>Нажмите кнопку "Запустить тест"</li>
            <li>Проверьте, что тест пройден (зелёная галочка)</li>
            <li>Скопируйте закодированные данные</li>
            <li>Откройте новую вкладку и перейдите на главную страницу</li>
            <li>Создайте приглашение и опубликуйте его</li>
            <li>Скопируйте ссылку и откройте в другом браузере</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
