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
    setagayaCampusAddressStr: string;
    yokohamaCampusAddressStr: string;
    sec_address: string;
    sec_toSetagayaCampus: string;
    sec_toYokohamaCampus: string;
    link: string;
  },
  publicationTab: {
    journal: string;
    international: string;
    domestic: string;
  }
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