// documentPath is "owner/repo". HEAD resolves to the repo's default branch,
// so this works whether it's called main or master.
export async function fetchReadme(documentPath: string) {
  const repo = documentPath.replace(/^\/+|\/+$/g, "");
  const BASE_URL = `https://raw.githubusercontent.com/${repo}/HEAD/README.md`;

  const response = await fetch(BASE_URL, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch README file");
  }
  const text = await response.text();

  return text;
}
