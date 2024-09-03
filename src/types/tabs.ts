export const tabs = [
  "Summary",
  "Chart",
  "Statistics",
  "Analysis",
  "Settings",
] as const;

export type TabType = (typeof tabs)[number];
