import "dotenv/config";
import { fetch } from "../utils";

const API_KEY = process.env.PIXABAY_API_KEY!;

interface searchVideosInterface {
  total?: number;
  totalHits?: number;
  hits?: {
    id?: number;
    pageURL?: string;
    type?: string;
    tags?: string;
    duration?: number;
    picture_id?: string;
    videos?: {
      large?: {
        url?: string;
        width?: number;
        height?: number;
        size?: number;
      };
      medium?: {
        url?: string;
        width?: number;
        height?: number;
        size?: number;
      };
      small?: {
        url?: string;
        width?: number;
        height?: number;
        size?: number;
      };
      tiny?: {
        url?: string;
        width?: number;
        height?: number;
        size?: number;
      };
    };
    views?: number;
    downloads?: number;
    likes?: number;
    comments?: number;
    user_id?: number;
    user?: string;
    userImageURL?: string;
  }[];
}

export async function searchVideos(
  query: string
): Promise<searchVideosInterface> {
  const url = `https://pixabay.com/api/videos/?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&pretty=true`;
  const response = await fetch(url);
  return response.json();
}

export async function searchHighQualityVideos(query: string) {
  const result = await searchVideos(query);
  let highQualityVideoCollection = Array();
  result?.hits?.forEach((hit: any) => {
    const videos = hit.videos;
    highQualityVideoCollection.push(videos?.large);
  });
  return highQualityVideoCollection;
}
