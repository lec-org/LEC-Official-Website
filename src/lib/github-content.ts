import { Octokit } from "octokit";

/** Contents API 写回所需的仅服务端仓库配置。 */
type GitHubRepositoryConfig = { token: string; owner: string; repo: string; branch: string };

/** 往届成员集合在仓库中的路径。 */
export const MEMBER_INDEX_PATH = "public/members/index.json";
/** 团队动态集合在仓库中的路径。 */
export const NEWS_INDEX_PATH = "public/news/index.json";

/** 表示远端文件在读取与写入之间已被其他提交更新。 */
export class ContentConflictError extends Error {
  constructor() { super("内容已被其他人修改，请刷新后重试"); }
}

/** 从仓库读取集合 JSON，返回数组内容与其 blob sha（作为提交时的乐观锁）。 */
export async function readRepoJson<T>(path: string): Promise<{ value: T[]; sha: string }> {
  const { octokit, repository, branch } = createClient();
  const response = await octokit.rest.repos.getContent({ ...repository, path, ref: branch });
  const data = response.data;
  if (Array.isArray(data) || data.type !== "file" || !("content" in data)) throw new Error(`仓库文件 ${path} 格式无效`);
  const value = JSON.parse(Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8")) as unknown;
  if (!Array.isArray(value)) throw new Error(`仓库文件 ${path} 必须是数组`);
  return { value: value as T[], sha: data.sha };
}

/** 以单个提交把数组写回仓库文件；远端 sha 不一致时抛出冲突错误。 */
export async function commitRepoJson(path: string, value: unknown[], sha: string, message: string): Promise<{ commitSha: string }> {
  const { octokit, repository, branch } = createClient();
  try {
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      ...repository,
      path,
      branch,
      message,
      content: Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8").toString("base64"),
      sha,
    });
    return { commitSha: response.data.commit.sha! };
  } catch (error) {
    if (getErrorStatus(error) === 409) throw new ContentConflictError();
    throw error;
  }
}

/** 创建使用 Personal Access Token 的服务端客户端。 */
function createClient() {
  const config = getRepositoryConfig();
  return {
    octokit: new Octokit({ auth: config.token }),
    repository: { owner: config.owner, repo: config.repo },
    branch: config.branch,
  };
}

/** 从环境变量读取仓库配置，缺失时立即失败。 */
function getRepositoryConfig(): GitHubRepositoryConfig {
  const required = ["GITHUB_TOKEN", "GITHUB_OWNER", "GITHUB_REPO"] as const;
  for (const key of required) if (!process.env[key]) throw new Error(`缺少 ${key} 环境变量`);
  return {
    token: process.env.GITHUB_TOKEN!,
    owner: process.env.GITHUB_OWNER!,
    repo: process.env.GITHUB_REPO!,
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

/** 从未知错误中取得 GitHub HTTP 状态码。 */
function getErrorStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "status" in error) {
    const { status } = error as { status?: unknown };
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}
