import { join, relative, parse } from "path";
import { readdir, copyFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";

const args = process.argv.slice(2);
const targetDir =
  args.find((arg) => arg.startsWith("--target="))?.split("=")[1] || ".";
const distDir =
  args.find((arg) => arg.startsWith("--dist="))?.split("=")[1] || "flattened";

function wildcardToRegExp(wildcard: string): RegExp {
  return new RegExp(
    "^" + wildcard.split("*").map(escapeRegExp).join(".*") + "$",
  );
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function readIgnoreFile(path: string): Promise<RegExp[]> {
  try {
    const content = await readFile(path, "utf-8");
    return content
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"))
      .map(wildcardToRegExp);
  } catch (error) {
    console.log("No .flatterignore file found or unable to read it.", error);
    return [];
  }
}

function shouldIgnore(path: string, ignorePatterns: RegExp[]): boolean {
  return ignorePatterns.some((pattern) => pattern.test(path));
}

async function flattenDirectory(
  sourceDir: string,
  baseDir: string,
  ignorePatterns: RegExp[],
) {
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry.name);
    const relPath = relative(baseDir, sourcePath);

    if (shouldIgnore(relPath, ignorePatterns)) {
      console.log(`Ignored: ${sourcePath}`);
      continue;
    }

    if (entry.isDirectory()) {
      await flattenDirectory(sourcePath, baseDir, ignorePatterns);
    } else {
      const flattenedName = relPath.replace(/[\\/]/g, ":");
      const destPath = join(distDir, flattenedName);
      await copyFile(sourcePath, destPath);
      console.log(`Copied: ${sourcePath} -> ${destPath}`);
    }
  }
}

if (!existsSync(targetDir)) {
  console.error(`Target directory does not exist: ${targetDir}`);
  process.exit(1);
}

if (!existsSync(distDir)) {
  await mkdir(distDir, { recursive: true });
}

const absoluteTargetDir = join(process.cwd(), targetDir);
const baseDir = join(process.cwd(), parse(targetDir).dir);
const ignorePatterns = await readIgnoreFile(
  join(process.cwd(), ".flatterignore"),
);

await flattenDirectory(absoluteTargetDir, baseDir, ignorePatterns);
console.log("Flattening complete!");
