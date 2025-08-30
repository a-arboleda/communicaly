import { notFound } from "next/navigation"
import { getAllEpisodes, getEpisode } from "@/utils/episodes"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import AudioPlayer from "@/components/AudioPlayer"
import Details from "@/components/Details"
import EpisodeInteractive from "@/components/EpisodeInteractive"

export const dynamic = "force-static"
export const runtime = "nodejs"

export async function generateStaticParams() {
  return getAllEpisodes().map((e) => ({ slug: e.slug }))
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const ep = getEpisode(slug)
  if (!ep) return notFound()

  const { frontmatter, content } = ep

  return (
    <article className="prose max-w-none">
      <p className="tag">Episode</p>
      <h1 className="font-serif">{frontmatter.title}</h1>
      <p className="text-sm text-gray-600">
        <time dateTime={new Date(frontmatter.date).toISOString()}>
          {new Date(frontmatter.date).toLocaleDateString()}
        </time>
      </p>

      <AudioPlayer src={frontmatter.audioUrl} />

      <div className="mt-6">
        <MDXRemote source={content} components={{ Details }} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>

      <EpisodeInteractive episodeId={slug} audioTitle={frontmatter.title} />
    </article>
  )
}
