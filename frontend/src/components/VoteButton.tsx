interface VoteButtonProps {
  score: number;
  userVote?: 'up' | 'down' | null;
  onUpvote: () => void;
  onDownvote: () => void;
  disabled?: boolean;
}

export function VoteButton({ score, userVote, onUpvote, onDownvote, disabled }: VoteButtonProps) {
  return (
    <div className="flex flex-col items-center gap-1 text-gray-500">
      <button
        onClick={onUpvote}
        disabled={disabled}
        className={`hover:text-orange-500 disabled:opacity-50 ${
          userVote === 'up' ? 'text-orange-500' : ''
        }`}
      >
        ▲
      </button>
      <span className={`font-medium ${score > 0 ? 'text-orange-500' : score < 0 ? 'text-blue-500' : ''}`}>
        {score}
      </span>
      <button
        onClick={onDownvote}
        disabled={disabled}
        className={`hover:text-blue-500 disabled:opacity-50 ${
          userVote === 'down' ? 'text-blue-500' : ''
        }`}
      >
        ▼
      </button>
    </div>
  );
}
