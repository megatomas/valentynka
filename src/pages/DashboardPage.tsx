import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Plus, Edit, Eye, Copy, Trash2, ExternalLink, MoreVertical,
  FileText, CheckCircle, Clock, ArrowLeft, Sparkles, BarChart3
} from 'lucide-react';
import { getProjects, deleteProject, unpublishProject, duplicateProject } from '../store';
import type { Project } from '../types';

export function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const filtered = projects.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(getProjects());
    setShowDeleteConfirm(null);
    setMenuOpen(null);
  };

  const handleDuplicate = (id: string) => {
    duplicateProject(id);
    setProjects(getProjects());
    setMenuOpen(null);
  };

  const handleUnpublish = (id: string) => {
    unpublishProject(id);
    setProjects(getProjects());
    setMenuOpen(null);
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
  };

  const stats = {
    total: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    drafts: projects.filter(p => p.status === 'draft').length,
    totalViews: projects.reduce((acc, p) => acc + p.viewCount, 0),
    totalResponses: projects.reduce((acc, p) => acc + p.responses.length, 0),
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Heart size={20} className="text-rose-400" fill="currentColor" />
              <span className="font-display text-lg font-semibold">LoveLetter</span>
            </Link>
          </div>
          <Link
            to="/templates"
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-rose-500/20 transition-all"
          >
            <Plus size={14} /> Создать
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Всего проектов', value: stats.total, icon: FileText, color: 'text-white' },
            { label: 'Опубликовано', value: stats.published, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Черновики', value: stats.drafts, icon: Clock, color: 'text-yellow-400' },
            { label: 'Просмотры', value: stats.totalViews, icon: BarChart3, color: 'text-rose-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="p-4 rounded-xl bg-white/5 border border-white/5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <stat.icon size={18} className={`${stat.color} mb-2`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="font-display text-2xl font-bold mr-auto">Мои проекты</h1>
          {(['all', 'published', 'draft'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                filter === f
                  ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
                  : 'bg-white/5 border border-white/5 text-white/50 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Все' : f === 'published' ? 'Опубликованные' : 'Черновики'}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                className="group rounded-xl bg-white/5 border border-white/5 overflow-hidden hover:border-white/15 transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {/* Card header */}
                <div className="p-4 border-b border-white/5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{project.title}</h3>
                      <p className="text-xs text-white/40 mt-0.5">
                        {new Date(project.updatedAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === project.id ? null : project.id)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <MoreVertical size={14} />
                      </button>
                      <AnimatePresence>
                        {menuOpen === project.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute right-0 top-full mt-1 w-44 bg-dark-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-10"
                          >
                            <button
                              onClick={() => { navigate(`/editor/${project.id}`); setMenuOpen(null); }}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
                            >
                              <Edit size={14} /> Редактировать
                            </button>
                            <button
                              onClick={() => { handleDuplicate(project.id); }}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
                            >
                              <Copy size={14} /> Дублировать
                            </button>
                            {project.status === 'published' && project.publishedSlug && (
                              <>
                                <button
                                  onClick={() => { copyLink(project.publishedSlug!); setMenuOpen(null); }}
                                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
                                >
                                  <ExternalLink size={14} /> Копировать ссылку
                                </button>
                                <button
                                  onClick={() => handleUnpublish(project.id)}
                                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
                                >
                                  <Clock size={14} /> Снять с публикации
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setShowDeleteConfirm(project.id)}
                              className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-500/10 text-red-400 flex items-center gap-2"
                            >
                              <Trash2 size={14} /> Удалить
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      project.status === 'published'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {project.status === 'published' ? 'Опубликовано' : 'Черновик'}
                    </span>
                    <span className="text-xs text-white/30">
                      {project.scenes.length} сцен
                    </span>
                  </div>

                  {project.publishedSlug && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-white/5 rounded-lg">
                      <ExternalLink size={12} className="text-white/30 shrink-0" />
                      <span className="text-xs text-white/40 truncate">
                        /p/{project.publishedSlug}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {project.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={12} /> {project.responses.length}
                    </span>
                  </div>
                </div>

                {/* Card actions */}
                <div className="p-4 pt-0 flex gap-2">
                  <button
                    onClick={() => navigate(`/editor/${project.id}`)}
                    className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Edit size={13} /> Открыть
                  </button>
                  {project.publishedSlug && (
                    <button
                      onClick={() => window.open(`/p/${project.publishedSlug}`, '_blank')}
                      className="flex-1 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm text-rose-300 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye size={13} /> Просмотр
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Sparkles size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-lg text-white/40 mb-2">
              {filter === 'all' ? 'У вас пока нет проектов' : 'Нет проектов в этой категории'}
            </p>
            <p className="text-sm text-white/30 mb-6">Создайте первое приглашение из шаблона</p>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-500 rounded-full font-medium hover:shadow-lg hover:shadow-rose-500/20 transition-all"
            >
              <Plus size={16} /> Создать приглашение
            </Link>
          </motion.div>
        )}
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-sm w-full bg-dark-900 rounded-2xl border border-white/10 p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-semibold mb-2">Удалить проект?</h3>
              <p className="text-sm text-white/50 mb-6">Это действие нельзя отменить. Проект и все его данные будут удалены.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-full bg-white/5 border border-white/10 font-medium hover:bg-white/10 transition-all"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 py-3 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 transition-all"
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
