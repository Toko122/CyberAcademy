export interface ICourse {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  category: "პროგრამირება" | "დიზაინი" | "მარკეტინგი" | "IT სპეციალისტი";
  created_at: string;
}