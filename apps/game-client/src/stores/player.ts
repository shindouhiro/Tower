import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { calculateCost, calculateStat } from '@tower/core'

export const usePlayerStore = defineStore('player', () => {
  // Currencies
  const gold = ref(347.25e12) // roughly 347.25A if A is 1e12
  const gems = ref(100)

  // Stats levels
  const attackLevel = ref(64)
  const healthLevel = ref(1)
  const regenLevel = ref(1)

  // Derived stats
  // Base attack 1, flat growth 1, mult growth 1.15
  const attack = computed(() => calculateStat(1, attackLevel.value, 1, 1.15))
  // Base health 100, flat growth 10, mult 1.1
  const health = computed(() => calculateStat(100, healthLevel.value, 10, 1.1))
  // Base regen 7, flat growth 2, mult 1.05
  const regen = computed(() => calculateStat(7, regenLevel.value, 2, 1.05))

  // Total power (simple addition or formula)
  const totalPower = computed(() => attack.value * 1.05 + health.value * 0.1)

  // Upgrade costs
  const attackUpgradeCost = computed(() => calculateCost(10, attackLevel.value, 1.07))
  const healthUpgradeCost = computed(() => calculateCost(7, healthLevel.value, 1.07))
  const regenUpgradeCost = computed(() => calculateCost(7, regenLevel.value, 1.07))

  // Actions
  function upgradeAttack() {
    const cost = attackUpgradeCost.value
    if (gold.value >= cost) {
      gold.value -= cost
      attackLevel.value++
    }
  }

  function upgradeHealth() {
    const cost = healthUpgradeCost.value
    if (gold.value >= cost) {
      gold.value -= cost
      healthLevel.value++
    }
  }

  function upgradeRegen() {
    const cost = regenUpgradeCost.value
    if (gold.value >= cost) {
      gold.value -= cost
      regenLevel.value++
    }
  }

  function addGold(amount: number) {
    gold.value += amount
  }

  return {
    gold,
    gems,
    attackLevel,
    healthLevel,
    regenLevel,
    attack,
    health,
    regen,
    totalPower,
    attackUpgradeCost,
    healthUpgradeCost,
    regenUpgradeCost,
    upgradeAttack,
    upgradeHealth,
    upgradeRegen,
    addGold,
  }
})
