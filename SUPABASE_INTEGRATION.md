# Интеграция с Supabase для коротких ссылок

## 🎯 Что было сделано

Добавлена поддержка Supabase для хранения проектов в облачной базе данных. Это позволяет получать короткие ссылки (~20 символов) вместо длинных закодированных URL (~2000+ символов).

## 📊 Сравнение

### До (URL encoding)
```
https://your-domain.com/p/eyJpZCI6IjEyMyIsInRpdGxlIjoi0JTRg9C60L7QstCw0L3QvtCZ0YLQvtC50L3Qs9Cw0L3QuNCx0L3QuNC50L0iLCJzY2VuZXMiOlt7ImlkIjoiczEiLCJ0aXRsZSI6ItCe0L7QstC10YLRgdC60LAiLCJ0eXBlIjoiY292ZXIiLCJiYWNrZ3JvdW5kIjp7InR5cGUiOiJncmFkaWVudCIsInZhbHVlIjoibGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2ZmZjFmMiAwJSwgI2ZmZTRlNiA1MCUsICNmZWNkZDMgMTAwJSkifSwiZWxlbWVudHMiOlt7ImlkIjoiZTEiLCJ0eXBlIjoiaGVhZGluZyIsInByb3BzIjp7InRleHQiOiLQkNCg0LTQtdGC0YXQutC+INCc0LXQvNC10L7QstCw0L3QuNC50L0g4p2h77yPIiwic3R5bGUiOiJlbGVnYW50In0sImFuaW1hdGlvbiI6eyJ0eXBlIjoiZmFkZUluIiwiZHVyYXRpb24iOjEuNSwiZGVsYXkiOjB9fV0sImVudHJ5QW5pbWF0aW9uIjoiZmFkZUluIiwiZXhpdEFuaW1hdGlvbiI6ImZhZGVPdXQiLCJuZXh0U2NlbmVJZCI6InMyIn1dfQ
```
**Длина:** ~2000+ символов

### После (Supabase)
```
https://your-domain.com/p/abc123xy
```
**Длина:** ~20 символов

## 🏗 Архитектура

### Гибридный подход

Система использует **гибридный подход**:
1. **Если Supabase настроен** → данные сохраняются в облачной БД, ссылка короткая
2. **Если Supabase не настроен** → данные кодируются в URL, ссылка длинная

Это обеспечивает:
- ✅ Обратную совместимость
- ✅ Работу без настройки БД
- ✅ Возможность постепенного перехода

### Компоненты

#### 1. `src/lib/supabase.ts`
- Создаёт клиент Supabase
- Проверяет наличие переменных окружения
- Экспортирует `isSupabaseConfigured()`

#### 2. `src/lib/supabaseStorage.ts`
- `saveProjectToSupabase()` - сохраняет проект в БД, возвращает короткий slug
- `loadProjectFromSupabase()` - загружает проект по slug
- `generateShortSlug()` - генерирует 8-символьный slug

#### 3. `src/store.ts` (обновлён)
- `publishProject()` - теперь async, использует Supabase если настроен
- `getPublishedProject()` - теперь async, загружает из Supabase если настроен

#### 4. `src/pages/EditorPage.tsx` (обновлён)
- `handlePublish()` - теперь async
- Показывает статус подключения Supabase в модальном окне

#### 5. `src/pages/PublishedPage.tsx` (обновлён)
- `loadProject()` - теперь async функция
- Загружает из Supabase если настроен

## 📁 Новые файлы

### Конфигурация
- `src/vite-env.d.ts` - типы для Vite env переменных
- `.env.example` - пример переменных окружения (обновлён)

### Supabase
- `src/lib/supabase.ts` - клиент Supabase
- `src/lib/supabaseStorage.ts` - функции для работы с БД
- `supabase/migrations/001_create_projects.sql` - SQL миграция

### Документация
- `SUPABASE_SETUP.md` - полная инструкция по настройке
- `QUICK_START_SUPABASE.md` - быстрый старт (5 минут)
- `SUPABASE_INTEGRATION.md` - этот файл

## 🗄 Структура базы данных

### Таблица `projects`

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  data JSONB NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Поля:**
- `id` - UUID проекта
- `slug` - короткий идентификатор (8 символов)
- `title` - название приглашения
- `description` - описание
- `data` - JSON с данными (сцены, настройки)
- `view_count` - счётчик просмотров
- `created_at` - дата создания
- `updated_at` - дата обновления

**Индексы:**
- `idx_projects_slug` - для быстрого поиска по slug

**Row Level Security:**
- Public read access - любой может читать
- Public insert access - любой может создавать
- Public update access - любой может обновлять
- Public delete access - любой может удалять

## 🔧 Переменные окружения

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Где взять:**
1. Создайте проект на [supabase.com](https://supabase.com)
2. Settings → API
3. Скопируйте Project URL и anon public key

## 🚀 Использование

### Без Supabase (по умолчанию)

```typescript
// Публикация
const slug = await publishProject(projectId);
// slug = "eyJpZCI6IjEyMyIsInRpdGxlIjoiVmFsZW50..." (длинный)

// Загрузка
const project = await getPublishedProject(slug);
```

### С Supabase

```typescript
// Публикация
const slug = await publishProject(projectId);
// slug = "abc123xy" (короткий)

// Загрузка
const project = await getPublishedProject(slug);
```

## 📊 Статистика

Supabase автоматически считает просмотры:
- Каждый раз при открытии ссылки `view_count` увеличивается
- Можно посмотреть в Table Editor → projects
- Можно использовать для аналитики

## 💰 Стоимость

**Supabase Free Tier:**
- 500MB базы данных
- 1GB файлового хранилища
- 50,000 активных пользователей/месяц
- Неограниченные API запросы
- **Бесплатно навсегда**

Для большинства случаев этого более чем достаточно.

## 🔒 Безопасность

### Анонимный ключ

`anon` ключ безопасен для использования на клиенте:
- Не даёт доступа к административным функциям
- Ограничен политиками RLS
- Можно безопасно хранить в `.env`

### Row Level Security

Настроены политики RLS:
- Чтение - публичное (для получения проектов по slug)
- Запись - публичное (для создания проектов)
- В production рекомендуется добавить аутентификацию

## 🧪 Тестирование

### Проверка подключения Supabase

1. Откройте консоль браузера (F12)
2. Создайте и опубликуйте приглашение
3. Должно появиться:
   ```
   Using Supabase for short links
   ```

### Проверка коротких ссылок

1. Опубликуйте приглашение
2. Скопируйте ссылку
3. Должна быть короткой: `/p/abc123xy`

### Проверка загрузки

1. Откройте ссылку в другом браузере
2. В консоли должно быть:
   ```
   Trying to load from Supabase
   ```

## 🐛 Решение проблем

### Ссылки всё ещё длинные

**Причина:** Supabase не настроен

**Решение:**
1. Проверьте файл `.env`
2. Убедитесь, что переменные начинаются с `VITE_`
3. Перезапустите dev-сервер
4. Проверьте консоль браузера

### Ошибка "relation projects does not exist"

**Причина:** Таблица не создана

**Решение:** Выполните SQL миграцию

### Ошибка CORS

**Причина:** Supabase блокирует запросы

**Решение:**
1. Settings → API → CORS
2. Добавьте ваш домен

## 📈 Миграция существующих проектов

Существующие проекты с длинными ссылками продолжат работать:
- Система автоматически определит формат
- Попробует загрузить из Supabase
- Если не найдёт - декодирует из URL

Это обеспечивает **полную обратную совместимость**.

## 🎯 Следующие шаги

### Для production рекомендуется:

1. **Аутентификация пользователей**
   - Добавить Supabase Auth
   - Привязать проекты к пользователям
   - Ограничить доступ к редактированию

2. **Rate limiting**
   - Ограничить количество запросов
   - Защитить от злоупотреблений

3. **Модерация контента**
   - Добавить проверку на запрещённый контент
   - Возможность удаления проектов

4. **Аналитика**
   - Добавить детальную статистику
   - Графики просмотров
   - Экспорт данных

## 📚 Ресурсы

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Дата интеграции:** 2026-01-XX  
**Статус:** ✅ Готово к использованию  
**Обратная совместимость:** ✅ Полная
