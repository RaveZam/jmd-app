export function GeminiIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C11.5 7.5 7.5 11.5 2 12C7.5 12.5 11.5 16.5 12 22C12.5 16.5 16.5 12.5 22 12C16.5 11.5 12.5 7.5 12 2Z" />
    </svg>
  );
}

// Gemini gradient used across the feature
export const GEMINI_GRADIENT =
  "linear-gradient(135deg, #4285F4 0%, #7C3AED 50%, #DB4437 100%)";
