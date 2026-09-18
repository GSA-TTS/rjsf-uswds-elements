import { useState } from 'react';
import PlaygroundView from './components/PlaygroundView';
import ComponentGallery from './components/ComponentGallery';
import ShadowDomA11ySpike from './components/ShadowDomA11ySpike';

type View = 'playground' | 'gallery' | 'shadow-dom-spike';

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
          <button
            type="button"
            className="wb-header__tab"
            aria-pressed={view === 'shadow-dom-spike'}
            onClick={() => setView('shadow-dom-spike')}
          >
            Shadow DOM a11y spike
          </button>
        </nav>
      </header>
      <main className="wb-main">
        {view === 'playground' ? <PlaygroundView /> : null}
        {view === 'gallery' ? <ComponentGallery /> : null}
        {view === 'shadow-dom-spike' ? <ShadowDomA11ySpike /> : null}
      </main>
    </div>
  );
}
