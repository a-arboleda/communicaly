import fs from "fs";
import path from "path";
import matter from "gray-matter";

const EP_DIR = path.join(process.cwd(), "content/episodes");

export type EpisodeMeta = {
  title: string;
  date: string;
  audioUrl?: string;
  tags?: string[];
  excerpt?: string;
};

export function getAllEpisodes() {
  if (!fs.existsSync(EP_DIR)) return [] as any[];
  const files = fs.readdirSync(EP_DIR).filter((f) => f.endsWith(".mdx"));
  const items = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(EP_DIR, filename), "utf8");
    const { data } = matter(raw);
    return { slug, ...(data as EpisodeMeta) };
  });
  return items.sort(
    (a: any, b: any) =>
      new Date(b.date).valueOf() - new Date(a.date).valueOf()
  );
}

export function getEpisode(slug: string) {
  const full = path.join(EP_DIR, slug + ".mdx");
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as EpisodeMeta, content };
}
