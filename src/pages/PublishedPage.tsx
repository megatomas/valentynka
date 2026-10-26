import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ChevronRight } from 'lucide-react';
import { getProjectBySlug } from '../store';
import type { Project, Scene, SceneElement } from '../types';

export function PublishedPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [revealedSecrets, setRevealedSecrets] = useState<Set<string>>(new Set());
  const [openedEnvelope, setOpenedEnvelope] = useState<Set<string>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (slug) {
      const p = getProjectBySlug(slug);
      if (p) {
        setProject(p);
        // Increment view count
        try {
          const projects = JSON.parse(localStorage.getItem('loveletter_projects') || '[]');
          const idx = projects.findIndex((proj: Project) => proj.id === p.id);
          if (idx !== -1) {
            projects[idx].viewCount = (projects[idx].viewCount || 0) + 1;
            localStorage.setItem('loveletter_projects', JSON.stringify(projects));
          }
        } catch (e) {
          console.error('Error updating view count:', e);
        }
      } else {
        setNotFound(true);
      }
    }
  }, [slug]);

  const currentScene = project?.scenes[currentSceneIdx];

  const goNext = () => {
    if (project && currentSceneIdx < project.scenes.length - 1) {
      setCurrentSceneIdx(currentSceneIdx + 1);
    }
  };

  const handleAnswer = (elementId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [elementId]: answer }));
    // Save response
    if (project) {
      const projects = JSON.parse(localStorage.getItem('loveletter_projects') || '[]');
      const idx = projects.findIndex((p: Project) => p.id === project.id);
      if (idx !== -1) {
        projects[idx].responses = projects[idx].responses || [];
        projects[idx].responses.push({
          id: crypto.randomUUID(),
          sceneId: currentScene?.id || '',
          elementId,
          answer,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('loveletter_projects', JSON.stringify(projects));
      }
    }
    // Trigger confetti for final confirm
    if (currentScene?.type === 'finale') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const toggleSecret = (elementId: string) => {
    setRevealedSecrets(prev => {
      const next = new Set(prev);
      if (next.has(elementId)) next.delete(elementId);
      else next.add(elementId);
      return next;
    });
  };

  const toggleEnvelope = (elementId: string) => {
    setOpenedEnvelope(prev => {
      const next = new Set(prev);
      next.add(elementId);
      return next;
    });
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white px-4">
        <div className="text-center max-w-md">
          <Heart size={48} className="mx-auto text-rose-400/30 mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Приглашение не найдено</h1>
          <p className="text-white/50 mb-4">
            Это приглашение недоступно. Возможные причины:
          </p>
          <ul className="text-sm text-white/40 mb-6 text-left space-y-2">
            <li>• Ссылка была введена неверно</li>
            <li>• Приглашение было удалено автором</li>
            <li>• Вы открыли ссылку в другом браузере (данные хранятся локально)</li>
          </ul>
          <p className="text-xs text-white/30 mb-6">
            В production-версии приглашения будут храниться в облачной базе данных и работать на всех устройствах.
          </p>
          <Link to="/" className="inline-block px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
            На главную
          </Link>
        </div>
      </div>
    );
  }

  if (!project || !currentScene) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
        <div className="animate-pulse text-white/50">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative" style={{ background: currentScene.background.value }}>
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-lavender-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Confetti effect */}
      <AnimatePresence>
        {showConfetti && <ConfettiEffect />}
      </AnimatePresence>

      {/* Scene content */}
      <motion.div
        key={currentSceneIdx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative z-10"
      >
        <div className="max-w-md w-full mx-auto space-y-6">
          {currentScene.elements.map((el, idx) => (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: el.animation?.duration || 0.8, 
                delay: el.animation?.delay || idx * 0.2 
              }}
            >
              <ElementRenderer
                element={el}
                isRevealed={revealedSecrets.has(el.id)}
                isOpened={openedEnvelope.has(el.id)}
                selectedAnswer={selectedAnswers[el.id]}
                onToggleSecret={() => toggleSecret(el.id)}
                onOpenEnvelope={() => toggleEnvelope(el.id)}
                onAnswer={(answer) => handleAnswer(el.id, answer)}
                onNext={goNext}
              />
            </motion.div>
          ))}
        </div>

        {/* Scene indicator */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {project.scenes.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentSceneIdx ? 'bg-white w-4' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Subtle branding */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 text-white/20 text-[10px] flex items-center gap-1">
          <Heart size={8} fill="currentColor" /> Создано в LoveLetter
        </div>
      </motion.div>
    </div>
  );
}

// ============ Element Renderer ============

function ElementRenderer({
  element,
  isRevealed,
  isOpened,
  selectedAnswer,
  onToggleSecret,
  onOpenEnvelope,
  onAnswer,
  onNext,
}: {
  element: SceneElement;
  isRevealed: boolean;
  isOpened: boolean;
  selectedAnswer?: string;
  onToggleSecret: () => void;
  onOpenEnvelope: () => void;
  onAnswer: (answer: string) => void;
  onNext: () => void;
}) {
  switch (element.type) {
    case 'heading':
      return (
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-center leading-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
          {element.props.text}
        </h1>
      );

    case 'text':
      return (
        <p className={`text-white/80 leading-relaxed whitespace-pre-line ${
          element.props.style === 'letter' ? 'font-handwriting text-xl sm:text-2xl' : 
          element.props.style === 'center' ? 'text-center text-lg' : 'text-base'
        }`}>
          {element.props.text}
        </p>
      );

    case 'typewriter':
      return <TypewriterText text={element.props.text} speed={element.props.speed || 50} />;

    case 'button':
      return (
        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="px-8 py-4 bg-white/10 border border-white/20 rounded-full text-white font-medium backdrop-blur-sm hover:bg-white/15 active:scale-95 transition-all animate-pulse-glow"
          >
            {element.props.text}
          </button>
        </div>
      );

    case 'image':
      return (
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          {element.props.src ? (
            <img src={element.props.src} alt={element.props.caption || ''} className="w-full object-cover" />
          ) : (
            <div className="aspect-video bg-white/5 flex items-center justify-center">
              <span className="text-white/30 text-sm">{element.props.caption || '📷'}</span>
            </div>
          )}
          {element.props.caption && (
            <p className="text-center text-sm text-white/50 mt-2 italic">{element.props.caption}</p>
          )}
        </div>
      );

    case 'envelope':
      return (
        <div className="flex justify-center">
          <motion.div
            className="relative cursor-pointer"
            onClick={onOpenEnvelope}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {!isOpened ? (
              <div className="w-64 h-40 bg-gradient-to-b from-rose-100 to-rose-200 rounded-lg shadow-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-300/30" />
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-rose-200 to-rose-300 clip-triangle" 
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                <Heart size={32} className="text-rose-500 z-10" fill="currentColor" />
                <p className="absolute bottom-3 text-xs text-rose-600 font-medium">Нажми, чтобы открыть</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-72 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl"
              >
                <span className="text-2xl block text-center mb-3">💌</span>
                <p className="text-center text-white/90 font-handwriting text-lg leading-relaxed">
                  {element.props.message}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      );

    case 'secret-card':
      return (
        <motion.div
          className="cursor-pointer"
          onClick={onToggleSecret}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {!isRevealed ? (
            <div className="p-8 rounded-2xl bg-gradient-to-r from-lavender-500/10 to-rose-500/10 border border-white/15 text-center backdrop-blur-sm">
              <Sparkles size={36} className="mx-auto mb-3 text-lavender-300" />
              <p className="text-white/60 text-sm">{element.props.hint || 'Нажми, чтобы раскрыть секрет'}</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-lavender-500/15 to-rose-500/15 border border-lavender-400/20 text-center backdrop-blur-sm"
            >
              <Sparkles size={24} className="mx-auto mb-2 text-lavender-300" />
              <p className="text-white/90 font-handwriting text-xl">{element.props.reveal}</p>
            </motion.div>
          )}
        </motion.div>
      );

    case 'question':
      return (
        <div className="space-y-3">
          {(element.props.options || []).map((opt: string, i: number) => (
            <motion.button
              key={i}
              onClick={() => onAnswer(opt)}
              className={`w-full px-6 py-4 rounded-2xl text-left transition-all ${
                selectedAnswer === opt
                  ? 'bg-rose-500/20 border-2 border-rose-400/50 text-white'
                  : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      );

    case 'choice':
      return (
        <div className="space-y-3">
          {element.props.question && (
            <p className="text-center text-white/70 text-lg mb-4">{element.props.question}</p>
          )}
          {(element.props.options || []).map((opt: string, i: number) => (
            <motion.button
              key={i}
              onClick={() => onAnswer(opt)}
              className={`w-full px-6 py-4 rounded-2xl text-center transition-all ${
                selectedAnswer === opt
                  ? 'bg-gradient-to-r from-rose-500/20 to-lavender-500/20 border-2 border-rose-400/40 text-white'
                  : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      );

    case 'hearts':
      return <FloatingHearts count={element.props.count || 10} />;

    case 'final-confirm':
      return (
        <div className="space-y-3">
          {(element.props.options || []).map((opt: string, i: number) => (
            <motion.button
              key={i}
              onClick={() => onAnswer(opt)}
              className={`w-full px-6 py-4 rounded-2xl text-center font-medium transition-all ${
                selectedAnswer === opt
                  ? 'bg-gradient-to-r from-rose-500 to-rose-400 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-gradient-to-r from-rose-500/10 to-lavender-500/10 border border-rose-400/20 text-white/90 hover:from-rose-500/20 hover:to-lavender-500/20'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {opt}
            </motion.button>
          ))}
          {selectedAnswer && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white/60 text-sm mt-4"
            >
              Спасибо за ответ! 💕
            </motion.p>
          )}
        </div>
      );

    case 'divider':
      return (
        <div className="flex items-center justify-center py-4">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      );

    default:
      return null;
  }
}

// ============ Animated Components ============

function TypewriterText({ text, speed = 50 }: { text: string; speed: number }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p className="text-white/70 text-center italic text-lg">
      {displayed}
      <span className="animate-pulse">|</span>
    </p>
  );
}

function FloatingHearts({ count }: { count: number }) {
  return (
    <div className="relative h-32 overflow-hidden">
      {[...Array(Math.min(count, 20))].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-400"
          initial={{ 
            x: Math.random() * 300 - 50, 
            y: 130,
            opacity: 0 
          }}
          animate={{ 
            y: -30,
            opacity: [0, 1, 1, 0],
            x: `${Math.random() * 300 - 50}px`,
          }}
          transition={{ 
            duration: 3 + Math.random() * 2, 
            delay: i * 0.2,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        >
          <Heart size={12 + Math.random() * 12} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
}

function ConfettiEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            background: ['#e11d48', '#9b6aff', '#f43f5e', '#fda4af', '#d4c0ff'][Math.floor(Math.random() * 5)],
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 20, 
            opacity: [1, 1, 0],
            rotate: Math.random() * 720,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
        />
      ))}
    </div>
  );
}
