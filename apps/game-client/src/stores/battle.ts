import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usePlayerStore } from './player'

type BattleState = 'Walking' | 'Battling' | 'Transition'

export const useBattleStore = defineStore('battle', () => {
  const player = usePlayerStore()

  const stage = ref(1)
  const subStage = ref(6)
  
  const state = ref<BattleState>('Battling')

  // Enemy stats
  const enemyMaxHp = computed(() => 100 * (1.5 ** stage.value) * (1.1 ** subStage.value))
  const enemyHp = ref(enemyMaxHp.value)

  const isAutoBattle = ref(true) // Auto by default now

  // Damage events for floating text
  const damageEvents = ref<{ id: number; damage: number; x: number; y: number }[]>([])
  let eventId = 0

  function attackEnemy() {
    if (state.value !== 'Battling') return

    const damage = player.attack
    enemyHp.value -= damage

    // Add floating damage text
    damageEvents.value.push({
      id: eventId++,
      damage,
      x: 50 + (Math.random() * 20 - 10), // Random offset near center
      y: 50 + (Math.random() * 20 - 10),
    })

    // Clean up old events
    if (damageEvents.value.length > 10) {
      damageEvents.value.shift()
    }

    if (enemyHp.value <= 0) {
      defeatEnemy()
    }
  }

  function defeatEnemy() {
    // Reward gold
    const reward = 50 * (1.2 ** stage.value)
    player.addGold(reward)
    
    // Switch to walking state
    state.value = 'Walking'
    
    // Walk for 2 seconds then spawn new enemy
    setTimeout(() => {
      progressStage()
    }, 2000)
  }

  function progressStage() {
    // Progress stage
    subStage.value++
    if (subStage.value > 10) {
      subStage.value = 1
      stage.value++
    }

    // Reset HP and state
    enemyHp.value = enemyMaxHp.value
    state.value = 'Battling'
  }

  function toggleAutoBattle() {
    isAutoBattle.value = !isAutoBattle.value
  }

  return {
    stage,
    subStage,
    state,
    enemyMaxHp,
    enemyHp,
    isAutoBattle,
    damageEvents,
    attackEnemy,
    toggleAutoBattle,
  }
})
