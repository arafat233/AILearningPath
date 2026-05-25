/**
 * JavaCode — lazy-loaded syntax-highlighted code block.
 *
 * Imported via React.lazy from ProTopicView, so the Prism payload only
 * lands when a topic page is actually opened. Uses the prism-light build
 * with java + javascript registered (other languages added on demand).
 */
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("javascript", javascript);

export default function JavaCode({ code, language = "java" }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        padding: "16px",
        paddingRight: "64px",
        background: "transparent",
        fontSize: "13px",
        lineHeight: 1.6,
      }}
      codeTagProps={{ style: { fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' } }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
