import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { calculateEnemyAttack, calculateEnemyHp, calculateExpReward, calculateGoldReward } from '@tower/core'
import { getMonsterForStage } from '../data/monsters'
import { usePlayerStore } from './player'

export type BattleState = 'Walking' | 'Battling' | 'Transition' | 'Dead'

interface DamageEvent {
  id: number
  damage: number
  x: number
  y: number
  type: 'hero' | 'enemy'
  life: number
}

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
  const damageEvents = ref<DamageEvent[]>([])
  
  let eventId = 0
  let loopId: number | null = null
  let lastTime = 0

  // 内部计时器 (基于毫秒)
  const timers = {
    heroAttack: 0,
    enemyAttack: 0,
    regen: 0,
    deathWait: 0,
    defeatWait: 0,
    transitionWait: 0
  }

  // Keep hero HP in sync when max hp changes
  watch(heroMaxHp, (newMax, oldMax) => {
    if (oldMax > 0) {
      const ratio = heroHp.value / oldMax
      heroHp.value = Math.floor(newMax * ratio)
    }
  })

  function gameLoop(time: number) {
    if (lastTime === 0) lastTime = time
    const deltaTime = Math.min(time - lastTime, 1000 * 60 * 60 * 24) // 限制最大离线模拟时间 (24小时)
    lastTime = time

    if (state.value === 'Battling') {
      // 1. 生命恢复
      timers.regen += deltaTime
      if (timers.regen >= 1000) {
        const ticks = Math.floor(timers.regen / 1000)
        if (heroHp.value < heroMaxHp.value) {
          heroHp.value = Math.min(heroMaxHp.value, heroHp.value + player.regen * ticks)
        }
        timers.regen %= 1000
      }

      // 2. 敌人攻击
      timers.enemyAttack += deltaTime
      while (timers.enemyAttack >= 1500 && state.value === 'Battling') {
        enemyAttackHero()
        timers.enemyAttack -= 1500
      }

      // 3. 自动战斗
      if (isAutoBattle.value) {
        timers.heroAttack += deltaTime
        while (timers.heroAttack >= 1000 && state.value === 'Battling') {
          attackEnemy()
          timers.heroAttack -= 1000
        }
      }
    } else if (state.value === 'Dead') {
      timers.deathWait += deltaTime
      if (timers.deathWait >= 2000) {
        if (subStage.value > 1) {
          subStage.value--
        }
        heroHp.value = heroMaxHp.value
        enemyHp.value = enemyMaxHp.value
        state.value = 'Walking'
        timers.deathWait = 0
      }
    } else if (state.value === 'Walking') {
      timers.transitionWait += deltaTime
      if (timers.transitionWait >= 1500) {
        if (enemyHp.value <= 0) {
          // 是在打败敌人后走路
          progressStage()
        } else {
          // 是在死亡复活后走路
          state.value = 'Battling'
        }
        timers.transitionWait = 0
      }
    }

    // 更新伤害飘字的生命周期
    if (damageEvents.value.length > 0) {
      let needsFilter = false
      for (let i = 0; i < damageEvents.value.length; i++) {
        damageEvents.value[i].life += deltaTime
        if (damageEvents.value[i].life > 850) {
          needsFilter = true
        }
      }
      if (needsFilter) {
        damageEvents.value = damageEvents.value.filter(e => e.life <= 850)
      }
    }

    loopId = requestAnimationFrame(gameLoop)
  }

  function startBattleTimers() {
    if (loopId === null) {
      lastTime = 0
      loopId = requestAnimationFrame(gameLoop)
    }
  }

  function stopBattleTimers() {
    if (loopId !== null) {
      cancelAnimationFrame(loopId)
      loopId = null
    }
  }

  function attackEnemy() {
    if (state.value !== 'Battling' || enemyHp.value <= 0) return

    const damage = player.attack
    enemyHp.value -= damage
    attackSequence.value++

    damageEvents.value.push({
      id: eventId++,
      damage,
      x: 55 + (Math.random() * 20 - 10),
      y: 40 + (Math.random() * 20 - 10),
      type: 'hero',
      life: 0
    })

    if (damageEvents.value.length > 8) {
      damageEvents.value.shift()
    }

    if (enemyHp.value <= 0) {
      enemyHp.value = 0
      defeatEnemy()
    }
  }

  function enemyAttackHero() {
    if (state.value !== 'Battling' || heroHp.value <= 0) return

    const damage = enemyAttack.value
    heroHp.value -= damage
    enemyAttackSequence.value++

    damageEvents.value.push({
      id: eventId++,
      damage,
      x: 25 + (Math.random() * 16 - 8),
      y: 45 + (Math.random() * 16 - 8),
      type: 'enemy',
      life: 0
    })

    if (damageEvents.value.length > 8) {
      damageEvents.value.shift()
    }

    if (heroHp.value <= 0) {
      heroHp.value = 0
      state.value = 'Dead'
      timers.deathWait = 0
    }
  }

  function defeatEnemy() {
    const boss = isBoss.value
    player.addGold(calculateGoldReward(stage.value, subStage.value, boss))
    player.addExp(calculateExpReward(stage.value, subStage.value, boss))

    state.value = 'Walking'
    timers.transitionWait = 0
  }

  function progressStage() {
    subStage.value++
    if (subStage.value > 10) {
      subStage.value = 1
      stage.value++
    }
    enemyHp.value = enemyMaxHp.value
    heroHp.value = Math.max(heroHp.value, Math.floor(heroMaxHp.value * 0.3))
    state.value = 'Battling'
  }

  function toggleAutoBattle() {
    isAutoBattle.value = !isAutoBattle.value
  }

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
