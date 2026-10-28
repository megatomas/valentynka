# Отладка проблемы с вечной загрузкой

## 🔍 Добавленные отладочные логи

Для диагностики проблемы с вечной загрузкой добавлены подробные логи в консоль браузера.

### Как использовать:

1. Откройте страницу с приглашением
2. Нажмите F12 для открытия консоли браузера
3. Перейдите на вкладку "Console"
4. Обновите страницу (Ctrl+F5)
5. Изучите логи

### Что искать в консоли:

#### Успешная загрузка:
```
Loading project with slug: eyJpZCI6IjEyMyIsInRpdGxlIjoiVmFsZW50...
Decoding project, encoded length: 1234
Decoded JSON length: 5678
Parsed data: {id: "123", title: "Валентинка", scenesCount: 3}
Project restored successfully
Loaded project: {id: "123", title: "Валентинка", scenesCount: 3}
```

#### Ошибка декодирования:
```
Loading project with slug: invalid_slug...
Error decoding project: Error: ...
Encoded string (first 100 chars): invalid_slug...
Project is null or has no scenes
```

#### Переход между сценами:
```
goNext: moving from scene 0 to 1
goNext: moving from scene 1 to 2
goNext: already on last scene 2 of 3
```

## 🛠 Исправления

### 1. Защита от некорректного индекса сцены
Добавлен `useEffect`, который сбрасывает `currentSceneIdx` в 0, если он выходит за пределы массива сцен:

```typescript
useEffect(() => {
  if (project && currentSceneIdx >= project.scenes.length) {
    setCurrentSceneIdx(0);
  }
}, [project, currentSceneIdx]);
```

### 2. Улучшенная проверка загрузки
Теперь `loading` устанавливается в `false` сразу после загрузки проекта или ошибки:

```typescript
if (loadedProject && loadedProject.scenes && loadedProject.scenes.length > 0) {
  setProject(loadedProject);
  setNotFound(false);
  setLoading(false);  // ← Явно устанавливаем false
} else {
  setNotFound(true);
  setLoading(false);  // ← Явно устанавливаем false
}
```

### 3. Защита от выхода за пределы массива
В функциях `goNext` и `handleAnswer` добавлены проверки:

```typescript
if (nextIdx >= project.scenes.length) {
  console.warn('Attempted to go beyond last scene, staying on current');
  return prev;
}
```

### 4. Улучшенное сообщение об ошибке
Вместо "Загрузка..." теперь показывается понятное сообщение:

```typescript
if (!project || !currentScene) {
  return (
    <div>
      <h1>Ошибка загрузки</h1>
      <p>Не удалось загрузить приглашение. Возможно, ссылка повреждена.</p>
    </div>
  );
}
```

## 📊 Возможные причины проблемы

### 1. Ошибка декодирования
**Симптом:** В консоли появляется "Error decoding project"

**Причина:** Ссылка повреждена или содержит некорректные данные

**Решение:** 
- Создайте новое приглашение
- Опубликуйте его заново
- Скопируйте новую ссылку

### 2. Проект не содержит сцен
**Симптом:** В консоли появляется "Project is null or has no scenes"

**Причина:** Проект был создан без сцен или сцены были удалены

**Решение:**
- Откройте редактор
- Добавьте хотя бы одну сцену
- Опубликуйте заново

### 3. Выход за пределы массива сцен
**Симптом:** В консоли появляется "Attempted to go beyond last scene"

**Причина:** Попытка перейти на несуществующую сцену

**Решение:** Исправлено автоматически (защита от выхода за пределы)

### 4. Проблема с React state
**Симптом:** `loading` остаётся `true` навсегда

**Причина:** Ошибка в логике обновления состояния

**Решение:** Исправлено (явная установка `loading = false`)

## 🧪 Тестирование

### Шаг 1: Проверьте консоль
1. Откройте страницу с приглашением
2. Нажмите F12
3. Перейдите на вкладку "Console"
4. Скопируйте все логи

### Шаг 2: Проверьте Network
1. Откройте вкладку "Network"
2. Обновите страницу
3. Проверьте, что нет ошибок загрузки

### Шаг 3: Проверьте localStorage
1. Откройте вкладку "Application" (Chrome) или "Storage" (Firefox)
2. Перейдите в "Local Storage"
3. Найдите ключ "loveletter_projects"
4. Проверьте, что проект существует

### Шаг 4: Проверьте URL
1. Скопируйте полный URL
2. Проверьте, что он не обрезан
3. Проверьте, что нет лишних символов

## 📝 Примеры логов

### Успешная загрузка валентинки:
```
Loading project with slug: eyJpZCI6IjEyMyIsInRpdGxlIjoi0JTRg9C60L7QstCw0L3QvtCZ...
Decoding project, encoded length: 2345
Decoded JSON length: 4567
Parsed data: {id: "123", title: "Валентинка", scenesCount: 3}
Project restored successfully
Loaded project: {id: "123", title: "Валентинка", scenesCount: 3}
```

### Переход между сценами:
```
goNext: moving from scene 0 to 1
goNext: moving from scene 1 to 2
goNext: already on last scene 2 of 3
```

### Ошибка декодирования:
```
Loading project with slug: invalid...
Error decoding project: SyntaxError: Unexpected token...
Encoded string (first 100 chars): invalid...
Project is null or has no scenes
```

## 🚨 Если проблема сохраняется

### 1. Очистите кэш браузера
```
Chrome: Ctrl+Shift+Delete → Очистить кэш
Firefox: Ctrl+Shift+Delete → Кэш
Safari: Cmd+Option+E → Очистить кэш
```

### 2. Попробуйте другой браузер
- Chrome
- Firefox
- Safari
- Edge

### 3. Проверьте на мобильном устройстве
- Откройте ссылку на телефоне
- Проверьте консоль через Chrome DevTools (USB debugging)

### 4. Создайте новое приглашение
- Удалите старое приглашение
- Создайте новое из шаблона
- Опубликуйте заново
- Скопируйте новую ссылку

### 5. Отправьте логи разработчику
Скопируйте все логи из консоли и отправьте разработчику для анализа.

## 📞 Контакты для поддержки

Если проблема не решена, отправьте:
1. Скриншот консоли браузера (F12 → Console)
2. Полный URL приглашения
3. Описание шагов, которые привели к ошибке
4. Информацию о браузере и устройстве

---

**Дата обновления:** 2026-01-XX  
**Статус:** ✅ Добавлены отладочные логи и исправления
