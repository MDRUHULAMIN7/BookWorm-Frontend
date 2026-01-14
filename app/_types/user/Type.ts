export interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  genre: { _id: string; name: string };
  avgRating: number;
  shelvedCount: number;
  reason?: string;
}

export interface RecommendationData {
  recommendations: Book[];
  isPersonalized: boolean;
  booksRead: number;
}
