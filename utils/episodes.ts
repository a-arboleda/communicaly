import fs from "fs";
import path from "path";
import matter from "gray-matter";

const EP_DIR = path.join(process.cwd(), "content/episodes");

export type EpisodeMeta = {
  title: string;
  date: string;
  audioUrl?: string;
  youtubeStart?: number;
  youtubeEnd?: number;
  tags?: string[];
  excerpt?: string;
  question?: string;
  imageUrl?: string;
  imageAlt?: string;
  story?: string[];
  keyDetails?: string[];
  tryThis?: string[];
  practiceActivity?: {
    tutor?: string[];
    student?: string[];
  };
  practiceQuiz?: Array<{
    prompt: string;
    expected?: string;
    function?: string;
  }>;
};

export type EpisodeSummary = EpisodeMeta & { slug: string };

export function getAllEpisodes(): EpisodeSummary[] {
  if (!fs.existsSync(EP_DIR)) return [];
  const files = fs.readdirSync(EP_DIR).filter((f) => f.endsWith(".mdx"));
  const items: EpisodeSummary[] = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(EP_DIR, filename), "utf8");
    const { data } = matter(raw);
    const meta = data as EpisodeMeta;
    return { slug, ...meta };
  });
  return items.sort(
    (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
  );
}

export function getEpisode(slug: string) {
  const full = path.join(EP_DIR, slug + ".mdx");
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as EpisodeMeta, content };
}
