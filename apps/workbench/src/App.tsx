import { useState } from 'react';
import PlaygroundView from './components/PlaygroundView';
import ComponentGallery from './components/ComponentGallery';

type View = 'playground' | 'gallery';

export default function App() {
  const [view, setView] = useState<View>('playground');

  return (
    <div className="wb-app">
      <header className="wb-header">
        <h1 className="wb-header__title">RJSF + USWDS Theme Workbench</h1>
        <nav className="wb-header__nav" aria-label="Workbench views">
          <button
            type="button"
            className="wb-header__tab"
            aria-pressed={view === 'playground'}
            onClick={() => setView('playground')}
          >
            Playground
          </button>
          <button
            type="button"
            className="wb-header__tab"
            aria-pressed={view === 'gallery'}
            onClick={() => setView('gallery')}
          >
            Component gallery
          </button>
        </nav>
      </header>
      <main className="wb-main">
        {view === 'playground' ? <PlaygroundView /> : <ComponentGallery />}
      </main>
    </div>
  );
}
