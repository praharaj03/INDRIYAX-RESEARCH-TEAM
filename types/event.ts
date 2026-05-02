export interface Event {
  id: string;
  slug: string;
  title: string;
  type: "past" | "upcoming";
  thumbnail: string;
  description: string;
  speaker: string;
  date: string;
  venue: string;
  summary?: string;
  recordingLink?: string;
}
