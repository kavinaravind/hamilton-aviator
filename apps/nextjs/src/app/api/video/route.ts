import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const filePath = join(
      process.cwd(),
      "public",
      "videos",
      "hamilton-aviator-mobile-walkthrough.mp4",
    );
    const { size } = await stat(filePath);
    const stream = createReadStream(filePath);
    return new Response(stream as any, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": size.toString(),
      },
    });
  } catch (err) {
    return new Response("File not found", { status: 404 });
  }
}
