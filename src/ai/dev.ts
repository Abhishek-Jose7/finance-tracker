import { config } from 'dotenv';
config();

import '@/ai/flows/generate-ai-recommendations.ts';
import '@/ai/flows/analyze-budget-suggest-adjustments.ts';
import '@/ai/flows/guide-onboarding-conversationally.ts';
import '@/ai/flows/provide-overspending-alerts.ts';
import '@/ai/flows/explain-transaction-details.ts';