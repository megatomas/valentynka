import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ArrowLeft, Save, Eye, Plus, Trash2, Copy, GripVertical,
  Type, Image, Music, Sparkles, Settings, Check, AlertCircle,
  ChevronDown, Layers, Palette, Play, Monitor, Smartphone, Loader2
} from 'lucide-react';
import { getProject, updateProject, publishProject, createEmptyProject } from '../store';
import type { Project, Scene, SceneElement, SceneType, ElementType } from '../types';

const SCENE_TYPES: { value: SceneType; label: string; emoji: string }[] = [
  { value: 'cover', label: 'Обложка', emoji: '🎬' },
  { value: 'letter', label: 'Письмо', emoji: '✉️' },
  { value: 'gallery', label: 'Галерея', emoji: '📸' },
  { value: 'envelope', label: 'Конверт', emoji: '💌' },
  { value: 'question', label: 'Вопрос', emoji: '❓' },
  { value: 'choice', label: 'Выбор', emoji: '🎯' },
  { value: 'timer', label: 'Таймер', emoji: '⏰' },
  { value: 'audio', label: 'Аудио', emoji: '🎵' },
  { value: 'secret', label: 'Секрет', emoji: '🔮' },
  { value: 'finale', label: 'Финал', emoji: '🎉' },
  { value: 'freeform', label: 'Свободная', emoji: '🎨' },
];

const ELEMENT_TYPES: { value: ElementType; label: string; icon: any }[] = [
  { value: 'heading', label: 'Заголовок', icon: Type },
  { value: 'text', label: 'Текст', icon: Type },
  { value: 'typewriter', label: 'Печатная машинка', icon: Type },
  { value: 'image', label: 'Изображение', icon: Image },
  { value: 'button', label: 'Кнопка', icon: Play },
  { value: 'envelope', label: 'Конверт', icon: Heart },
  { value: 'secret-card', label: 'Секретная карточка', icon: Sparkles },
  { value: 'question', label: 'Вопрос', icon: Sparkles },
  { value: 'choice', label: 'Выбор', icon: Sparkles },
  { value: 'hearts', label: 'Сердечки', icon: Heart },
  { value: 'final-confirm', label: 'Подтверждение', icon: Check },
  { value: 'divider', label: 'Разделитель', icon: Layers },
];

const GRADIENTS = [
  'linear-gradient(135deg, #1a1b1f 0%, #2d1b3d 100%)',
  'linear-gradient(135deg, #2d1b3d 0%, #3d1b2d 100%)',
  'linear-gradient(135deg, #fdf2f4 0%, #ffe4e6 100%)',
  'linear-gradient(135deg, #f8f5ff 0%, #e9dfff 100%)',
  'linear-gradient(135deg, #0d0e10 0%, #1b1033 100%)',
  'linear-gradient(180deg, #1a1b1f 0%, #2d1b3d 100%)',
  'linear-gradient(135deg, #3d1b2d 0%, #1a1b1f 100%)',
  'linear-gradient(135deg, #f9eed9 0%, #ffe4e6 100%)',
];

export function EditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedSceneIdx, setSelectedSceneIdx] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState<'phone' | 'desktop'>('phone');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showAddScene, setShowAddScene] = useState(false);
  const [showAddElement, setShowAddElement] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);

  // Load project
  useEffect(() => {
    if (projectId === 'new') {
      const p = createEmptyProject();
      setProject(p);
      navigate(`/editor/${p.id}`, { replace: true });
    } else if (projectId) {
      const p = getProject(projectId);
      if (p) {
        setProject(p);
      } else {
        navigate('/templates');
      }
    }
  }, [projectId]);

  // Auto-save
  useEffect(() => {
    if (!project) return;
    setSaveStatus('unsaved');
    const timer = setTimeout(() => {
      updateProject(project);
      setSaveStatus('saved');
    }, 1000);
    return () => clearTimeout(timer);
  }, [project]);

  const updateProjectState = useCallback((updater: (p: Project) => Project) => {
    setProject(prev => prev ? updater(prev) : prev);
  }, []);

  const currentScene = project?.scenes[selectedSceneIdx];
  const selectedElement = currentScene?.elements.find(e => e.id === selectedElementId);

  const addScene = (type: SceneType) => {
    if (!project) return;
    const newScene: Scene = {
      id: crypto.randomUUID(),
      title: SCENE_TYPES.find(s => s.value === type)?.label || 'Новая сцена',
      type,
      background: { type: 'gradient', value: GRADIENTS[0] },
      elements: getDefaultElements(type),
      entryAnimation: 'fadeIn',
      exitAnimation: 'fadeOut',
    };
    const scenes = [...project.scenes];
    scenes.splice(selectedSceneIdx + 1, 0, newScene);
    updateProjectState(p => ({ ...p, scenes }));
    setSelectedSceneIdx(selectedSceneIdx + 1);
    setShowAddScene(false);
  };

  const deleteScene = (idx: number) => {
    if (!project || project.scenes.length <= 1) return;
    const scenes = project.scenes.filter((_, i) => i !== idx);
    updateProjectState(p => ({ ...p, scenes }));
    setSelectedSceneIdx(Math.min(selectedSceneIdx, scenes.length - 1));
  };

  const duplicateScene = (idx: number) => {
    if (!project) return;
    const copy = JSON.parse(JSON.stringify(project.scenes[idx]));
    copy.id = crypto.randomUUID();
    copy.title = `${copy.title} (копия)`;
    copy.elements = copy.elements.map((e: SceneElement) => ({ ...e, id: crypto.randomUUID() }));
    const scenes = [...project.scenes];
    scenes.splice(idx + 1, 0, copy);
    updateProjectState(p => ({ ...p, scenes }));
    setSelectedSceneIdx(idx + 1);
  };

  const addElement = (type: ElementType) => {
    if (!project) return;
    const newElement: SceneElement = {
      id: crypto.randomUUID(),
      type,
      props: getDefaultProps(type),
      animation: { type: 'fadeIn', duration: 1, delay: 0 },
    };
    const scenes = [...project.scenes];
    const scene = { ...scenes[selectedSceneIdx] };
    scene.elements = [...scene.elements, newElement];
    scenes[selectedSceneIdx] = scene;
    updateProjectState(p => ({ ...p, scenes }));
    setSelectedElementId(newElement.id);
    setShowAddElement(false);
  };

  const deleteElement = (elementId: string) => {
    if (!project) return;
    const scenes = [...project.scenes];
    const scene = { ...scenes[selectedSceneIdx] };
    scene.elements = scene.elements.filter(e => e.id !== elementId);
    scenes[selectedSceneIdx] = scene;
    updateProjectState(p => ({ ...p, scenes }));
    setSelectedElementId(null);
  };

  const updateElement = (elementId: string, updates: Partial<SceneElement>) => {
    if (!project) return;
    const scenes = [...project.scenes];
    const scene = { ...scenes[selectedSceneIdx] };
    scene.elements = scene.elements.map(e => e.id === elementId ? { ...e, ...updates } : e);
    scenes[selectedSceneIdx] = scene;
    updateProjectState(p => ({ ...p, scenes }));
  };

  const updateElementProp = (elementId: string, key: string, value: any) => {
    if (!project) return;
    const scenes = [...project.scenes];
    const scene = { ...scenes[selectedSceneIdx] };
    scene.elements = scene.elements.map(e =>
      e.id === elementId ? { ...e, props: { ...e.props, [key]: value } } : e
    );
    scenes[selectedSceneIdx] = scene;
    updateProjectState(p => ({ ...p, scenes }));
  };

  const updateSceneBackground = (value: string) => {
    if (!project) return;
    const scenes = [...project.scenes];
    scenes[selectedSceneIdx] = { ...scenes[selectedSceneIdx], background: { type: 'gradient', value } };
    updateProjectState(p => ({ ...p, scenes }));
  };

  const updateSceneTitle = (title: string) => {
    if (!project) return;
    const scenes = [...project.scenes];
    scenes[selectedSceneIdx] = { ...scenes[selectedSceneIdx], title };
    updateProjectState(p => ({ ...p, scenes }));
  };

  const handlePublish = () => {
    if (!project) return;
    
    try {
      // Кодируем данные проекта с сжатием
      const slug = publishProject(project.id);
      
      if (!slug) {
        alert('Не удалось создать ссылку. Проект не найден.');
        return;
      }
      
      setPublishedSlug(slug);
      setShowPublish(true);
    } catch (error) {
      console.error('Error publishing project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      alert(`Ошибка публикации: ${errorMessage}\n\nПопробуйте:\n1. Обновить страницу\n2. Проверить консоль браузера (F12)\n3. Убедиться, что проект содержит данные`);
    }
  };

  if (!project) return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">Загрузка...</div>;

  return (
    <div className="h-screen flex flex-col bg-dark-950 text-white overflow-hidden">
      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-dark-900/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <input
            type="text"
            value={project.title}
            onChange={e => updateProjectState(p => ({ ...p, title: e.target.value }))}
            className="bg-transparent font-medium text-sm focus:outline-none border-b border-transparent focus:border-rose-500/50 transition-colors max-w-[200px]"
          />
          <div className="flex items-center gap-1 text-xs text-white/40">
            {saveStatus === 'saved' && <><Check size={12} className="text-green-400" /> Сохранено</>}
            {saveStatus === 'saving' && <><span className="animate-pulse">●</span> Сохранение...</>}
            {saveStatus === 'unsaved' && <><span>●</span> Изменения</>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
          >
            <Eye size={14} /> Предпросмотр
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-gradient-to-r from-rose-600 to-rose-500 rounded-lg font-medium hover:shadow-lg hover:shadow-rose-500/20 transition-all"
          >
            <Sparkles size={14} /> Опубликовать
          </button>
        </div>
      </header>

      {/* Main editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - scenes */}
        <div className="w-64 border-r border-white/5 bg-dark-900/30 flex flex-col overflow-hidden shrink-0 hidden md:flex">
          <div className="p-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Сцены</span>
            <button
              onClick={() => setShowAddScene(true)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {project.scenes.map((scene, idx) => (
              <div
                key={scene.id}
                className={`group flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all ${
                  idx === selectedSceneIdx
                    ? 'bg-rose-500/10 border border-rose-500/20'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
                onClick={() => { setSelectedSceneIdx(idx); setSelectedElementId(null); }}
              >
                <GripVertical size={12} className="text-white/20" />
                <span className="text-sm flex-1 truncate">
                  {SCENE_TYPES.find(s => s.value === scene.type)?.emoji} {scene.title}
                </span>
                <div className="hidden group-hover:flex items-center gap-0.5">
                  <button onClick={(e) => { e.stopPropagation(); duplicateScene(idx); }} className="p-1 hover:bg-white/10 rounded">
                    <Copy size={11} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteScene(idx); }} className="p-1 hover:bg-red-500/20 rounded text-red-400">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center - preview */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-dark-950">
          <div className="w-full max-w-[375px]">
            <div className="phone-frame aspect-[9/19] relative" style={{ background: currentScene?.background.value }}>
              <div className="h-full w-full overflow-y-auto p-6 flex flex-col">
                {currentScene?.elements.map(el => (
                  <SceneElementPreview
                    key={el.id}
                    element={el}
                    isSelected={el.id === selectedElementId}
                    onClick={() => setSelectedElementId(el.id)}
                  />
                ))}
                {currentScene?.elements.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
                    Добавьте элементы
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - properties */}
        <div className="w-72 border-l border-white/5 bg-dark-900/30 flex flex-col overflow-hidden shrink-0 hidden lg:flex">
          <div className="p-3 border-b border-white/5">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Свойства</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Scene settings */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Название сцены</label>
                <input
                  type="text"
                  value={currentScene?.title || ''}
                  onChange={e => updateSceneTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Фон</label>
                <div className="grid grid-cols-4 gap-2">
                  {GRADIENTS.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => updateSceneBackground(g)}
                      className={`aspect-square rounded-lg border-2 transition-all ${
                        currentScene?.background.value === g ? 'border-rose-400' : 'border-transparent'
                      }`}
                      style={{ background: g }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <hr className="border-white/5" />

            {/* Element properties */}
            {selectedElement && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/50">Элемент: {selectedElement.type}</span>
                  <button onClick={() => deleteElement(selectedElement.id)} className="p-1 hover:bg-red-500/20 rounded text-red-400">
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Text props */}
                {['heading', 'text', 'typewriter'].includes(selectedElement.type) && (
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Текст</label>
                    <textarea
                      value={selectedElement.props.text || ''}
                      onChange={e => updateElementProp(selectedElement.id, 'text', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50 resize-none"
                    />
                  </div>
                )}

                {/* Button props */}
                {selectedElement.type === 'button' && (
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Текст кнопки</label>
                    <input
                      type="text"
                      value={selectedElement.props.text || ''}
                      onChange={e => updateElementProp(selectedElement.id, 'text', e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50"
                    />
                  </div>
                )}

                {/* Envelope props */}
                {selectedElement.type === 'envelope' && (
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Текст послания</label>
                    <textarea
                      value={selectedElement.props.message || ''}
                      onChange={e => updateElementProp(selectedElement.id, 'message', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50 resize-none"
                    />
                  </div>
                )}

                {/* Secret card props */}
                {selectedElement.type === 'secret-card' && (
                  <>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Подсказка</label>
                      <input
                        type="text"
                        value={selectedElement.props.hint || ''}
                        onChange={e => updateElementProp(selectedElement.id, 'hint', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Секретный текст</label>
                      <textarea
                        value={selectedElement.props.reveal || ''}
                        onChange={e => updateElementProp(selectedElement.id, 'reveal', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50 resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Question/Choice props */}
                {(selectedElement.type === 'question' || selectedElement.type === 'choice') && (
                  <>
                    {selectedElement.type === 'choice' && (
                      <div>
                        <label className="text-xs text-white/50 mb-1 block">Вопрос</label>
                        <input
                          type="text"
                          value={selectedElement.props.question || ''}
                          onChange={e => updateElementProp(selectedElement.id, 'question', e.target.value)}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Варианты (через запятую)</label>
                      <textarea
                        value={(selectedElement.props.options || []).join(', ')}
                        onChange={e => updateElementProp(selectedElement.id, 'options', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50 resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Final confirm */}
                {selectedElement.type === 'final-confirm' && (
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Варианты ответа (через запятую)</label>
                    <textarea
                      value={(selectedElement.props.options || []).join(', ')}
                      onChange={e => updateElementProp(selectedElement.id, 'options', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50 resize-none"
                    />
                  </div>
                )}

                {/* Image props */}
                {selectedElement.type === 'image' && (
                  <>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">URL изображения</label>
                      <input
                        type="text"
                        value={selectedElement.props.src || ''}
                        onChange={e => updateElementProp(selectedElement.id, 'src', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Подпись</label>
                      <input
                        type="text"
                        value={selectedElement.props.caption || ''}
                        onChange={e => updateElementProp(selectedElement.id, 'caption', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50"
                      />
                    </div>
                  </>
                )}

                {/* Animation */}
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Анимация</label>
                  <select
                    value={selectedElement.animation?.type || 'fadeIn'}
                    onChange={e => updateElement(selectedElement.id, { animation: { ...selectedElement.animation!, type: e.target.value } })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50"
                  >
                    <option value="fadeIn">Плавное появление</option>
                    <option value="scaleIn">Масштабирование</option>
                    <option value="slideLeft">Выезд слева</option>
                    <option value="slideRight">Выезд справа</option>
                    <option value="typewriter">Печатная машинка</option>
                  </select>
                </div>
              </div>
            )}

            {/* Add element button */}
            <button
              onClick={() => setShowAddElement(true)}
              className="w-full py-2.5 border border-dashed border-white/15 rounded-lg text-sm text-white/50 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus size={14} /> Добавить элемент
            </button>
          </div>
        </div>
      </div>

      {/* Mobile scene navigation */}
      <div className="md:hidden border-t border-white/5 bg-dark-900/50 p-2 flex items-center gap-2 overflow-x-auto shrink-0">
        {project.scenes.map((scene, idx) => (
          <div key={scene.id} className="flex items-center gap-1 shrink-0">
            {idx > 0 && (
              <button
                onClick={() => {
                  const scenes = [...project.scenes];
                  [scenes[idx - 1], scenes[idx]] = [scenes[idx], scenes[idx - 1]];
                  updateProjectState(p => ({ ...p, scenes }));
                  setSelectedSceneIdx(idx - 1);
                }}
                className="p-1 text-white/30 hover:text-white/60"
              >
                ←
              </button>
            )}
            <button
              onClick={() => { setSelectedSceneIdx(idx); setSelectedElementId(null); }}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                idx === selectedSceneIdx
                  ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
                  : 'bg-white/5 text-white/50'
              }`}
            >
              {SCENE_TYPES.find(s => s.value === scene.type)?.emoji} {scene.title}
            </button>
            {idx < project.scenes.length - 1 && (
              <button
                onClick={() => {
                  const scenes = [...project.scenes];
                  [scenes[idx], scenes[idx + 1]] = [scenes[idx + 1], scenes[idx]];
                  updateProjectState(p => ({ ...p, scenes }));
                  setSelectedSceneIdx(idx + 1);
                }}
                className="p-1 text-white/30 hover:text-white/60"
              >
                →
              </button>
            )}
          </div>
        ))}
        <button
          onClick={() => setShowAddScene(true)}
          className="p-1.5 rounded-full bg-white/5 text-white/50 shrink-0"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Mobile element panel */}
      <div className="md:hidden border-t border-white/5 bg-dark-900/50 p-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {currentScene?.elements.map(el => (
            <button
              key={el.id}
              onClick={() => setSelectedElementId(el.id === selectedElementId ? null : el.id)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                el.id === selectedElementId
                  ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
                  : 'bg-white/5 text-white/50'
              }`}
            >
              {el.type === 'heading' ? '📝' : el.type === 'button' ? '🔘' : el.type === 'image' ? '🖼️' : '✨'} {el.props.text?.slice(0, 15) || el.type}
            </button>
          ))}
          <button
            onClick={() => setShowAddElement(true)}
            className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-white/50 flex items-center gap-1"
          >
            <Plus size={12} /> Элемент
          </button>
        </div>
        {selectedElement && (
          <div className="mt-3 space-y-2">
            {['heading', 'text', 'typewriter'].includes(selectedElement.type) && (
              <textarea
                value={selectedElement.props.text || ''}
                onChange={e => updateElementProp(selectedElement.id, 'text', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50 resize-none"
              />
            )}
            {selectedElement.type === 'button' && (
              <input
                type="text"
                value={selectedElement.props.text || ''}
                onChange={e => updateElementProp(selectedElement.id, 'text', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50"
              />
            )}
            {(selectedElement.type === 'question' || selectedElement.type === 'choice' || selectedElement.type === 'final-confirm') && (
              <textarea
                value={(selectedElement.props.options || []).join(', ')}
                onChange={e => updateElementProp(selectedElement.id, 'options', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                rows={2}
                placeholder="Варианты через запятую"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50 resize-none"
              />
            )}
            {selectedElement.type === 'envelope' && (
              <textarea
                value={selectedElement.props.message || ''}
                onChange={e => updateElementProp(selectedElement.id, 'message', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-rose-500/50 resize-none"
              />
            )}
            <button
              onClick={() => deleteElement(selectedElement.id)}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Удалить элемент
            </button>
          </div>
        )}
      </div>

      {/* Add Scene Modal */}
      <AnimatePresence>
        {showAddScene && (
          <Modal onClose={() => setShowAddScene(false)} title="Добавить сцену">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SCENE_TYPES.map(st => (
                <button
                  key={st.value}
                  onClick={() => addScene(st.value)}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-rose-500/30 hover:bg-white/10 transition-all text-center"
                >
                  <span className="text-2xl block mb-1">{st.emoji}</span>
                  <span className="text-xs">{st.label}</span>
                </button>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Add Element Modal */}
      <AnimatePresence>
        {showAddElement && (
          <Modal onClose={() => setShowAddElement(false)} title="Добавить элемент">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ELEMENT_TYPES.map(et => (
                <button
                  key={et.value}
                  onClick={() => addElement(et.value)}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-rose-500/30 hover:bg-white/10 transition-all text-center"
                >
                  <et.icon size={20} className="mx-auto mb-1 text-rose-400" />
                  <span className="text-xs">{et.label}</span>
                </button>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setShowPreview(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode('phone')}
                    className={`p-2 rounded-lg ${previewMode === 'phone' ? 'bg-white/10' : ''}`}
                  >
                    <Smartphone size={18} />
                  </button>
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded-lg ${previewMode === 'desktop' ? 'bg-white/10' : ''}`}
                  >
                    <Monitor size={18} />
                  </button>
                </div>
                <button onClick={() => setShowPreview(false)} className="text-white/50 hover:text-white">✕</button>
              </div>
              <div className={previewMode === 'phone' ? 'max-w-[375px]' : 'max-w-[800px]'}>
                <PreviewRenderer project={project} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Publish Modal */}
      <AnimatePresence>
        {showPublish && publishedSlug && (
          <Modal onClose={() => setShowPublish(false)} title="Приглашение опубликовано! 🎉">
            <div className="space-y-4">
              <p className="text-white/60 text-sm">Ваше приглашение доступно по короткой ссылке:</p>
              <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
                <code className="text-sm text-rose-300 flex-1 truncate">
                  {window.location.origin}/p/{publishedSlug}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/p/${publishedSlug}`)}
                  className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-lg text-xs text-rose-300 hover:bg-rose-500/30 transition-all shrink-0"
                >
                  Копировать
                </button>
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-xs text-green-300/80">
                  ✅ <strong>Отлично!</strong> Данные сжаты и закодированы в ссылке. Она будет работать в любом браузере на любом устройстве без сервера.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowPublish(false); navigate('/dashboard'); }}
                  className="flex-1 py-3 rounded-full bg-white/5 border border-white/10 font-medium hover:bg-white/10 transition-all"
                >
                  В кабинет
                </button>
                <button
                  onClick={() => window.open(`/p/${publishedSlug}`, '_blank')}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 font-medium"
                >
                  Открыть
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ Sub-components ============

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-lg w-full bg-dark-900 rounded-2xl border border-white/10 p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function SceneElementPreview({ element, isSelected, onClick }: { element: SceneElement; isSelected: boolean; onClick: () => void }) {
  const animClass = element.animation?.type === 'fadeIn' ? 'animate-[fadeIn_1s_ease]' : '';
  
  return (
    <div
      onClick={onClick}
      className={`mb-3 cursor-pointer rounded-lg transition-all ${
        isSelected ? 'ring-2 ring-rose-400/50 ring-offset-2 ring-offset-transparent' : ''
      }`}
    >
      {element.type === 'heading' && (
        <h2 className="font-display text-2xl font-bold text-white text-center mb-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          {element.props.text}
        </h2>
      )}
      {element.type === 'text' && (
        <p className={`text-white/80 text-sm leading-relaxed whitespace-pre-line ${element.props.style === 'letter' ? 'font-handwriting text-lg' : element.props.style === 'center' ? 'text-center' : ''}`}>
          {element.props.text}
        </p>
      )}
      {element.type === 'typewriter' && (
        <p className="text-white/70 text-sm italic text-center">
          {element.props.text}
        </p>
      )}
      {element.type === 'button' && (
        <div className="flex justify-center my-3">
          <div className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-sm text-white backdrop-blur-sm hover:bg-white/15 transition-all">
            {element.props.text}
          </div>
        </div>
      )}
      {element.type === 'image' && (
        <div className="my-3 rounded-xl overflow-hidden bg-white/5 aspect-video flex items-center justify-center">
          {element.props.src ? (
            <img src={element.props.src} alt={element.props.caption || ''} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-white/30">
              <Image size={32} className="mx-auto mb-1" />
              <span className="text-xs">{element.props.caption || 'Добавьте изображение'}</span>
            </div>
          )}
        </div>
      )}
      {element.type === 'envelope' && (
        <div className="my-3 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <span className="text-3xl block mb-2">💌</span>
          <p className="text-sm text-white/60 italic">"{element.props.message}"</p>
        </div>
      )}
      {element.type === 'secret-card' && (
        <div className="my-3 p-4 rounded-xl bg-gradient-to-r from-lavender-500/10 to-rose-500/10 border border-white/10 text-center">
          <Sparkles size={24} className="mx-auto mb-2 text-lavender-300" />
          <p className="text-xs text-white/40">{element.props.hint}</p>
          <p className="text-sm text-white/70 mt-2">{element.props.reveal}</p>
        </div>
      )}
      {element.type === 'question' && (
        <div className="my-3 space-y-2">
          {(element.props.options || []).map((opt: string, i: number) => (
            <div key={i} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-center">
              {opt}
            </div>
          ))}
        </div>
      )}
      {element.type === 'choice' && (
        <div className="my-3">
          {element.props.question && <p className="text-sm text-white/60 text-center mb-2">{element.props.question}</p>}
          <div className="space-y-2">
            {(element.props.options || []).map((opt: string, i: number) => (
              <div key={i} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-center hover:bg-white/10 transition-all cursor-pointer">
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
      {element.type === 'hearts' && (
        <div className="my-2 flex flex-wrap justify-center gap-1">
          {[...Array(Math.min(element.props.count || 5, 12))].map((_, i) => (
            <Heart key={i} size={14} className="text-rose-400" fill="currentColor" />
          ))}
        </div>
      )}
      {element.type === 'final-confirm' && (
        <div className="my-3 space-y-2">
          {(element.props.options || []).map((opt: string, i: number) => (
            <div key={i} className="px-4 py-3 bg-gradient-to-r from-rose-500/10 to-lavender-500/10 border border-rose-400/20 rounded-xl text-sm text-center cursor-pointer hover:from-rose-500/20 hover:to-lavender-500/20 transition-all">
              {opt}
            </div>
          ))}
        </div>
      )}
      {element.type === 'divider' && (
        <div className="my-4 flex items-center justify-center">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      )}
    </div>
  );
}

function PreviewRenderer({ project }: { project: Project }) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const scene = project.scenes[currentSceneIdx];

  const goNext = () => {
    if (currentSceneIdx < project.scenes.length - 1) {
      setCurrentSceneIdx(currentSceneIdx + 1);
    }
  };

  return (
    <div className="phone-frame aspect-[9/19] relative" style={{ background: scene?.background.value }}>
      <div className="h-full w-full overflow-y-auto p-6 flex flex-col">
        {scene?.elements.map(el => (
          <div key={el.id} className="mb-3">
            {el.type === 'heading' && (
              <h2 className="font-display text-2xl font-bold text-white text-center">{el.props.text}</h2>
            )}
            {el.type === 'text' && (
              <p className={`text-white/80 text-sm leading-relaxed whitespace-pre-line ${el.props.style === 'letter' ? 'font-handwriting text-lg' : el.props.style === 'center' ? 'text-center' : ''}`}>
                {el.props.text}
              </p>
            )}
            {el.type === 'typewriter' && (
              <p className="text-white/70 text-sm italic text-center">{el.props.text}</p>
            )}
            {el.type === 'button' && (
              <div className="flex justify-center my-3">
                <button onClick={goNext} className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-sm text-white backdrop-blur-sm hover:bg-white/20 transition-all">
                  {el.props.text}
                </button>
              </div>
            )}
            {el.type === 'image' && (
              <div className="my-3 rounded-xl overflow-hidden bg-white/5 aspect-video flex items-center justify-center">
                {el.props.src ? (
                  <img src={el.props.src} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white/30 text-xs">Изображение</div>
                )}
              </div>
            )}
            {el.type === 'envelope' && (
              <div className="my-3 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <span className="text-3xl block mb-2">💌</span>
                <p className="text-sm text-white/60 italic">"{el.props.message}"</p>
              </div>
            )}
            {el.type === 'secret-card' && (
              <div className="my-3 p-4 rounded-xl bg-gradient-to-r from-lavender-500/10 to-rose-500/10 border border-white/10 text-center">
                <Sparkles size={24} className="mx-auto mb-2 text-lavender-300" />
                <p className="text-sm text-white/70">{el.props.reveal}</p>
              </div>
            )}
            {el.type === 'question' && (
              <div className="my-3 space-y-2">
                {(el.props.options || []).map((opt: string, i: number) => (
                  <div key={i} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-center">{opt}</div>
                ))}
              </div>
            )}
            {el.type === 'choice' && (
              <div className="my-3">
                {el.props.question && <p className="text-sm text-white/60 text-center mb-2">{el.props.question}</p>}
                <div className="space-y-2">
                  {(el.props.options || []).map((opt: string, i: number) => (
                    <div key={i} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-center">{opt}</div>
                  ))}
                </div>
              </div>
            )}
            {el.type === 'hearts' && (
              <div className="my-2 flex flex-wrap justify-center gap-1">
                {[...Array(Math.min(el.props.count || 5, 15))].map((_, i) => (
                  <Heart key={i} size={14} className="text-rose-400" fill="currentColor" />
                ))}
              </div>
            )}
            {el.type === 'final-confirm' && (
              <div className="my-3 space-y-2">
                {(el.props.options || []).map((opt: string, i: number) => (
                  <div key={i} className="px-4 py-3 bg-gradient-to-r from-rose-500/10 to-lavender-500/10 border border-rose-400/20 rounded-xl text-sm text-center">
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Helpers ============

function getDefaultElements(type: SceneType): SceneElement[] {
  switch (type) {
    case 'cover':
      return [
        { id: crypto.randomUUID(), type: 'heading', props: { text: 'Заголовок', style: 'elegant' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
        { id: crypto.randomUUID(), type: 'button', props: { text: 'Начать →', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 } },
      ];
    case 'letter':
      return [
        { id: crypto.randomUUID(), type: 'text', props: { text: 'Ваш текст письма...', style: 'letter' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
        { id: crypto.randomUUID(), type: 'button', props: { text: 'Далее →', action: 'next' }, animation: { type: 'fadeIn', duration: 0.8, delay: 0.5 } },
      ];
    case 'envelope':
      return [
        { id: crypto.randomUUID(), type: 'envelope', props: { message: 'Ваше послание...' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
      ];
    case 'question':
      return [
        { id: crypto.randomUUID(), type: 'question', props: { options: ['Вариант 1', 'Вариант 2'] }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
      ];
    case 'choice':
      return [
        { id: crypto.randomUUID(), type: 'heading', props: { text: 'Выберите вариант', style: 'elegant' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
        { id: crypto.randomUUID(), type: 'choice', props: { question: 'Ваш вопрос?', options: ['Вариант 1', 'Вариант 2', 'Вариант 3'] }, animation: { type: 'fadeIn', duration: 1, delay: 0.5 } },
      ];
    case 'finale':
      return [
        { id: crypto.randomUUID(), type: 'heading', props: { text: 'Финал', style: 'elegant' }, animation: { type: 'scaleIn', duration: 1, delay: 0 } },
        { id: crypto.randomUUID(), type: 'final-confirm', props: { options: ['Да! 💖'] }, animation: { type: 'fadeIn', duration: 1, delay: 0.5 } },
      ];
    case 'gallery':
      return [
        { id: crypto.randomUUID(), type: 'heading', props: { text: 'Галерея', style: 'elegant' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
        { id: crypto.randomUUID(), type: 'image', props: { src: '', caption: 'Фото', placeholder: true }, animation: { type: 'scaleIn', duration: 1, delay: 0.5 } },
      ];
    case 'secret':
      return [
        { id: crypto.randomUUID(), type: 'secret-card', props: { hint: 'Нажми, чтобы раскрыть', reveal: 'Секретный текст' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
      ];
    default:
      return [
        { id: crypto.randomUUID(), type: 'text', props: { text: 'Новая сцена', style: 'center' }, animation: { type: 'fadeIn', duration: 1, delay: 0 } },
      ];
  }
}

function getDefaultProps(type: ElementType): Record<string, any> {
  switch (type) {
    case 'heading': return { text: 'Заголовок', style: 'elegant' };
    case 'text': return { text: 'Текст...', style: '' };
    case 'typewriter': return { text: 'Печатающийся текст...', speed: 50 };
    case 'image': return { src: '', caption: '', placeholder: true };
    case 'button': return { text: 'Кнопка', action: 'next' };
    case 'envelope': return { message: 'Послание...' };
    case 'secret-card': return { hint: 'Нажми, чтобы раскрыть', reveal: 'Секрет' };
    case 'question': return { options: ['Да', 'Нет'] };
    case 'choice': return { question: 'Вопрос?', options: ['Вариант 1', 'Вариант 2'] };
    case 'hearts': return { count: 10 };
    case 'final-confirm': return { options: ['Да! 💖'] };
    case 'divider': return {};
    default: return {};
  }
}
