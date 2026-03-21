// components/ui/StarRating.jsx

export default function StarRating({ rating, size = 16, showValue = true }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array(full)
          .fill(null)
          .map((_, i) => (
            <StarIcon key={`f${i}`} type="full" size={size} />
          ))}
        {half && <StarIcon type="half" size={size} />}
        {Array(empty)
          .fill(null)
          .map((_, i) => (
            <StarIcon key={`e${i}`} type="empty" size={size} />
          ))}
      </div>
      {showValue && (
        <span className="text-sm text-gray-500">{rating.toFixed(1)}/5</span>
      )}
    </div>
  );
}

function StarIcon({ type, size }) {
  const color =
    type === "empty" ? "#E8E8E8" : "#FFC633";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      {type === "half" ? (
        <>
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="#FFC633" />
              <stop offset="50%" stopColor="#E8E8E8" />
            </linearGradient>
          </defs>
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill="url(#half-grad)"
          />
        </>
      ) : (
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      )}
    </svg>
  );
}
