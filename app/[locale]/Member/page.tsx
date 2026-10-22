import { loadPublishedMemberYears } from '@/lib/content/members';
import MemberClient from './MemberClient';

const MemberPAGE = () => {
  return <MemberClient years={loadPublishedMemberYears()} />;
};

export default MemberPAGE;
