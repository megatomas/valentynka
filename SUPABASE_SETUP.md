# Настройка Supabase для коротких ссылок

## 🎯 Что даёт Supabase

- **Короткие ссылки** (~20 символов вместо нескольких тысяч)
- **Надёжное хранение** данных в облачной базе данных
- **Бесплатный план** с 500MB базы данных
- **Автоматическая статистика** просмотров
- **REST API** для быстрого доступа

## 📋 Пошаговая инструкция

### Шаг 1: Создайте аккаунт в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Войдите через GitHub или email
4. Это бесплатно!

### Шаг 2: Создайте новый проект

1. Нажмите "New Project"
2. Заполните форму:
   - **Name**: `loveletter` (или любое другое)
   - **Database Password**: придумайте надёжный пароль (сохраните его!)
   - **Region**: выберите ближайший к вам (например, Frankfurt для Европы)
3. Нажмите "Create new project"
4. Подождите 1-2 минуты, пока проект создаётся

### Шаг 3: Получите API ключи

1. В левом меню нажмите "Settings" (шестерёнка)
2. Перейдите в "API"
3. Скопируйте два значения:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: длинная строка (начинается с `eyJ...`)

### Шаг 4: Создайте таблицу projects

1. В левом меню нажмите "SQL Editor"
2. Нажмите "New query"
3. Скопируйте содержимое файла `supabase/migrations/001_create_projects.sql`
4. Вставьте в редактор
5. Нажмите "Run" (или Ctrl+Enter)
6. Должно появиться сообщение "Success. No rows returned"

### Шаг 5: Настройте переменные окружения

Создайте файл `.env` в корне проекта:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Замените значения на ваши из Шага 3.

### Шаг 6: Перезапустите dev-сервер

```bash
# Остановите сервер (Ctrl+C)
npm run dev
```

### Шаг 7: Проверьте работу

1. Создайте приглашение
2. Опубликуйте его
3. Ссылка должна быть короткой (~20 символов): `https://your-domain.com/p/abc123xy`
4. Откройте ссылку в другом браузере
5. Приглашение должно загрузиться

## 🔍 Проверка в Supabase

### Проверьте таблицу projects

1. В левом меню нажмите "Table Editor"
2. Выберите таблицу "projects"
3. Вы должны увидеть созданные проекты

### Проверьте статистику

Каждый раз, когда кто-то открывает ссылку, счётчик `view_count` увеличивается.

## 🚀 Деплой на Vercel

### Добавьте переменные окружения в Vercel

1. Перейдите в ваш проект на Vercel
2. Откройте "Settings" → "Environment Variables"
3. Добавьте две переменные:
   - `VITE_SUPABASE_URL` = ваш Project URL
   - `VITE_SUPABASE_ANON_KEY` = ваш anon public key
4. Нажмите "Save"
5. Redeploy проект

## 📊 Сравнение: до и после

### Без Supabase (URL encoding)
```
https://your-domain.com/p/eyJpZCI6IjEyMyIsInRpdGxlIjoi0JTRg9C60L7QstCw0L3QvtCZ0YLQvtC50L3Qs9Cw0L3QuNCx0L3QuNC50L0iLCJzY2VuZXMiOlt7ImlkIjoiczEiLCJ0aXRsZSI6ItCe0L7QstC10YLRgdC60LAiLCJ0eXBlIjoiY292ZXIiLCJiYWNrZ3JvdW5kIjp7InR5cGUiOiJncmFkaWVudCIsInZhbHVlIjoibGluZWFyLWdyYWRpZW50KDEzNWRlZywgI2ZmZjFmMiAwJSwgI2ZmZTRlNiA1MCUsICNmZWNkZDMgMTAwJSkifSwiZWxlbWVudHMiOlt7ImlkIjoiZTEiLCJ0eXBlIjoiaGVhZGluZyIsInByb3BzIjp7InRleHQiOiLQkNCg0LTQtdGC0YXQutC+INCc0LXQvNC10L7QstCw0L3QuNC50L0g4p2h77yPIiwic3R5bGUiOiJlbGVnYW50In0sImFuaW1hdGlvbiI6eyJ0eXBlIjoiZmFkZUluIiwiZHVyYXRpb24iOjEuNSwiZGVsYXkiOjB9fSx7ImlkIjoiZTIiLCJ0eXBlIjoiaGVhcnRzIiwicHJvcHMiOnsiY291bnQiOjE1fSwiYW5pbWF0aW9uIjp7InR5cGUiOiJmYWRlSW4iLCJkdXJhdGlvbiI6MC41LCJkZWxheSI6MC41fX0seyJpZCI6ImUzIiwidHlwZSI6ImJ1dHRvbiIsInByb3BzIjp7InRleHQiOiLQutCw0YLRh9C70LzQtdGA0L7QkSDwn5GM77yJIiwiYWN0aW9uIjoibmV4dCJ9LCJhbmltYXRpb24iOnsidHlwZSI6ImZhZGVJbiIsImR1cmF0aW9uIjowLjgsImRlbGF5IjoxLjV9fV0sImVudHJ5QW5pbWF0aW9uIjoiZmFkZUluIiwiZXhpdEFuaW1hdGlvbiI6ImZhZGVPdXQiLCJuZXh0U2NlbmVJZCI6InMyIn0seyJpZCI6InMyIiwidGl0bGUiOiLQn9C10YLRgdC+0LLQsCIsInR5cGUiOiJlbnZlbG9wZSIsImJhY2tncm91bmQiOnsidHlwZSI6ImdyYWRpZW50IiwidmFsdWUiOiJsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjZmZlNGU2IDAlLCAjZmZmMWYyIDEwMCUpIn0sImVsZW1lbnRzIjpbeyJpZCI6ImU0IiwidHlwZSI6ImVudmVsb3BlIiwicHJvcHMiOnsibWVzc2FnZSI6ItCe0LDQsdC
```

**Длина:** ~2000+ символов

### С Supabase
```
https://your-domain.com/p/abc123xy
```

**Длина:** ~20 символов

## 💰 Стоимость

Supabase бесплатный план включает:
- 500MB базы данных
- 1GB файлового хранилища
- 50,000 активных пользователей в месяц
- Неограниченные API запросы
- Неограниченные таблицы

Для большинства случаев этого более чем достаточно.

## 🔒 Безопасность

### Row Level Security (RLS)

В миграции настроены политики RLS:
- **Public read access**: любой может читать проекты по slug
- **Public insert access**: любой может создавать проекты
- **Public update access**: любой может обновлять проекты
- **Public delete access**: любой может удалять проекты

### Анонимный ключ

`anon` ключ безопасен для использования на клиенте. Он не даёт доступа к административным функциям.

### Рекомендации

Для production рекомендуется:
1. Добавить аутентификацию пользователей
2. Ограничить доступ к редактированию/удалению только владельцам
3. Добавить rate limiting для предотвращения злоупотреблений

## 🐛 Решение проблем

### Ошибка: "relation projects does not exist"

**Причина:** Таблица не создана

**Решение:** Выполните SQL миграцию из Шага 4

### Ошибка: "Invalid API key"

**Причина:** Неправильный anon key

**Решение:** Проверьте, что скопировали полный ключ из Settings → API

### Ошибка: "CORS error"

**Причина:** Supabase блокирует запросы с вашего домена

**Решение:** 
1. Перейдите в Settings → API
2. Прокрутите до "CORS"
3. Добавьте ваш домен в список разрешённых

### Ссылки всё ещё длинные

**Причина:** Переменные окружения не настроены

**Решение:**
1. Проверьте файл `.env`
2. Убедитесь, что переменные начинаются с `VITE_`
3. Перезапустите dev-сервер
4. Проверьте консоль браузера (должно быть "Using Supabase for short links")

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте консоль браузера (F12)
2. Проверьте логи в Supabase (Logs → API)
3. Проверьте таблицу projects в Table Editor
4. Убедитесь, что переменные окружения настроены правильно

---

**Дата создания:** 2026-01-XX  
**Статус:** ✅ Готово к использованию
