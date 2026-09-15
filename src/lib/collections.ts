import { readFile } from "node:fs/promises";
import path from "node:path";
import type { MemberRecord } from "@/lib/members";
import type { NewsRecord } from "@/lib/news";

/** 读取本地 JSON 内容索引的内部通用函数。 */
async function readCollectionIndex<T>(collection: "members" | "news"): Promise<T[]> {
  try {
    const content = await readFile(path.join(process.cwd(), "public", collection, "index.json"), "utf8");
    const index = JSON.parse(content) as unknown;
    return Array.isArray(index) ? (index as T[]) : [];
  } catch {
    return [];
  }
}

/** 读取往届成员索引。 */
export function getMembers(): Promise<MemberRecord[]> {
  return readCollectionIndex<MemberRecord>("members");
}

/** 读取团队动态索引。 */
export function getNews(): Promise<NewsRecord[]> {
  return readCollectionIndex<NewsRecord>("news");
}
