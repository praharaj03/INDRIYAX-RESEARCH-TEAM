import { NextRequest, NextResponse } from "next/server";

// TODO (Backend Dev): Wire to MongoDB NewsModel
//
// GET    /api/admin/news/:id  — fetch single article by _id
// PATCH  /api/admin/news/:id  — update fields (title, description, link, image)
// DELETE /api/admin/news/:id  — permanently delete the article
//
// import { connectDB } from "@/config/db";
// import { NewsModel } from "@/lib/models/News";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  // await connectDB();
  // const news = await NewsModel.findById(params.id);
  // if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // return NextResponse.json(news);
  return NextResponse.json({ message: "TODO (Backend Dev): implement GET /api/admin/news/:id" }, { status: 501 });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // await connectDB();
  // const body = await req.json();
  // const news = await NewsModel.findByIdAndUpdate(params.id, body, { new: true });
  // if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // return NextResponse.json(news);
  return NextResponse.json({ message: "TODO (Backend Dev): implement PATCH /api/admin/news/:id" }, { status: 501 });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  // await connectDB();
  // await NewsModel.findByIdAndDelete(params.id);
  // return NextResponse.json({ success: true });
  return NextResponse.json({ message: "TODO (Backend Dev): implement DELETE /api/admin/news/:id" }, { status: 501 });
}
