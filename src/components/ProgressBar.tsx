interface ProgressBarProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  percentage,
  size = 'md',
  color = 'bg-blue-600',
  showLabel = false,
}: ProgressBarProps) {
  const heights: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={`flex-1 bg-gray-100 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${color} ${heights[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-600 min-w-[3rem] text-right">
          {percentage}%
        </span>
      )}
    </div>
  );
}
