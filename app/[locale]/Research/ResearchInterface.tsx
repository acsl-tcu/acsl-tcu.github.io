export interface Figure {
  src: string;
  caption: string;
};

export interface MediaData {
  name: string;
  type: string;
  role: string;
  title: string;
  abstract: string;
  figures: Figure[];
};

export interface CardProps {
  items: MediaData[];
  set: (items: MediaData[]) => void;
}

export interface DatabaseFigure {
  path: string;
  caption: string;
  jcaption: string;
};