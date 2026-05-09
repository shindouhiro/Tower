import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { usePlayerStore } from './player'

type BattleState = 'Walking' | 'Battling' | 'Transition'

export const useBattleStore = defineStore('battle', () => {
  const player = usePlayerStore()

  const stage = ref(1)
  const subStage = ref(6)

  const state = ref<BattleState>('Battling')

  const enemyMaxHp = computed(() => 100 * (1.5 ** stage.value) * (1.1 ** subStage.value))
  const enemyHp = ref(enemyMaxHp.value)

  const isAutoBattle = ref(false)

  const damageEvents = ref<{ id: number, damage: number, x: number, y: number }[]>([])
  let eventId = 0
  let defeatTimer: number | null = null

  function attackEnemy() {
    if (state.value !== 'Battling')
      return
    if (enemyHp.value <= 0)
      return

    const damage = player.attack
    enemyHp.value -= damage

    const id = eventId++
    damageEvents.value.push({
      id,
      damage,
      x: 50 + (Math.random() * 20 - 10),
      y: 50 + (Math.random() * 20 - 10),
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
      }, 320)
    }
  }

  function defeatEnemy() {
    const reward = 50 * (1.2 ** stage.value)
    player.addGold(reward)

    state.value = 'Walking'

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
