import type { News } from "@/types/news";
import { news } from "@/lib/data/index";

// TODO (Backend Dev): Replace with real DB calls
// import { connectDB } from "@/config/db";
// import { NewsModel } from "@/lib/models/News";

export async function getNews(): Promise<News[]> {
  return news;
}
