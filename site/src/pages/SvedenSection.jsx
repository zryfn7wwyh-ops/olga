import { useParams } from 'react-router-dom';
import SvedenBlocks from '../components/SvedenBlocks.jsx';
import NotFound from './NotFound.jsx';
import { getSvedenSection } from '../data/sveden.js';
import { usePageMeta } from '../lib/usePageMeta.js';

export default function SvedenSection() {
  const { slug } = useParams();
  const section = getSvedenSection(slug);
  usePageMeta({ title: section?.title || 'Страница не найдена' });
  if (!section) return <NotFound embedded />;
  return <SvedenBlocks blocks={section.blocks} />;
}
