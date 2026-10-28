-- Создаём таблицу для проектов
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  data JSONB NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создаём индекс для быстрого поиска по slug
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Создаём функцию для обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Создаём триггер для автоматического обновления updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Разрешаем публичный доступ на чтение (для получения проектов по slug)
-- Это безопасно, так как данные проектов не содержат чувствительной информации
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON projects
  FOR SELECT
  USING (true);

-- Разрешаем публичную вставку (для создания новых проектов)
CREATE POLICY "Public insert access" ON projects
  FOR INSERT
  WITH CHECK (true);

-- Разрешаем публичное обновление (для обновления проектов)
CREATE POLICY "Public update access" ON projects
  FOR UPDATE
  USING (true);

-- Разрешаем публичное удаление (для удаления проектов)
CREATE POLICY "Public delete access" ON projects
  FOR DELETE
  USING (true);
