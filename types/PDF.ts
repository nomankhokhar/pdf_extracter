type WordData = {
  text: string;
  bbox: [number, number, number, number];
};

type PageData = {
  page: number;
  words: WordData[];
};

export type PDFData = {
  text: PageData[];
};
