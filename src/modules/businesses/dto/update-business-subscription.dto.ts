import { IsBoolean, IsDateString, IsIn, IsOptional } from 'class-validator';

export const BILLING_PLANS = ['trial', 'monthly', 'semiannual', 'annual'] as const;
export const BILLING_STATUSES = ['trialing', 'active', 'past_due', 'cancelled'] as const;

export class UpdateBusinessSubscriptionDto {
  @IsOptional()
  @IsIn(BILLING_PLANS)
  billingPlan?: (typeof BILLING_PLANS)[number];

  @IsOptional()
  @IsIn(BILLING_STATUSES)
  billingStatus?: (typeof BILLING_STATUSES)[number];

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsDateString()
  trialEndsAt?: string;

  @IsOptional()
  @IsDateString()
  subscriptionStartsAt?: string;

  @IsOptional()
  @IsDateString()
  subscriptionEndsAt?: string;
}
