export type ProcessingIssue = {
  row: number;
  column: string;
  detail: string;
};

export type ProcessingSummary = {
  total: number;
  successful: number;
  issues: ProcessingIssue[];
  elapsedSeconds: number;
};
