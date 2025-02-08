interface WordData {
  text: string;
  bbox: number[][];
}

interface PageData {
  page: number;
  content: WordData[];
}

export interface OCRData {
  text: PageData[];
}
