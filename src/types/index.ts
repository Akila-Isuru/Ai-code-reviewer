export interface ReviewResult {
  score: number;
  summary: string;
  securityIssues: string[];
  performanceIssues: string[];
  refactoredCode: string;
}