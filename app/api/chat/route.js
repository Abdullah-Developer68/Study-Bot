import { streamText } from "ai";

export async function POST(req) {
  // In here the req have to be parsed as express.json does not exist in here.
  const prompt = await req.json();
  const { textStream } = streamText({
    model: "google/gemini-3-flash",
    prompt,
  });

  for await (const textPart of textStream) {
    console.log(textPart);
  }
}
