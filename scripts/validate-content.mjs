import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

const Project = z.object({
  id: z.number().int().nonnegative(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  language: z.string().optional(),
  stars: z.number().int().nonnegative().default(0),
  repoUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  readme: z.string().optional()
});
const Projects = z.array(Project);

const BlogPost = z.object({
  id: z.number().int().nonnegative(),
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().refine(v => !Number.isNaN(Date.parse(v)), 'Invalid date'),
  tags: z.array(z.string()).default([]),
  summary: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  published: z.boolean().optional()
});
const Blog = z.array(BlogPost);

function loadJson(path) {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8'));
}

function run() {
  try {
    const projects = loadJson('data/projects.json');
    const blog = loadJson('data/blog.json');

    const pr = Projects.safeParse(projects);
    if (!pr.success) {
      console.error('projects.json invalid:', pr.error.format());
      process.exit(1);
    }

    const br = Blog.safeParse(blog);
    if (!br.success) {
      console.error('blog.json invalid:', br.error.format());
      process.exit(1);
    }

    console.log('Content OK:', { projects: projects.length, blog: blog.length });
  } catch (e) {
    console.error('Failed to validate content:', e);
    process.exit(1);
  }
}

run();