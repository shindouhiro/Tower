import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { calculateEnemyAttack, calculateEnemyHp, calculateExpReward, calculateGoldReward } from '@tower/core'
import { getMonsterForStage } from '../data/monsters'
import { usePlayerStore } from './player'

export type BattleState = 'Walking' | 'Battling' | 'Transition' | 'Dead'

export const useBattleStore = defineStore('battle', () => {
  const player = usePlayerStore()

  const stage = ref(1)
  const subStage = ref(1)

  const state = ref<BattleState>('Battling')

  // Monster config for current stage
  const currentMonster = computed(() => getMonsterForStage(stage.value))
  const isBoss = computed(() => subStage.value === 10)

  // Enemy stats
  const enemyMaxHp = computed(() => calculateEnemyHp(stage.value, subStage.value))
  const enemyHp = ref(enemyMaxHp.value)
  const enemyAttack = computed(() => calculateEnemyAttack(stage.value, subStage.value))

  // Hero HP
  const heroMaxHp = computed(() => player.health)
  const heroHp = ref(heroMaxHp.value)

  const isAutoBattle = ref(true)

  const attackSequence = ref(0)
  const enemyAttackSequence = ref(0)
  const damageEvents = ref<{ id: number, damage: number, x: number, y: number, type: 'hero' | 'enemy' }[]>([])
  let eventId = 0
  let defeatTimer: number | null = null
  let enemyAttackTimer: number | null = null
  let regenTimer: number | null = null

  // Keep hero HP in sync when max hp changes (e.g., after upgrading health)
  watch(heroMaxHp, (newMax, oldMax) => {
    if (oldMax > 0) {
      // Proportionally scale current HP
      const ratio = heroHp.value / oldMax
      heroHp.value = Math.floor(newMax * ratio)
    }
  })

  function startBattleTimers() {
    stopBattleTimers()

    // Enemy attacks every 1.5 seconds
    enemyAttackTimer = window.setInterval(() => {
      if (state.value === 'Battling') {
        enemyAttackHero()
      }
    }, 1500)

    // Hero regenerates HP every second
    regenTimer = window.setInterval(() => {
      if (state.value === 'Battling' && heroHp.value < heroMaxHp.value) {
        heroHp.value = Math.min(heroMaxHp.value, heroHp.value + player.regen)
      }
    }, 1000)
  }

  function stopBattleTimers() {
    if (enemyAttackTimer) {
      clearInterval(enemyAttackTimer)
      enemyAttackTimer = null
    }
    if (regenTimer) {
      clearInterval(regenTimer)
      regenTimer = null
    }
  }

  function attackEnemy() {
    if (state.value !== 'Battling')
      return
    if (enemyHp.value <= 0)
      return

    const damage = player.attack
    enemyHp.value -= damage
    attackSequence.value++

    const id = eventId++
    damageEvents.value.push({
      id,
      damage,
      x: 55 + (Math.random() * 20 - 10),
      y: 40 + (Math.random() * 20 - 10),
      type: 'hero',
    })

    if (damageEvents.value.length > 6) {
      damageEvents.value.shift()
    }

    window.setTimeout(() => {
      damageEvents.value = damageEvents.value.filter(event => event.id !== id)
    }, 850)

    if (enemyHp.value <= 0 && !defeatTimer) {
      enemyHp.value = 0
      defeatTimer = window.setTimeout(() => {
        defeatEnemy()
      }, 880)
    }
  }

  function enemyAttackHero() {
    if (state.value !== 'Battling')
      return
    if (heroHp.value <= 0)
      return

    const damage = enemyAttack.value
    heroHp.value -= damage
    enemyAttackSequence.value++

    const id = eventId++
    damageEvents.value.push({
      id,
      damage,
      x: 25 + (Math.random() * 16 - 8),
      y: 45 + (Math.random() * 16 - 8),
      type: 'enemy',
    })

    if (damageEvents.value.length > 6) {
      damageEvents.value.shift()
    }

    window.setTimeout(() => {
      damageEvents.value = damageEvents.value.filter(event => event.id !== id)
    }, 850)

    if (heroHp.value <= 0) {
      heroHp.value = 0
      heroDeath()
    }
  }

  function heroDeath() {
    state.value = 'Dead'
    stopBattleTimers()

    // Death penalty: go back 1 subStage (min 1)
    window.setTimeout(() => {
      if (subStage.value > 1) {
        subStage.value--
      }

      // Reset HP and restart
      heroHp.value = heroMaxHp.value
      enemyHp.value = enemyMaxHp.value
      state.value = 'Walking'

      window.setTimeout(() => {
        state.value = 'Battling'
        startBattleTimers()
      }, 1500)
    }, 2000)
  }

  function defeatEnemy() {
    const boss = isBoss.value
    const goldReward = calculateGoldReward(stage.value, subStage.value, boss)
    const expReward = calculateExpReward(stage.value, subStage.value, boss)

    player.addGold(goldReward)
    player.addExp(expReward)

    state.value = 'Walking'
    stopBattleTimers()

    window.setTimeout(() => {
      progressStage()
    }, 2000)
  }

  function progressStage() {
    defeatTimer = null
    subStage.value++
    if (subStage.value > 10) {
      subStage.value = 1
      stage.value++
    }

    enemyHp.value = enemyMaxHp.value
    // Don't fully reset hero HP - carry over, but ensure at least 30%
    heroHp.value = Math.max(heroHp.value, Math.floor(heroMaxHp.value * 0.3))
    state.value = 'Battling'
    startBattleTimers()
  }

  function toggleAutoBattle() {
    isAutoBattle.value = !isAutoBattle.value
  }

  // Initialize battle timers
  startBattleTimers()

  return {
    stage,
    subStage,
    state,
    currentMonster,
    isBoss,
    enemyMaxHp,
    enemyHp,
    enemyAttack,
    heroMaxHp,
    heroHp,
    isAutoBattle,
    attackSequence,
    enemyAttackSequence,
    damageEvents,
    attackEnemy,
    toggleAutoBattle,
    startBattleTimers,
    stopBattleTimers,
  }
})
