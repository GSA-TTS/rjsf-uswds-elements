import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@uswds/uswds/css/uswds.min.css';
import 'rjsf-uswds/styles.css';
import './styles.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
