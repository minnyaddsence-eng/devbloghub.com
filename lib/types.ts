export type ToolFaq = { q: string; a: string };

export type ToolDef = {
  name: string;
  slug: string;
  description: string;
  category: string;
  keywords: string[];
  faq: ToolFaq[];
  seoSlugs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  relatedToolSlugs: string[];
  sections: { heading: string; body: string }[];
};
