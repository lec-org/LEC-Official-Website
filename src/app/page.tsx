import Home from "../home";
import { getMembers, getNews } from "@/lib/collections";

export default async function Page() {
  const [members, news] = await Promise.all([getMembers(), getNews()]);
  return <Home members={members} news={news} />;
}
