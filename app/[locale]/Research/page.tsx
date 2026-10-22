import { loadResearchTopics } from '@/lib/content/research';
import ResearchClient from './ResearchClient';

const ResearchPAGE = () => {
  return <ResearchClient topics={loadResearchTopics()} />;
};

export default ResearchPAGE;
