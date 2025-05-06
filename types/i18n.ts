export type Locale = 'en' | 'ja';
export type Messages = {
  title: string,
  slogan: string,
  links: Record<string, string>,
  home: {
    aboutUs: string;
  },
  forApplicantTab: Record<string, string>,
  accessTab: Record<string, string>,
  publicationTab: Record<string, string>,
  lectureTab: Record<string, string>,
  header: Record<string, string>,
  footer: Record<string, string>,
};