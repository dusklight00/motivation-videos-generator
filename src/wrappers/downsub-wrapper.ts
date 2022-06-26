import puppeteer from "puppeteer";
import { downloadFileStream } from "../utils";

interface subtitleData {
  url: string;
  requestHeader: any;
  requestPostData: any;
  responseHeader: any;
  responeSize: number;
  responseBody: {
    state: number;
    title: string;
    thumbnail: string;
    duration: string;
    subtitles: {
      url: string;
    }[];
    playlist: object[];
    source: string;
    sourceName: string;
    playlistId: null;
    urlSubtitle: string;
  };
}

function scrapeDownsubApiSubtitleData(url: string): Promise<subtitleData> {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.setDefaultNavigationTimeout(0);

    let pausedRequests = Array();
    let paused = false;

    let capturedSubtitlesNetworkData = Object();
    let isSubtitlesCaptured = false;

    const nextRequest = () => {
      if (pausedRequests.length > 0) {
        const request = pausedRequests.shift();
        request.continue();
      } else {
        paused = false;
      }
    };

    page.on("request", (request) => {
      if (!paused) {
        paused = true;
        request.continue();
      } else {
        pausedRequests.push(request);
      }
    });

    page.on("requestfinished", async (request) => {
      const request_url = request.url();
      if (request_url.includes("get-info.downsub.com")) {
        const response = request.response();
        const responseHeader = response?.headers();
        const responseBody =
          request.redirectChain().length === 0 ? await response?.json() : null;

        const info = {
          url: request.url(),
          requestHeader: request.headers(),
          requestPostData: request.postData(),
          responseHeader: responseHeader,
          responeSize: responseHeader ? responseHeader["content-length"] : 0,
          responseBody,
        };

        page.close();
        browser.close();
        capturedSubtitlesNetworkData = info;
        isSubtitlesCaptured = true;
      }
      nextRequest();
    });

    page.on("requestfailed", (request) => {
      nextRequest();
    });

    await page.goto(url, { waitUntil: "networkidle0" }).catch((e) => void e);
    if (isSubtitlesCaptured) {
      resolve(capturedSubtitlesNetworkData);
    } else {
      reject(Error("Failed to get subtitles"));
    }
  });
}

function generateDownsubDownloadPageUrl(youtubeLink: string) {
  const downsubBaseUrl = "https://downsub.com/";
  const youtubeLinkUrlEncoded = encodeURIComponent(youtubeLink);
  return `${downsubBaseUrl}/?url=${youtubeLinkUrlEncoded}`;
}

async function getYoutubeSubtitleDownloadLink(youtubeLink: string) {
  const subtitleDownloadLink = generateDownsubDownloadPageUrl(youtubeLink);
  const subtitleData = await scrapeDownsubApiSubtitleData(subtitleDownloadLink);
  const title = subtitleData.responseBody.title;
  const subtitlesUrl = subtitleData.responseBody.subtitles[0]?.url;
  const baseUrl = "https://subtitle.downsub.com/";
  const downloadLink =
    baseUrl +
    "?title=" +
    encodeURIComponent(title) +
    "&url=" +
    encodeURIComponent(subtitlesUrl);
  return downloadLink;
}

export async function downloadYoutubeSubtitle(
  youtubeLink: string,
  output: string
) {
  const downloadLink = await getYoutubeSubtitleDownloadLink(youtubeLink);
  await downloadFileStream(downloadLink, output);
}
