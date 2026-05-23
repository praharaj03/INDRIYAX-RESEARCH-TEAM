// TODO: npm install zod
// import { z } from "zod";

// export const eventSchema = z.object({
//   title: z.string().min(3),
//   type: z.enum(["past", "upcoming"]),
//   date: z.string(),
//   venue: z.string().min(2),
//   speaker: z.string().min(2),
//   description: z.string().min(10),
//   thumbnail: z.string().url(),
// });

// export const newsSchema = z.object({
//   title: z.string().min(3),
//   description: z.string().min(10),
//   link: z.string().url(),
//   image: z.string().url(),
// });

// export type EventInput = z.infer<typeof eventSchema>;
// export type NewsInput = z.infer<typeof newsSchema>;

export {};
