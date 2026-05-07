// TODO (Backend Dev): Implement News Mongoose model
//
// Fields:
//   title       - Article headline
//   description - Short summary shown on the card
//   link        - External URL to the full article
//   image       - Cover image URL (from Unsplash or /uploads/ via admin upload)
//   isActive    - false = hidden from public listing (optional, add if needed)
//   createdAt   - Auto timestamp
//
// import { Schema, model, models } from "mongoose";
//
// const NewsSchema = new Schema(
//   {
//     title:       { type: String, required: true },
//     description: { type: String, required: true },
//     link:        { type: String, required: true },
//     image:       { type: String, required: true },
//   },
//   { timestamps: true }
// );
//
// export const NewsModel = models.News || model("News", NewsSchema);

export {};
