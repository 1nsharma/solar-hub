import { ChatOllama } from "@langchain/ollama";
import { promises as fs } from "node:fs";
import path from "node:path";

const workspace = process.env.SOLARHUB_WORKSPACE ?? "/workspace";
const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const model = process.env.OLLAMA_MODEL ?? "qwen2.5-coder:7b";

const ignored = new Set([".git", "node_modules", "dist", "build", ".next", "coverage"]);
const allowed = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".yml", ".yaml", ".css", ".html"]);

async function collectFiles(dir: string, out: string[] = []): Promise<string[]> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collectFiles(full, out);
    else if (allowed.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function buildContext(files: string[]): Promise<string> {
  const chunks: string[] = [];
  for (const file of files.slice(0, 120)) {
    const text = await fs.readFile(file, "utf8");
    chunks.push(`FILE: ${path.relative(workspace, file)}\n${text.slice(0, 12000)}`);
  }
  return chunks.join("\n\n---\n\n").slice(0, 120000);
}

async function main() {
  const files = await collectFiles(workspace);
  const context = await buildContext(files);
  console.log(JSON.stringify({ workspace, fileCount: files.length, model, ollamaBaseUrl }, null, 2));

  const llm = new ChatOllama({ baseUrl: ollamaBaseUrl, model, temperature: 0 });
  const prompt = `You are SolarHub's Engineering Agent running inside an isolated read-only sandbox.\n\nAnalyze this repository snapshot. Do not invent files or behavior. Return JSON with: architecture_summary, likely_risks, build_test_plan, top_priorities. Keep each priority actionable.\n\n${context}`;

  try {
    const response = await llm.invoke(prompt);
    console.log("ENGINEERING_ANALYSIS");
    console.log(typeof response.content === "string" ? response.content : JSON.stringify(response.content));
  } catch (error) {
    console.error("OLLAMA_UNAVAILABLE", error instanceof Error ? error.message : String(error));
    console.log(JSON.stringify({ status: "scan_only", reason: "Local Ollama model unavailable" }));
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
