import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const videoPath = path.join(
    process.cwd(),
    "public",
    "videos",
    "hamilton-aviator-mobile-walkthrough.mp4",
  );

  // Check if the video file exists
  try {
    await fs.promises.access(videoPath, fs.constants.F_OK);
  } catch {
    return new NextResponse("Video not found.", { status: 404 });
  }

  // Get video stats to determine its size
  const videoStat = await fs.promises.stat(videoPath);
  const videoSize = videoStat.size;

  // Get the range header from the request
  const range = request.headers.get("range");

  // If initial request, serve a smaller portion of the video to start
  if (!range) {
    const headers = new Headers();
    headers.set("Content-Length", videoSize.toString());
    headers.set("Content-Type", "video/mp4");

    const videoStream = fs.createReadStream(videoPath);
    return new NextResponse(videoStream as any, { status: 200, headers });
  }

  // Parse the range header
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Calculate the length of the content chunk
  const contentLength = end - start + 1;

  // Set the response headers for a partial content response
  const headers = new Headers();
  headers.set("Content-Range", `bytes ${start}-${end}/${videoSize}`);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Length", contentLength.toString());
  headers.set("Content-Type", "video/mp4");

  // Create a read stream for the specified chunk of the video
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Return the stream with a 206 Partial Content status
  return new NextResponse(videoStream as any, { status: 206, headers });
}
