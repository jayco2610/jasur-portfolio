import { getAllPosts } from "@/lib/blog";
import WritingContent from "./WritingContent";

export default function WritingPage() {
  // Читаем файлы статей на сервере и отдаём в клиентский компонент,
  // потому что переключатель языка живёт на клиенте, а fs только на сервере.
  const posts = getAllPosts().map(({ html, readingMinutes, ...meta }) => {
    void html;
    void readingMinutes;
    return meta;
  });

  return <WritingContent posts={posts} />;
}
