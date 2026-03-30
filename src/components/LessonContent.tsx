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
      className="absolute top-3 right-3 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
    </button>
  );
}

const calloutStyles = {
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: <Info className="w-5 h-5 text-blue-500" /> },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
  tip: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', icon: <Lightbulb className="w-5 h-5 text-purple-500" /> },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" /> },
};

export function ContentBlock({ block }: ContentBlockProps) {
  switch (block.type) {
    case 'heading':
      return <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3 first:mt-0">{block.value}</h2>;

    case 'text':
      return <p className="text-gray-600 leading-relaxed mb-4">{block.value}</p>;

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
          {block.value && <p className="text-sm font-semibold text-gray-700 mb-2">{block.value}</p>}
          <ul className="space-y-1.5">
            {block.items?.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
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
            <p className="text-sm font-semibold text-gray-700 mb-3">{block.value}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Good Example */}
            <div className="border-2 border-emerald-200 rounded-xl overflow-hidden">
              <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">Good</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{block.good}</p>
                {block.goodExplanation && (
                  <p className="text-xs text-emerald-600 mt-3 pt-3 border-t border-emerald-100">
                    {block.goodExplanation}
                  </p>
                )}
              </div>
            </div>

            {/* Bad Example */}
            <div className="border-2 border-red-200 rounded-xl overflow-hidden">
              <div className="bg-red-50 px-4 py-2 border-b border-red-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-semibold text-red-700">Bad</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{block.bad}</p>
                {block.badExplanation && (
                  <p className="text-xs text-red-600 mt-3 pt-3 border-t border-red-100">
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
        <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              {block.templateTitle || 'Template'}
            </span>
            <CopyButton text={block.value} />
          </div>
          <div className="p-4 bg-white">
            <p className="text-sm text-gray-600 font-mono whitespace-pre-wrap">{block.value}</p>
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
