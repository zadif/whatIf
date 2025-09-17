export function LoadingSpinner({ size = "medium", color = "blue" }) {
  // Size options
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  // Color options
  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
    purple: "border-purple-500",
    gray: "border-gray-500",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${
          sizeClasses[size] || sizeClasses.medium
        } border-t-2 border-b-2 ${colorClasses[color] || colorClasses.blue}`}
      ></div>
    </div>
  );
}

export default LoadingSpinner;
