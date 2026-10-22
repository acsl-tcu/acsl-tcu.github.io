import { loadLatestPublications } from '@/lib/content/publications';
import HomeClient from './HomeClient';

const HomePAGE = () => {
  return <HomeClient news={loadLatestPublications(20)} />;
};

export default HomePAGE;
