import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Star, ArrowRight, MessageCircle, Camera, Music, Zap } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-[120px]"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lavender-600/20 rounded-full blur-[120px]"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[150px]"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        
        {/* Floating hearts */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-400/20"
              style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart size={20 + i * 5} fill="currentColor" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Sparkles size={16} className="text-rose-400" />
              <span className="text-sm text-white/70">Создай момент, который запомнится</span>
            </div>
          </motion.div>

          <motion.h1
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Не просто пригласи.{' '}
            <span className="text-gradient">Создай момент,</span>
            <br />
            который запомнится
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Интерактивные приглашения с фотографиями, музыкой, анимациями и личными посланиями. 
            Создай свою историю и отправь одну ссылку.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              to="/templates"
              className="group px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 rounded-full text-white font-semibold text-lg shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              Создать приглашение
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/templates"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-medium text-lg hover:bg-white/10 transition-all duration-300"
            >
              Посмотреть примеры
            </Link>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            className="mt-16 mx-auto max-w-[280px]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="phone-frame aspect-[9/19] bg-gradient-to-b from-dark-800 to-dark-900">
              <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart size={48} className="text-rose-400 mx-auto mb-4" fill="currentColor" />
                </motion.div>
                <p className="font-display text-xl text-white/90 mb-2">У меня есть идея...</p>
                <p className="text-sm text-white/50 mb-6">Хочу пригласить тебя на особенный вечер</p>
                <div className="px-6 py-3 bg-rose-500/20 border border-rose-400/30 rounded-full text-rose-300 text-sm">
                  Открыть приглашение ✨
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Как это работает
          </motion.h2>
          <p className="text-center text-white/50 mb-16 text-lg">Три простых шага до идеального приглашения</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: 'Выбери шаблон', desc: 'Подбери идеальный шаблон для своего повода или начни с чистого листа' },
              { icon: Sparkles, title: 'Настрой историю', desc: 'Добавь свои тексты, фотографии, музыку и интерактивные элементы' },
              { icon: Heart, title: 'Отправь ссылку', desc: 'Опубликуй и отправь одну ссылку — получатель увидит целую историю' },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-500/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-rose-600 to-lavender-600 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <step.icon size={32} className="text-rose-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-white/50">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/30 to-dark-950" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Примеры приглашений
          </motion.h2>
          <p className="text-center text-white/50 mb-12 text-lg">Каждое приглашение — уникальная интерактивная история</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { emoji: '🕯️', name: 'Романтический ужин', bg: 'from-dark-800 to-purple-900/50' },
              { emoji: '💍', name: 'Годовщина', bg: 'from-rose-100 to-rose-200' },
              { emoji: '💎', name: 'Предложение', bg: 'from-dark-900 to-indigo-900/50' },
              { emoji: '❤️', name: 'Валентинка', bg: 'from-rose-50 to-pink-100' },
              { emoji: '🎂', name: 'День рождения', bg: 'from-purple-50 to-violet-100' },
              { emoji: '🎁', name: 'Сюрприз', bg: 'from-dark-800 to-rose-900/30' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`aspect-[3/4] rounded-2xl bg-gradient-to-b ${item.bg} border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4 group-hover:border-rose-500/30 group-hover:scale-[1.02] transition-all duration-300`}>
                  <span className="text-4xl mb-3">{item.emoji}</span>
                  <p className={`text-sm font-medium text-center ${i < 3 || i === 5 ? 'text-white/80' : 'text-dark-800'}`}>{item.name}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-sm"
            >
              Смотреть все шаблоны <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Всё для идеального приглашения
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MessageCircle, title: 'Интерактивные сцены', desc: 'Конверты, вопросы, выборы и секретные послания' },
              { icon: Camera, title: 'Фотографии', desc: 'Загружайте свои фото и создавайте галереи' },
              { icon: Music, title: 'Музыка и голос', desc: 'Добавьте фоновую музыку или запишите голосовое' },
              { icon: Sparkles, title: 'Анимации', desc: 'Плавные появления, печатание текста, летающие сердечки' },
              { icon: Zap, title: 'Быстрая публикация', desc: 'Одна ссылка — и приглашение доступно всем' },
              { icon: Heart, title: 'Ответы получателя', desc: 'Собирайте ответы и подтверждения прямо в истории' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <feat.icon size={24} className="text-rose-400 mb-3" />
                <h3 className="font-semibold mb-1">{feat.title}</h3>
                <p className="text-sm text-white/50">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Для любого повода
          </motion.h2>
          <p className="text-center text-white/50 mb-16 text-lg">Создавайте приглашения на любое событие</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { emoji: '🕯️', label: 'Свидание' },
              { emoji: '💍', label: 'Годовщина' },
              { emoji: '🎂', label: 'День рождения' },
              { emoji: '💎', label: 'Предложение' },
              { emoji: '❤️', label: 'Валентинка' },
              { emoji: '🎁', label: 'Сюрприз' },
              { emoji: '✈️', label: 'Путешествие' },
              { emoji: '💐', label: 'Примирение' },
              { emoji: '💒', label: 'Свадьба' },
              { emoji: '✨', label: 'Любой повод' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 hover:border-rose-500/20 transition-all cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="text-3xl mb-2 block">{item.emoji}</span>
                <span className="text-sm text-white/70">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Тарифы
          </motion.h2>
          <p className="text-center text-white/50 mb-16 text-lg">Начните бесплатно, расширяйте возможности</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Бесплатный',
                price: '0 ₽',
                period: 'навсегда',
                features: ['3 шаблона', 'Базовые анимации', '1 активный проект', 'Публичная ссылка'],
                cta: 'Начать бесплатно',
                popular: false,
              },
              {
                name: 'Premium',
                price: '299 ₽',
                period: 'в месяц',
                features: ['Все шаблоны', 'Расширенные анимации', '10 проектов', 'Загрузка фото и аудио', 'Секретные послания'],
                cta: 'Выбрать Premium',
                popular: true,
              },
              {
                name: 'Creator',
                price: '599 ₽',
                period: 'в месяц',
                features: ['Всё из Premium', 'Расширенные сценарии', 'Безлимит проектов', 'Расширенная статистика', 'Приоритетная поддержка'],
                cta: 'Выбрать Creator',
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                className={`relative p-8 rounded-2xl border transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-rose-500/10 to-lavender-500/10 border-rose-500/30 scale-105'
                    : 'bg-white/5 border-white/10'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-rose-600 to-lavender-600 rounded-full text-xs font-semibold">
                    Популярный
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-white/50 text-sm">/ {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/templates"
                  className={`block text-center py-3 rounded-full font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:shadow-lg hover:shadow-rose-500/25'
                      : 'bg-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h2
            className="font-display text-3xl sm:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Частые вопросы
          </motion.h2>
          
          <div className="space-y-4">
            {[
              { q: 'Нужно ли получателю устанавливать приложение?', a: 'Нет! Получатель просто открывает ссылку в браузере на любом устройстве.' },
              { q: 'Можно ли использовать свои фотографии?', a: 'Да, вы можете загрузить любые фотографии в формате JPEG, PNG или WebP.' },
              { q: 'Как долго доступно приглашение?', a: 'Опубликованные приглашения доступны бессрочно, пока вы не снимете их с публикации.' },
              { q: 'Можно ли добавить музыку?', a: 'Да, можно загрузить свой аудиофайл или записать голосовое сообщение.' },
              { q: 'Увидит ли получатель, что я использовал конструктор?', a: 'На бесплатном тарифе отображается небольшая метка сервиса. На платных — полностью ваш контент.' },
            ].map((faq, i) => (
              <motion.details
                key={i}
                className="group p-6 rounded-xl bg-white/5 border border-white/5 open:border-white/15"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <summary className="font-medium cursor-pointer flex items-center justify-between">
                  {faq.q}
                  <ArrowRight size={16} className="group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-white/60 text-sm">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart size={48} className="text-rose-400 mx-auto mb-6" fill="currentColor" />
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Создайте первое приглашение
            </h2>
            <p className="text-white/50 mb-8 text-lg">
              Это займёт всего несколько минут. Выберите шаблон, настройте — и отправьте ссылку.
            </p>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 rounded-full text-white font-semibold text-lg shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 hover:scale-105"
            >
              Начать бесплатно
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-rose-400" fill="currentColor" />
            <span className="font-display text-lg font-semibold">LoveLetter</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link to="/templates" className="hover:text-white/70 transition-colors">Шаблоны</Link>
            <Link to="/dashboard" className="hover:text-white/70 transition-colors">Кабинет</Link>
            <span>Политика конфиденциальности</span>
            <span>Условия использования</span>
          </div>
          <p className="text-sm text-white/30">© 2026 LoveLetter</p>
        </div>
      </footer>
    </div>
  );
}
