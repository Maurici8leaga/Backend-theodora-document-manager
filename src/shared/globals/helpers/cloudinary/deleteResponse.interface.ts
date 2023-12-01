// Interface for delete a file from cloudinary
export interface IDeleteResponse {
  deleted: Record<string, string>;
  deleted_counts: Record<string, { original: number; derived: number }>;
  partial: boolean;
  rate_limit_allowed: number;
  rate_limit_reset_at: Date;
  rate_limit_remaining: number;
}
