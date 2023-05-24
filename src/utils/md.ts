import { markdownTable } from "markdown-table";
import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import katex from "katex";
import { CalloutIcon } from "../types";
require("katex/contrib/mhchem");
export const inlineCode = (text: string) => {
  return `\`${text}\``;
};

export const bold = (text: string) => {
  return `**${text}**`;
};

export const italic = (text: string) => {
  return `_${text}_`;
};

export const strikethrough = (text: string) => {
  return `~~${text}~~`;
};

export const underline = (text: string) => {
  return `<u>${text}</u>`;
};

export const link = (text: string, href: string) => {
  return `[${text}](${href})`;
};

export const codeBlock = (text: string, language?: string) => {
  if (language === "plain text") language = "text";

  return `\`\`\`${language}
${text}
\`\`\``;
};

export const heading1 = (text: string) => {
  return `# ${text}`;
};

export const heading2 = (text: string) => {
  return `## ${text}`;
};

export const heading3 = (text: string) => {
  return `### ${text}`;
};

export const quote = (text: string) => {
  // the replace is done to handle multiple lines
  return `> ${text.replace(/\n/g, "  \n> ")}`;
};

export const callout = (text: string, icon?: CalloutIcon) => {
  let emoji: string | undefined;
  if (icon?.type === "emoji") {
    emoji = icon.emoji;
  }

  // the replace is done to handle multiple lines
  return `> ${emoji ? emoji + " " : ""}${text.replace(/\n/g, "  \n> ")}`;
};

export const bullet = (text: string, count?: number) => {
  let renderText = text.trim();
  return count ? `${count}. ${renderText}` : `- ${renderText}`;
};

export const todo = (text: string, checked: boolean) => {
  return checked ? `- [x] ${text}` : `- [ ] ${text}`;
};

export const image = (alt: string, href: string) => {
  return `![${alt}](${href})`;
};

export const addTabSpace = (text: string, n = 0) => {
  const tab = "	";
  for (let i = 0; i < n; i++) {
    if (text.includes("\n")) {
      const multiLineText = text.split(/(?<=\n)/).join(tab);
      text = tab + multiLineText;
    } else text = tab + text;
  }
  return text;
};

export const divider = () => {
  return "---";
};

export const toggle = (summary?: string, children?: string) => {
  if (!summary) return children || "";
  return `<details>
  <summary>${summary}</summary>

${children || ""}

  </details>`;
};

export const table = (cells: string[][]) => {
  return markdownTable(cells);
};

export const richText = (textArray: RichTextItemResponse[], plain = false) => {
  if (plain) {
    return textArray
      .map((text) => {
        return text.plain_text;
      })
      .join("");
  }

  return textArray
    .map((text) => {
      if (text.type === "text") {
        const annotations = text.annotations;
        let content = text.text.content;
        if (annotations.bold) content = bold(content);
        if (annotations.code) content = inlineCode(content);
        if (annotations.italic) content = italic(content);
        if (annotations.strikethrough) content = strikethrough(content);
        if (annotations.underline) content = underline(content);
        return content;
      } else if (text.type === "equation") {
        return katex.renderToString(text.equation.expression, {
          displayMode: false,
          throwOnError: false,
        });
      } else {
        // TODO
      }
    })
    .join("");
};
