export const tabs = [
  "Summary",
  "Chart",
  "Statistics",
  "Analysis",
  "Settings",
] as const;

export type TabType = (typeof tabs)[number];

//  // 1d ,3d, 1w, 1m, 3m, 6m, 1y, max
export const timeIntervals = [
  "1d",
  "3d",
  "1w",
  "1m",
  "3m",
  "6m",
  "1y",
  "max",
] as const

export type TimeIntervalsType = (typeof timeIntervals)[number];


export const getNumberOfDataPoints = (timeFrame: TimeIntervalsType): number => {
  switch (timeFrame) {
    case "1d":
      return 10; // Example values
    case "3d":
      return 30;
    case "1w":
      return 50;
    case "1m":
      return 100;
    case "3m":
      return 200;
    case "6m":
      return 400;
    case "1y":
      return 800;
    case "max":
      return 1600;
    default:
      return 100;
  }
};