export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  conference?: string;
  doi?: string;
  abstract?: string;
}

export interface Member {
  id: string;
  name: string;
  position: string;
  email: string;
  imageUrl?: string;
  research: string[];
}