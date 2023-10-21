export interface ICourse {
  id: string;
  title: string;
  synopsis: string;
  takeaways: string[];
  imageURL: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
}
