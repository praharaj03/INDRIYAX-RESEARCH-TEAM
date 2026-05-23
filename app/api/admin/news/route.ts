import { NextRequest, NextResponse } from "next/server";

// TODO (Backend Dev): Wire to MongoDB NewsModel
//
// GET  /api/admin/news
//   - Return all news articles (including hidden ones for admin view)
//   - Sort by createdAt descending
//   - Response: News[]
//
// POST /api/admin/news
//   - Create a new news article
//   - Body: { title, description, link, image }
//   - Validate all fields are present
//   - Return the created document
//
// import { connectDB } from "@/config/db";
// import { NewsModel } from "@/lib/models/News";

export async function GET() {
  // await connectDB();
  // const news = await NewsModel.find().sort({ createdAt: -1 });
  // return NextResponse.json(news);
  return NextResponse.json({ message: "TODO (Backend Dev): implement GET /api/admin/news" }, { status: 501 });
}

export async function POST(req: NextRequest) {
  // await connectDB();
  // const body = await req.json();
  // const { title, description, link, image } = body;
  // if (!title || !description || !link || !image) {
  //   return NextResponse.json({ error: "All fields required" }, { status: 400 });
  // }
  // const news = await NewsModel.create({ title, description, link, image });
  // return NextResponse.json(news, { status: 201 });
  return NextResponse.json({ message: "TODO (Backend Dev): implement POST /api/admin/news" }, { status: 501 });
}
