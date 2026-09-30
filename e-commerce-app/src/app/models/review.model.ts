export interface Review {
  readonly id: string;
  readonly productId: string;
  readonly userId: string;
  readonly rating: number;
  readonly comment: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface SubmitReviewInput {
  readonly rating: number;
  readonly comment?: string;
}
