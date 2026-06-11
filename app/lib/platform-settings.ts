import prisma from './prisma';

const DEFAULT_COMMISSION_RATE = 25;
const MIN_RATE = 0;
const MAX_RATE = 80;
const SETTING_KEY = 'platform_commission_rate';

export async function getPlatformCommissionRate(): Promise<number> {
  try {
    const model = (prisma as any).platformSetting;
    if (!model || typeof model.findUnique !== 'function') return DEFAULT_COMMISSION_RATE;
    const setting = await model.findUnique({
      where: { key: SETTING_KEY },
    });
    if (!setting) return DEFAULT_COMMISSION_RATE;
    const rate = parseFloat(setting.value);
    if (isNaN(rate) || rate < MIN_RATE || rate > MAX_RATE) return DEFAULT_COMMISSION_RATE;
    return rate;
  } catch {
    return DEFAULT_COMMISSION_RATE;
  }
}

export function calcPayoutAmounts(grossAmount: number, commissionRate: number) {
  const platformFee = Math.round(grossAmount * (commissionRate / 100) * 100) / 100;
  const amount = Math.round((grossAmount - platformFee) * 100) / 100;
  return { grossAmount, platformFee, amount };
}
