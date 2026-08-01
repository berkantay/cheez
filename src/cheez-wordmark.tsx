import { CHEEZ_COLORS } from "./brand"

interface CheezWordmarkProps {
  className?: string
}

export function CheezWordmark({ className }: CheezWordmarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 108 34"
      role="img"
      aria-labelledby="cheez-wordmark-title"
    >
      <title id="cheez-wordmark-title">Cheez</title>
      <path
        d="M20 11.5C17.5 8.5 10 8.8 7.5 14.5C5 20.2 8.5 25.2 14.5 25C18 24.9 20.2 22.9 21.3 20.8M25.5 5.5C24.4 11.2 24.2 18.8 24.7 25.8M24.5 17.8C27.1 11.8 33.6 9.6 36 13.2C38.6 17.1 34.5 22.4 38.2 24.8M41.2 17.2C45.5 17.1 51.2 15.3 51.1 12.1C51 9.3 46.1 9.3 43 11.5C39.2 14.2 39.6 21.2 43.8 23.9C47.3 26.2 51.9 24 54 21M56.2 17.2C60.5 17.1 66.2 15.3 66.1 12.1C66 9.3 61.1 9.3 58 11.5C54.2 14.2 54.6 21.2 58.8 23.9C62.3 26.2 66.9 24 69 21M72 11.8C77 10.2 84 10 88.2 11.3C84.8 15.1 79.7 20.7 75.4 25C80.5 22.9 86.3 23 91 24.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M98.2 24.3C99.3 23.2 101.1 23.3 101.8 24.5C101.5 26 99.8 26.6 98.5 25.7"
        fill="none"
        stroke={CHEEZ_COLORS.ink}
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
