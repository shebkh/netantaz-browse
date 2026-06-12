import CreativesGallery from './components/CreativesGallery';

// App is now a thin wrapper; CreativesGallery owns all state and the layout
// shell (Slice 2). Default export stays `App` (main.tsx renders it).
export default function App() {
  return <CreativesGallery />;
}
