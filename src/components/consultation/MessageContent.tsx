'use client';

import { Fragment } from 'react';

/**
 * Lightweight, safe renderer for the assistant's text. The model returns plain
 * text with simple structure — paragraphs, "- " bullet lines, and **bold**.
 * We deliberately do NOT use dangerouslySetInnerHTML or a markdown lib: we
 * tokenize into React nodes so nothing from the model can inject markup.
 */

function renderInline(text: string, keyPrefix: string) {
  // Split on **bold** spans.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-zinc-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={`${keyPrefix}-t-${i}`}>{part}</Fragment>;
  });
}

export function MessageContent({ content }: { content: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = content.replace(/\r\n/g, '\n').split('\n');

  let listBuffer: string[] = [];
  let paraBuffer: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (paraBuffer.length) {
      const text = paraBuffer.join(' ').trim();
      if (text) {
        blocks.push(
          <p key={`p-${key++}`} className="text-sm leading-relaxed text-zinc-700">
            {renderInline(text, `p${key}`)}
          </p>,
        );
      }
      paraBuffer = [];
    }
  };

  const flushList = () => {
    if (listBuffer.length) {
      const items = [...listBuffer];
      blocks.push(
        <ul key={`ul-${key++}`} className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-zinc-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
              <span>{renderInline(item, `li${key}-${i}`)}</span>
            </li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) {
      flushPara();
      listBuffer.push(bullet[1]);
    } else if (line.trim() === '') {
      flushPara();
      flushList();
    } else {
      flushList();
      paraBuffer.push(line);
    }
  }
  flushPara();
  flushList();

  return <div className="flex flex-col gap-3">{blocks}</div>;
}
