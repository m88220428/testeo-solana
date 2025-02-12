import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure styles are loaded before rendering
const renderApp = () => {
  const root = document.getElementById("root")!;
  createRoot(root).render(<App />);
};

// Check if the document is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}