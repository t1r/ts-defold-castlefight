export const fractionTypes = ['alliance', 'dark-elfs'] as const;

export type FractionType = (typeof fractionTypes)[number];
