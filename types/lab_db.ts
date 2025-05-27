export interface Article { // Publication
  id: string;
  title: string;
  author: string[];
  year: number;
  meeting?: string;
  abstract?: string;
  magazine?: string;
  identifier: string;
  volume?: string;
  number?: string;
  page: string;
  date: string;
}

// export interface Member {
//   id: string;
//   name: string;
//   position: string;
//   email: string;
//   imageUrl?: string;
//   research: string[];
// }
