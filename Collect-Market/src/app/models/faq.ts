export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  link?: boolean;
}

export interface Category {
  name: string;
  count: number;
}