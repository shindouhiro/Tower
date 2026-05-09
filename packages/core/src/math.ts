const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'A', 'AA', 'AB', 'AC', 'AD', 'AE']

export function formatNumber(value: number): string {
  if (value < 1000)
    return Math.floor(value).toString()

  const tier = Math.floor(Math.log10(value) / 3)
  if (tier === 0)
    return Math.floor(value).toString()

  const suffix = SUFFIXES[tier] || `e${tier * 3}`
  const scale = 10 ** (tier * 3)
  const scaled = value / scale

  return `${scaled.toFixed(2)}${suffix}`
}

export function calculateCost(baseCost: number, level: number, growthFactor = 1.07): number {
  return Math.floor(baseCost * (growthFactor ** level))
}

export function calculateStat(baseStat: number, level: number, flatGrowth = 0, multGrowth = 1.1): number {
  // Stats could grow linearly and then exponentially
  return Math.floor((baseStat + level * flatGrowth) * (multGrowth ** level))
}

export function calculateEnemyHp(stage: number, subStage: number): number {
  return Math.floor(100 * (1.5 ** stage) * (1.1 ** subStage))
}

export function calculateEnemyAttack(stage: number, subStage: number): number {
  return Math.floor(5 * (1.3 ** stage) * (1.08 ** subStage))
}

export function calculateGoldReward(stage: number, subStage: number, isBoss: boolean): number {
  const base = 50 * (1.2 ** stage) * (1.05 ** subStage)
  return Math.floor(isBoss ? base * 5 : base)
}

export function calculateExpReward(stage: number, subStage: number, isBoss: boolean): number {
  const base = 10 * (1.15 ** stage) * (1.03 ** subStage)
  return Math.floor(isBoss ? base * 5 : base)
}

export function calculateLevelUpExp(level: number): number {
  return Math.floor(100 * (1.12 ** level))
}
