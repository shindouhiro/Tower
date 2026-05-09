<script setup lang="ts">
import { useBattleStore } from '../stores/battle'
import { usePlayerStore } from '../stores/player'
import { formatNumber } from '@tower/core'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const battle = useBattleStore()
const player = usePlayerStore()

// Auto-battle loop
let autoBattleTimer: number | null = null

onMounted(() => {
  autoBattleTimer = window.setInterval(() => {
    if (battle.isAutoBattle && battle.state === 'Battling') {
      battle.attackEnemy()
    }
  }, 1000)
})

onUnmounted(() => {
  if (autoBattleTimer) clearInterval(autoBattleTimer)
})

const handleChallengeClick = () => {
  if (battle.state === 'Battling') {
    battle.attackEnemy()
  }
}
</script>

<template>
  <div class="battle-area" :class="{ 'is-walking': battle.state === 'Walking' }">
    <div class="background-layer"></div>

    <div class="boss-icon" @click="handleChallengeClick">
      <div class="enemy-icon-sprite">
        <img src="/assets/enemy.png" alt="enemy icon" />
      </div>
      <div v-if="battle.state === 'Battling'" class="click-hint">辅助点击</div>
      <div v-else class="click-hint">寻找怪物中...</div>
    </div>

    <div class="field">
      <!-- Player -->
      <div class="character player" :class="{ 'walking-anim': battle.state === 'Walking' }">
        <div class="sprite"><img src="/assets/hero.png" alt="Hero" /></div>
        <div class="hp-bar">
          <div class="fill" style="width: 100%"></div>
        </div>
      </div>

      <!-- Enemy -->
      <transition name="fade">
        <div v-if="battle.state === 'Battling'" class="character enemy">
          <div class="hp-text">{{ formatNumber(battle.enemyHp) }}</div>
          <div class="sprite"><img src="/assets/enemy.png" alt="Enemy" /></div>
          <div class="hp-bar">
            <div class="fill" :style="{ width: `${Math.max(0, (battle.enemyHp / battle.enemyMaxHp) * 100)}%` }"></div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Floating Damage Text -->
    <TransitionGroup name="float">
      <div
        v-for="dmg in battle.damageEvents"
        :key="dmg.id"
        class="floating-text"
        :style="{ left: `${dmg.x}%`, top: `${dmg.y}%` }"
      >
        -{{ formatNumber(dmg.damage) }}
      </div>
    </TransitionGroup>

    <!-- Auto Battle Toggle -->
    <div class="skills-bar">
      <button 
        class="auto-btn" 
        :class="{ active: battle.isAutoBattle }"
        @click="battle.toggleAutoBattle"
      >
        自动<br/>{{ battle.isAutoBattle ? '开' : '关' }}
      </button>
      <div class="skill-slot locked" v-for="i in 6" :key="i">🔒</div>
    </div>
  </div>
</template>

<style scoped>
.battle-area {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/assets/background.png');
  background-size: cover;
  background-position-x: 0;
  z-index: 0;
}

.is-walking .background-layer {
  animation: scrollBackground 2s linear infinite;
}

@keyframes scrollBackground {
  from { background-position-x: 0; }
  to { background-position-x: -200px; }
}

.boss-icon, .field, .skills-bar, .floating-text {
  position: relative;
  z-index: 1;
}

.boss-icon {
  margin: 16px auto;
  text-align: center;
  cursor: pointer;
  transition: transform 0.1s;
}

.boss-icon:active {
  transform: scale(0.9);
}

.enemy-icon-sprite {
  width: 64px;
  height: 64px;
  background: #ff4d4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 3px solid #fff;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.enemy-icon-sprite img {
  width: 120%;
  height: 120%;
  object-fit: cover;
}

.click-hint {
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-top: -10px;
  position: relative;
  z-index: 2;
}

.field {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  flex: 1;
  padding-bottom: 20px;
}

.character {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sprite {
  width: 120px;
  height: 120px;
  filter: drop-shadow(0 10px 5px rgba(0,0,0,0.5));
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.sprite img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.enemy .sprite img {
  transform: scaleX(-1); /* Face left */
}

/* Walking animation */
.walking-anim .sprite {
  animation: bounce 0.4s ease-in-out infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

/* Enemy fade in/out */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

.hp-text {
  font-weight: 900;
  color: white;
  text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
  margin-bottom: 4px;
}

.hp-bar {
  width: 60px;
  height: 8px;
  background: #333;
  border: 2px solid #000;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
}

.player .hp-bar .fill { background: #a0d911; height: 100%; transition: width 0.2s; }
.enemy .hp-bar .fill { background: #ff4d4f; height: 100%; transition: width 0.1s; }

.skills-bar {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: rgba(0,0,0,0.5);
  overflow-x: auto;
}

.auto-btn {
  background: #ffeb3b;
  border: 2px solid #f57f17;
  color: #333;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 0.8rem;
  font-weight: bold;
}

.auto-btn.active {
  background: #4caf50;
  color: white;
  border-color: #2e7d32;
}

.skill-slot {
  width: 48px;
  height: 48px;
  background: #555;
  border-radius: 8px;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  opacity: 0.8;
}

.floating-text {
  position: absolute;
  color: white;
  font-weight: 900;
  font-size: 1.5rem;
  text-shadow: 2px 2px 0 #ff4d4f, -1px -1px 0 #000;
  pointer-events: none;
  z-index: 10;
}

/* Float Animation */
.float-enter-active {
  animation: floatUp 0.8s ease-out forwards;
}

@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  50% { transform: translateY(-40px) scale(1.5); opacity: 1; }
  100% { transform: translateY(-80px) scale(1); opacity: 0; }
}
</style>
