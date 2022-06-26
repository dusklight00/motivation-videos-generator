import "dotenv/config";
import { fetch } from "../utils";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;

interface Image {
  id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  promoted_at?: string | null;
  width?: number | null;
  height?: number | null;
  color?: string | null;
  blur_hash?: string | null;
  description?: string | null;
  alt_description?: string | null;
  urls?: {
    raw?: string | null;
    full?: string | null;
    regular?: string | null;
    small?: string | null;
    thumb?: string | null;
  } | null;
  links?: {
    self?: string | null;
    html?: string | null;
    download?: string | null;
    download_location?: string | null;
  } | null;
  categories?: string[] | null;
  likes?: number | null;
  liked_by_user?: boolean | null;
  current_user_collections?: string[] | null;
  sponsorship?: {
    impression_urls?: string[] | null;
    tagline?: string | null;
    sponsor?: {
      name?: string | null;
      url?: string | null;
      image?: string | null;
      text?: string | null;
    } | null;
  } | null;
  topic_submissions?: {
    health?: {
      status?: string | null;
      approved_on?: string | null;
    } | null;
    athletics?: {
      status?: string | null;
      approved_on?: string | null;
    } | null;
  } | null;
  user?: {
    id?: string | null;
    updated_at?: string | null;
    username?: string | null;
    name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    twitter_username?: string | null;
    portfolio_url?: string | null;
    bio?: string | null;
    location?: string | null;
    links?: {
      self?: string | null;
      html?: string | null;
      photos?: string | null;
      likes?: string | null;
      portfolio?: string | null;
      following?: string | null;
      followers?: string | null;
    } | null;
    profile_image?: {
      small?: string | null;
      medium?: string | null;
      large?: string | null;
    } | null;
    instagram_username?: string | null;
    total_collections?: number | null;
    total_likes?: number | null;
    total_photos?: number | null;
    accepted_tos?: boolean | null;
    for_hire?: boolean | null;
    social?: {
      instagram_username?: string | null;
      portfolio_url?: string | null;
      twitter_username?: string | null;
      paypal_email?: string | null;
    } | null;
    tags?: {
      type?: string | null;
      title?: string | null;
    };
  } | null;
}

interface SearchResult {
  total?: number;
  total_pages?: number;
  results?: Image[] | null;
}

export async function searchImage(
  query: string,
  page: number
): Promise<SearchResult> {
  const apiURL = new URL("https://api.unsplash.com/search/photos");
  apiURL.searchParams.append("page", page.toString());
  apiURL.searchParams.append("query", encodeURIComponent(query));
  apiURL.searchParams.append("client_id", ACCESS_KEY);
  const response = await fetch(apiURL.toString());
  const json = response.json();
  return json;
}

export async function getRandomImage(query: string): Promise<Image> {
  const apiURL = new URL("https://api.unsplash.com/photos/random");
  apiURL.searchParams.append("query", encodeURIComponent(query));
  apiURL.searchParams.append("client_id", ACCESS_KEY);
  const response = await fetch(apiURL.toString());
  const json = response.json();
  return json;
}

(async function () {
  const image = await getRandomImage("exercise background");
  console.log(image);
})();
