// TODO: Implement with SWR or React Query
// import useSWR from "swr";
// import type { Event } from "@/types/event";
// import type { News } from "@/types/news";

// const fetcher = (url: string) => fetch(url).then((r) => r.json());

// export function useEvents() {
//   const { data, error, isLoading } = useSWR<Event[]>("/api/events", fetcher);
//   return { events: data ?? [], error, isLoading };
// }

// export function useNews() {
//   const { data, error, isLoading } = useSWR<News[]>("/api/news", fetcher);
//   return { news: data ?? [], error, isLoading };
// }

export {};
