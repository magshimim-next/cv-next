namespace Categories {
  export const values = [
    "general",
    "medical",
    "insurance",
    "financial",
    "legal",
    "education",
    "fullstack",
    "frontend",
    "backend",
    "devops",
    "cybersecurity",
    "freelance",
  ] as const;

  export type Value = (typeof values)[number];
}

export default Categories;
