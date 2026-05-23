export interface Event {
  id: string;
  slug: string;
  title: string;
  type: "OFFLINE" | "ONLINE" | "HYBRID";
  thumbnail: string;
  description: string;
  speaker: string;
  date: string;
  venue: string;
  price: number;
  restricted?: boolean;
  isActive?: boolean;
  summary?: string;
  recordingLink?: string;
  paymentQrUrl?: string;
  meetingLink?: string;
}
