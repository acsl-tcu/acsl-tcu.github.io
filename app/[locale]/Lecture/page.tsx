import { loadLectureYears } from '@/lib/content/lectures';
import LectureClient from './LectureClient';

const LecturePAGE = () => {
  return <LectureClient years={loadLectureYears()} />;
};

export default LecturePAGE;
