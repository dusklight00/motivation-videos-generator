import youtubedl from "youtube-dl-exec";
import { downloadFileStream } from "../utils";

async function getHighestQualityYoutubeDownloadLink(youtubeLink: string) {
  const youtubedlOutput = await youtubedl(youtubeLink, {
    dumpSingleJson: true,
    noWarnings: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
    referer: youtubeLink,
  });
  const format = youtubedlOutput.formats
    .filter((f) => f.ext === "mp4")
    .sort((a, b) => parseInt(a.format_note) - parseInt(b.format_note));
  const highestFormat = format.length > 0 ? format.at(-1) : null;
  return highestFormat?.url;
}

async function downloadYoutubeVideo(youtubeLink: string, output: string) {
  const downloadLink = await getHighestQualityYoutubeDownloadLink(youtubeLink);
  if (!downloadLink) throw Error("No download link found");
  await downloadFileStream(downloadLink, output);
}

export default downloadYoutubeVideo;
