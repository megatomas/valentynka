import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Search, Eye, Sparkles } from 'lucide-react';
import { TEMPLATES, createProjectFromTemplate } from '../store';
import { CATEGORY_LABELS, type TemplateCategory } from '../types';

export function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories: { value: TemplateCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'Все шаблоны' },
    ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value: value as TemplateCategory, label })),
  ];

  const filtered = TEMPLATES.filter(t => {
    const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleUseTemplate = (templateId: string) => {
    const project = createProjectFromTemplate(templateId);
    navigate(`/editor/${project.id}`);
  };

  const previewTpl = TEMPLATES.find(t => t.id === previewTemplate);

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Heart size={20} className="text-rose-400" fill="currentColor" />
            <span className="font-display text-lg font-semibold">LoveLetter</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">
              Мои проекты
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Выберите шаблон
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Начните с готового шаблона и настройте его под себя
          </p>
        </motion.div>

        {/* Search and filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Поиск шаблонов..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/50 transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                    : 'bg-white/5 border border-white/5 text-white/60 hover:text-white hover:border-white/15'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              className="group rounded-2xl bg-white/5 border border-white/5 overflow-hidden hover:border-white/15 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Preview area */}
              <div
                className="aspect-[4/3] relative overflow-hidden cursor-pointer"
                style={{ background: template.colorScheme.bg }}
                onClick={() => setPreviewTemplate(template.id)}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: `linear-gradient(135deg, ${template.colorScheme.primary}40, ${template.colorScheme.secondary}40)` }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <span className="text-5xl mb-3">{template.coverEmoji}</span>
                  <p className="text-center text-sm font-medium" style={{ color: template.colorScheme.primary }}>
                    {template.name}
                  </p>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <Eye size={16} />
                    <span className="text-sm">Предпросмотр</span>
                  </div>
                </div>
                {!template.isFree && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-rose-600 to-lavender-600 rounded-full text-xs font-medium flex items-center gap-1">
                    <Sparkles size={12} />
                    Premium
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-white/50 mb-4">{template.description}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewTemplate(template.id)}
                    className="flex-1 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all"
                  >
                    Предпросмотр
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template.id)}
                    className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 text-sm font-medium hover:shadow-lg hover:shadow-rose-500/20 transition-all"
                  >
                    Использовать
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <p className="text-lg">Шаблоны не найдены</p>
            <p className="text-sm mt-2">Попробуйте изменить фильтры</p>
          </div>
        )}

        {/* Create from scratch */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/40 mb-4">Не нашли подходящий шаблон?</p>
          <Link
            to="/editor/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
          >
            <Sparkles size={16} className="text-rose-400" />
            Создать с нуля
          </Link>
        </motion.div>
      </div>

      {/* Preview Modal */}
      {previewTpl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreviewTemplate(null)}>
          <motion.div
            className="max-w-lg w-full bg-dark-900 rounded-2xl border border-white/10 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Phone preview */}
            <div className="p-6">
              <div className="mx-auto max-w-[260px]">
                <div className="phone-frame aspect-[9/19]" style={{ background: previewTpl.colorScheme.bg }}>
                  <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-4xl mb-3">{previewTpl.coverEmoji}</span>
                    <p className="font-display text-lg mb-2" style={{ color: previewTpl.colorScheme.primary }}>
                      {previewTpl.name}
                    </p>
                    <p className="text-xs text-white/50 mb-4">{previewTpl.description}</p>
                    <div className="text-xs text-white/40">
                      {previewTpl.scenes.length} сцен
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-white/10 space-y-3">
              <h3 className="font-semibold text-lg">{previewTpl.name}</h3>
              <p className="text-sm text-white/50">{previewTpl.description}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="flex-1 py-3 rounded-full bg-white/5 border border-white/10 font-medium hover:bg-white/10 transition-all"
                >
                  Закрыть
                </button>
                <button
                  onClick={() => { handleUseTemplate(previewTpl.id); setPreviewTemplate(null); }}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 font-medium hover:shadow-lg hover:shadow-rose-500/20 transition-all"
                >
                  Использовать шаблон
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
