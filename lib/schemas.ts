import { z } from 'zod';

export const Project = z.object({
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
export const Projects = z.array(Project);

export const BlogPost = z.object({
  id: z.number().int().nonnegative(),
  title: z.string().min(1),
  slug: z.string().min(1),
  date: z.string().refine(v => !Number.isNaN(Date.parse(v)), 'Invalid date'),
  tags: z.array(z.string()).default([]),
  summary: z.string().optional(),
  bodyMarkdown: z.string().optional(),
  published: z.boolean().optional()
});
export const Blog = z.array(BlogPost);

export type TProject = z.infer<typeof Project>;
export type TBlogPost = z.infer<typeof BlogPost>;