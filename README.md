This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Laundry story episode

The episode lives at `/episodes/i-finally-did-my-laundry-29`. Its text and
metadata are in `content/episodes/i-finally-did-my-laundry-29.mdx`.

To enable its audio:

1. Add the recording as `public/audio/i-finally-did-my-laundry-29.mp3`.
2. Set `audioUrl: "/audio/i-finally-did-my-laundry-29.mp3"` in that MDX file.
3. Rebuild/redeploy the site. Until then, leave `audioUrl` empty to show the
   audio-pending message without playback controls or an invented duration.

The `story-practice` layout uses the existing practice prompts and recorder,
with ratings and the recording timer hidden. The expression exercise supports
pointer dragging (mouse/touch), or selecting a token and then a blank using
click/tap/Enter/Space. Escape cancels selection. Correct answers stay locked
until “Start again”.

The laundry episode's synchronized “Read along” cues are stored in
`content/transcripts/i-finally-did-my-laundry-29.json`. Sentence timings were
extracted locally from the supplied recording with faster-whisper (`base.en`),
then matched to the exact MDX text; `paragraph` preserves the six paragraphs.
If the recording is replaced or edited, update these timings too.

### Recording transcription

Practice prompt recordings have a **Transcribe** action. English speech is decoded and
resampled to mono 16 kHz in the browser, then transcribed in a Web Worker with
Transformers.js and Whisper tiny.en (quantized WASM). The first use downloads the
model from Hugging Face; audio is processed locally and is not uploaded. Subsequent
uses can reuse the browser's model cache. Keep the recording card open while it
runs; Cancel stops processing without deleting the take. Recordings over ten
minutes and silent recordings show a recoverable message.

The transcript is saved with the take and appended to the prompt's editable written
response without replacing existing writing. Review recognition errors before
**Download PDF**; the exporter uses this edited response. **Add to written response**
can restore a saved transcript. Recordings, transcripts and responses are stored
locally in this browser, subject to its storage limits. No API key is required.
