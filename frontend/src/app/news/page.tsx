import { redirect } from "next/navigation";

import { ROUTES } from "@/constants";

export default function NewsPage() {
  redirect(`${ROUTES.blog}?tab=news`);
}
