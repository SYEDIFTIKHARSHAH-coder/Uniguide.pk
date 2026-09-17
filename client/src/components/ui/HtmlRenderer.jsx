export default function HtmlRenderer({ content }) {
  if (!content) return null;

  return (
    <div 
      className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
