import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { EditorPage } from './pages/EditorPage';
import { DashboardPage } from './pages/DashboardPage';
import { PublishedPage } from './pages/PublishedPage';
import { TestPage } from './pages/TestPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/editor/:projectId" element={<EditorPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/p/:slug" element={<PublishedPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
