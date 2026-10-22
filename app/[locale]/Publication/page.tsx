import { loadPublicationYears } from '@/lib/content/publications';
import PublicationClient from './PublicationClient';

const PublicationPAGE = () => {
  return <PublicationClient years={loadPublicationYears()} />;
};

export default PublicationPAGE;
