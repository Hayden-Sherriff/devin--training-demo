import { Copy, Check, Info, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { LessonContent as LessonContentType } from '../data/curriculum';

interface ContentBlockProps {
  block: LessonContentType;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-cognition-dark03 hover:bg-cognition-dark03/80 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-cognition-accent02" /> : <Copy className="w-3.5 h-3.5 text-cognition-grey02" />}
    </button>
  );
}

const calloutStyles = {
  info: { bg: 'bg-cognition-accent01/10', border: 'border-cognition-accent01/30', text: 'text-cognition-accent01', icon: <Info className="w-5 h-5 text-cognition-accent01" /> },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-300', icon: <AlertTriangle className="w-5 h-5 text-amber-400" /> },
  tip: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-300', icon: <Lightbulb className="w-5 h-5 text-purple-400" /> },
  success: { bg: 'bg-cognition-accent02/10', border: 'border-cognition-accent02/30', text: 'text-cognition-accent02', icon: <CheckCircle2 className="w-5 h-5 text-cognition-accent02" /> },
};

export function ContentBlock({ block }: ContentBlockProps) {
  switch (block.type) {
    case 'heading':
      return <h2 className="text-xl font-heading font-light tracking-wide text-cognition-light01 mt-8 mb-3 first:mt-0">{block.value}</h2>;

    case 'text':
      return <p className="text-cognition-grey01 leading-relaxed mb-4">{block.value}</p>;

    case 'code':
      return (
        <div className="relative mb-4">
          <pre className="code-block">
            <code>{block.value}</code>
          </pre>
          <CopyButton text={block.value} />
        </div>
      );

    case 'list':
      return (
        <div className="mb-4">
          {block.value && <p className="text-sm font-semibold text-cognition-grey01 mb-2">{block.value}</p>}
          <ul className="space-y-1.5">
            {block.items?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-cognition-grey01">
                <span className="w-1.5 h-1.5 bg-cognition-accent01 rounded-full mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'comparison':
      return (
        <div className="mb-6">
          {block.value && (
            <p className="text-sm font-semibold text-cognition-grey01 mb-3">{block.value}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Good Example */}
            <div className="border-2 border-cognition-accent02/40 rounded-xl overflow-hidden">
              <div className="bg-cognition-accent02/10 px-4 py-2 border-b border-cognition-accent02/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cognition-accent02" />
                  <span className="text-sm font-semibold text-cognition-accent02">Good</span>
                </div>
              </div>
              <div className="p-4 bg-cognition-dark01">
                <p className="text-sm text-cognition-grey01 whitespace-pre-wrap">{block.good}</p>
                {block.goodExplanation && (
                  <p className="text-xs text-cognition-accent02 mt-3 pt-3 border-t border-cognition-dark03">
                    {block.goodExplanation}
                  </p>
                )}
              </div>
            </div>

            {/* Bad Example */}
            <div className="border-2 border-cognition-error/40 rounded-xl overflow-hidden">
              <div className="bg-cognition-error/10 px-4 py-2 border-b border-cognition-error/30">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-cognition-error" />
                  <span className="text-sm font-semibold text-cognition-error">Bad</span>
                </div>
              </div>
              <div className="p-4 bg-cognition-dark01">
                <p className="text-sm text-cognition-grey01 whitespace-pre-wrap">{block.bad}</p>
                {block.badExplanation && (
                  <p className="text-xs text-cognition-error mt-3 pt-3 border-t border-cognition-dark03">
                    {block.badExplanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );

    case 'callout': {
      const variant = block.variant || 'info';
      const style = calloutStyles[variant];
      return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${style.bg} ${style.border} mb-4`}>
          <span className="flex-shrink-0 mt-0.5">{style.icon}</span>
          <p className={`text-sm ${style.text}`}>{block.value}</p>
        </div>
      );
    }

    case 'template':
      return (
        <div className="mb-4 border border-cognition-dark03 rounded-xl overflow-hidden">
          <div className="bg-cognition-dark03/50 px-4 py-2.5 border-b border-cognition-dark03 flex items-center justify-between">
            <span className="text-sm font-semibold text-cognition-grey01">
              {block.templateTitle || 'Template'}
            </span>
            <CopyButton text={block.value} />
          </div>
          <div className="p-4 bg-cognition-dark01">
            <p className="text-sm text-cognition-grey01 font-mono whitespace-pre-wrap">{block.value}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function LessonContentRenderer({ content }: { content: LessonContentType[] }) {
  return (
    <div className="animate-fade-in">
      {content.map((block, idx) => (
        <ContentBlock key={idx} block={block} />
      ))}
    </div>
  );
}
