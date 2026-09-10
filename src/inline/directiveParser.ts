/**
 * `@lezer/markdown` extension: teach the Markdown parser about `:::` container
 * directives so `syntaxTree` carries a `Directive` node for each admonition
 * block. `@lezer/markdown` ships GFM, footnotes and a few others but not
 * container directives, so the live-preview decorations have nothing to anchor a
 * block widget to without this.
 *
 * The body of a directive is intentionally left unparsed: inline mode renders
 * the whole block through the shared pipeline as one widget, so descending into
 * its children would only cost work. Source mode still shows the raw text.
 */
import type { MarkdownConfig } from '@lezer/markdown';

/** Matches an opening fence: three or more colons, an optional kind, then junk. */
const OPEN = /^(:::+)([ \t]*[A-Za-z][\w-]*)?(.*)$/;
/** Matches a closing fence: three or more colons alone on the line. */
const CLOSE = /^:::+[ \t]*$/;

export const containerDirective: MarkdownConfig = {
  defineNodes: [
    { name: 'Directive', block: true },
    { name: 'DirectiveMark' },
    { name: 'DirectiveName' },
  ],
  parseBlock: [
    {
      name: 'ContainerDirective',
      before: 'Blockquote',
      parse(cx, line) {
        const open = OPEN.exec(line.text.slice(line.pos));
        if (!open) return false;

        const from = cx.lineStart + line.pos;
        const fenceEnd = from + open[1]!.length;
        const marks = [cx.elt('DirectiveMark', from, fenceEnd)];

        const kind = open[2];
        if (kind && kind.trim()) {
          const lead = kind.length - kind.trimStart().length;
          marks.push(cx.elt('DirectiveName', fenceEnd + lead, fenceEnd + kind.length));
        }

        let end = cx.lineStart + line.text.length;
        while (cx.nextLine()) {
          if (CLOSE.test(line.text.slice(line.pos))) {
            const closeFrom = cx.lineStart + line.pos;
            end = cx.lineStart + line.text.length;
            marks.push(cx.elt('DirectiveMark', closeFrom, end));
            cx.nextLine();
            break;
          }
          end = cx.lineStart + line.text.length;
        }

        cx.addElement(cx.elt('Directive', from, end, marks));
        return true;
      },
    },
  ],
};
