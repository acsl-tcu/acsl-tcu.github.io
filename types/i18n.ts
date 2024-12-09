export type Locale = 'en' | 'ja';
export type Messages = {
  title: string,
  slogan: string,
  hello: {
    title: string;
    greeting: (name: string) => string;
    aboutUs: string;
  },
  forApplicantTab: {
    title: string;
    text: string;
  },
  accessTab: {
    setagayaCampus: string;
    yokohamaCampus: string;
    addressStr: string;
    sec_address: string;
    sec_toSetagayaCampus: string;
    sec_toYokohamaCampus: string;
  },
  lectureTab: {
    sec_bachelor: string;
    sec_graduate: string;
  },
  header: {
    tcu: string;
    faculty: string;
    department: string;
  }
  footer: {
    copyright: string;
  }
};