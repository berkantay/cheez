import type { CheezType } from "../mark-catalog"

export type MarkedFeedbackType =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "loading"

export interface MarkedFeedbackAppearance {
  color: string
  mark: CheezType
}

export const MARKED_FEEDBACK_APPEARANCES: Record<
  MarkedFeedbackType,
  MarkedFeedbackAppearance
> = {
  default: { color: "#8f74ff", mark: "asterisk" },
  success: { color: "#b7ff3c", mark: "check" },
  warning: { color: "#ff4f2e", mark: "exclamation" },
  error: { color: "#ff5fa2", mark: "cross" },
  info: { color: "#35d9ff", mark: "spiral" },
  loading: { color: "#8f74ff", mark: "loop-arrow" },
}

export function getMarkedFeedbackType(type?: string): MarkedFeedbackType {
  if (type && type in MARKED_FEEDBACK_APPEARANCES) {
    return type as MarkedFeedbackType
  }

  return "default"
}
