<script setup lang="ts">
import { formatNumber } from '@tower/core'
import { computed, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import { useBattleStore } from '../stores/battle'

const battle = useBattleStore()

let autoBattleTimer: number | null = null
let impactTimer: number | null = null
let enemyImpactTimer: number | null = null
const hasImpact = shallowRef(false)
const hasEnemyImpact = shallowRef(false)

const enemyHpPercent = computed(() => Math.max(0, (battle.enemyHp / battle.enemyMaxHp) * 100))
const heroHpPercent = computed(() => Math.max(0, (battle.heroHp / battle.heroMaxHp) * 100))

onMounted(() => {
  autoBattleTimer = window.setInterval(() => {
    if (battle.isAutoBattle && battle.state === 'Battling') {
      battle.attackEnemy()
    }
  }, 1000)
})

onUnmounted(() => {
  if (autoBattleTimer)
    clearInterval(autoBattleTimer)
  if (impactTimer)
    clearTimeout(impactTimer)
  if (enemyImpactTimer)
    clearTimeout(enemyImpactTimer)
  battle.stopBattleTimers()
})

function playImpact() {
  hasImpact.value = true
  if (impactTimer)
    clearTimeout(impactTimer)
  impactTimer = window.setTimeout(() => {
    hasImpact.value = false
  }, 760)
}

function playEnemyImpact() {
  hasEnemyImpact.value = true
  if (enemyImpactTimer)
    clearTimeout(enemyImpactTimer)
  enemyImpactTimer = window.setTimeout(() => {
    hasEnemyImpact.value = false
  }, 600)
}

function handleChallengeClick() {
  if (battle.state === 'Battling') {
    playImpact()
    battle.attackEnemy()
  }
}

watch(
  () => battle.attackSequence,
  (seq, prev) => {
    if (seq <= 0 || seq === prev) return
    playImpact()
  },
)

watch(
  () => battle.enemyAttackSequence,
  (seq, prev) => {
    if (seq <= 0 || seq === prev) return
    playEnemyImpact()
  },
)
</script>

<template>
  <section
    class="battle-area"
    :class="{ 'is-walking': battle.state === 'Walking', 'has-impact': hasImpact, 'has-enemy-impact': hasEnemyImpact, 'is-dead': battle.state === 'Dead' }"
    aria-label="战斗区域"
  >
    <div class="background-layer" />
    <div class="atmosphere-layer" :style="{ background: battle.currentMonster.atmosphereColor }" />
    <div class="dust-layer" />

    <button id="battle-challenge-target" type="button" class="boss-icon" :class="{ 'is-boss': battle.isBoss }" @click="handleChallengeClick">
      <div class="enemy-icon-sprite">
        <img :src="battle.currentMonster.image" :alt="battle.currentMonster.name">
      </div>
      <div v-if="battle.isBoss" class="boss-badge">BOSS</div>
      <div v-if="battle.state === 'Battling'" class="click-hint">
        {{ battle.isBoss ? battle.currentMonster.bossName : battle.currentMonster.name }}
      </div>
      <div v-else-if="battle.state === 'Dead'" class="click-hint dead-hint">
        💀 战败...
      </div>
      <div v-else class="click-hint">
        寻找怪物中...
      </div>
    </button>

    <div class="field">
      <div class="character player" :class="{ 'walking-anim': battle.state === 'Walking' }">
        <div class="aura" />
        <div class="ground-shadow" />
        <div class="weapon-slash" />
        <div class="sprite">
          <img src="/assets/hero-cutout.webp" alt="英雄">
        </div>
        <div class="hp-bar">
          <div class="fill" :style="{ width: `${heroHpPercent}%` }" />
        </div>
        <div class="hp-text hero-hp-text">
          {{ formatNumber(battle.heroHp) }}
        </div>
      </div>

      <div class="attack-arc" />

      <transition name="fade">
        <div v-if="battle.state === 'Battling'" class="character enemy">
          <div class="hp-text">
            {{ formatNumber(battle.enemyHp) }}
          </div>
          <div class="impact-spark" />
          <div class="ground-shadow" />
          <div class="sprite">
            <img :src="battle.currentMonster.image" :alt="battle.currentMonster.name">
          </div>
          <div class="hp-bar">
            <div class="fill" :style="{ width: `${enemyHpPercent}%` }" />
          </div>
        </div>
      </transition>
    </div>

    <TransitionGroup name="float">
      <div
        v-for="dmg in battle.damageEvents"
        :key="dmg.id"
        class="floating-text"
        :class="{ 'enemy-dmg': dmg.type === 'enemy' }"
        :style="{ left: `${dmg.x}%`, top: `${dmg.y}%` }"
      >
        -{{ formatNumber(dmg.damage) }}
      </div>
    </TransitionGroup>

    <Transition name="fade">
      <div v-if="battle.state === 'Dead'" class="death-overlay">
        <div class="death-text">💀 战败</div>
        <div class="death-sub">回退至上一关...</div>
      </div>
    </Transition>

    <div class="skills-bar">
      <button
        id="battle-auto-toggle"
        type="button"
        class="auto-btn"
        :class="{ active: battle.isAutoBattle }"
        @click="battle.toggleAutoBattle"
      >
        <span class="auto-label">自动</span>
        <span class="auto-state">{{ battle.isAutoBattle ? '开' : '关' }}</span>
      </button>
      <div v-for="i in 6" :key="i" class="skill-slot locked">
        <span class="lock-icon" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.battle-area {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background: #4f321e;
  isolation: isolate;
}

.background-layer {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(180deg, rgba(30, 18, 12, 0.05) 0%, rgba(35, 17, 8, 0.38) 72%, rgba(16, 11, 8, 0.8) 100%),
    url('/assets/background-scene.webp');
  background-size: cover;
  background-position: center 48%;
  transform: scale(1.08);
  z-index: 0;
}

.is-walking .background-layer {
  animation: scrollBackground 2.8s linear infinite;
}

.atmosphere-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(circle at 76% 22%, rgba(255, 210, 108, 0.28), transparent 20%),
    linear-gradient(90deg, rgba(255, 245, 214, 0.16), transparent 24%, transparent 72%, rgba(92, 42, 18, 0.28)),
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 46%, rgba(26, 17, 12, 0.42));
  mix-blend-mode: screen;
}

.dust-layer {
  position: absolute;
  left: -10%;
  right: -10%;
  bottom: -8%;
  height: 32%;
  z-index: 2;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 20% 70%, rgba(245, 185, 95, 0.25), transparent 32%),
    radial-gradient(ellipse at 72% 76%, rgba(255, 214, 141, 0.22), transparent 30%),
    linear-gradient(180deg, transparent, rgba(68, 35, 17, 0.48));
  filter: blur(10px);
  opacity: 0.9;
}

.has-impact {
  animation: cameraImpact 0.18s ease-out;
}

@keyframes scrollBackground {
  from {
    background-position: center 48%;
  }
  to {
    background-position: calc(50% - 180px) 48%;
  }
}

@keyframes cameraImpact {
  0% { transform: translate3d(0, 0, 0); }
  35% { transform: translate3d(-3px, 2px, 0); }
  70% { transform: translate3d(2px, -1px, 0); }
  100% { transform: translate3d(0, 0, 0); }
}

.boss-icon, .field, .skills-bar, .floating-text {
  position: relative;
  z-index: 3;
}

.boss-icon {
  margin: 8px auto 4px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease;
  background: transparent;
  color: inherit;
  padding: 0;
  border: 0;
}

.boss-icon:active {
  transform: scale(0.94);
  filter: brightness(1.08);
}

.enemy-icon-sprite {
  width: 58px;
  height: 58px;
  background:
    radial-gradient(circle at 50% 36%, rgba(255, 236, 170, 0.95), rgba(175, 61, 31, 0.82) 58%, rgba(65, 20, 18, 0.96));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: 2px solid rgba(255, 236, 182, 0.95);
  overflow: hidden;
  box-shadow:
    inset 0 2px 8px rgba(255, 255, 255, 0.42),
    inset 0 -10px 18px rgba(81, 23, 18, 0.5),
    0 10px 22px rgba(29, 13, 7, 0.42);
}

.enemy-icon-sprite img {
  width: 96%;
  height: 96%;
  object-fit: contain;
  transform: translateY(8px);
}

.click-hint {
  background: linear-gradient(180deg, rgba(54, 35, 21, 0.88), rgba(22, 14, 10, 0.9));
  color: #fff1c5;
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-top: -10px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 222, 151, 0.42);
  box-shadow: 0 5px 14px rgba(0, 0, 0, 0.28);
}

.field {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  flex: 1;
  padding: 0 18px 30px;
  perspective: 700px;
}

.character {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 112px;
}

.sprite {
  width: clamp(98px, 27vw, 132px);
  height: clamp(108px, 29vw, 142px);
  filter: drop-shadow(0 10px 5px rgba(0,0,0,0.5));
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  z-index: 2;
  transform-origin: 50% 86%;
}

.sprite img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.player .sprite img {
  transform: scaleX(-1);
}

.enemy .sprite img {
  /* 怪物素材默认面朝英雄方向，无需翻转 */
}

.aura {
  position: absolute;
  bottom: 38px;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 224, 124, 0.24), transparent 68%);
  filter: blur(2px);
  z-index: 1;
  animation: auraPulse 2.4s ease-in-out infinite;
}

.ground-shadow {
  position: absolute;
  bottom: 19px;
  width: 118px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(25, 12, 7, 0.55), rgba(25, 12, 7, 0.16) 62%, transparent 72%);
  transform: rotateX(64deg);
  z-index: 1;
}

.enemy .ground-shadow {
  width: 128px;
  bottom: 21px;
}

.attack-arc {
  position: absolute;
  left: 36%;
  bottom: 62px;
  width: 190px;
  height: 126px;
  opacity: 0;
  pointer-events: none;
  z-index: 6;
  transform-origin: 0 100%;
}

.attack-arc::before {
  content: "";
  position: absolute;
  inset: 0;
  border-top: 10px solid rgba(255, 252, 220, 0.98);
  border-right: 5px solid rgba(255, 178, 58, 0.85);
  border-radius: 78% 92% 10% 50%;
  transform: rotate(-18deg);
  filter:
    drop-shadow(0 0 7px rgba(255, 246, 177, 0.95))
    drop-shadow(0 0 18px rgba(255, 102, 43, 0.72));
}

.attack-arc::after {
  content: "";
  position: absolute;
  right: 22px;
  top: 48px;
  width: 92px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, rgba(255, 249, 204, 0.98), rgba(255, 122, 54, 0));
  transform: rotate(-24deg);
  filter: blur(0.6px);
}

.weapon-slash {
  position: absolute;
  top: 24%;
  right: -72px;
  width: 132px;
  height: 104px;
  opacity: 0;
  pointer-events: none;
  z-index: 5;
  transform-origin: 20% 80%;
}

.weapon-slash::before {
  content: "";
  position: absolute;
  inset: 10px 4px 18px 8px;
  border-top: 8px solid rgba(255, 246, 202, 0.96);
  border-right: 4px solid rgba(255, 197, 75, 0.72);
  border-radius: 50% 80% 20% 50%;
  filter: drop-shadow(0 0 10px rgba(255, 206, 92, 0.88)) drop-shadow(0 0 18px rgba(255, 111, 41, 0.52));
}

.weapon-slash::after {
  content: "";
  position: absolute;
  right: 14px;
  top: 42px;
  width: 62px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 242, 180, 0), rgba(255, 242, 180, 0.98), rgba(255, 121, 55, 0));
  transform: rotate(-18deg);
  filter: blur(0.4px);
}

.impact-spark {
  position: absolute;
  top: 42%;
  left: 38%;
  width: 72px;
  height: 72px;
  opacity: 0;
  pointer-events: none;
  z-index: 4;
  background:
    linear-gradient(90deg, transparent 46%, rgba(255, 255, 255, 0.96) 47%, rgba(255, 255, 255, 0.96) 53%, transparent 54%),
    linear-gradient(0deg, transparent 46%, rgba(255, 198, 80, 0.92) 47%, rgba(255, 198, 80, 0.92) 53%, transparent 54%);
  filter: drop-shadow(0 0 14px rgba(255, 156, 36, 0.9));
}

.has-impact .impact-spark {
  animation: impactSpark 0.68s ease-out;
}

.has-impact .enemy .sprite {
  animation: enemyHit 0.76s ease-out;
}

.has-impact .player .sprite {
  animation: heroStrike 0.76s cubic-bezier(0.16, 0.84, 0.24, 1);
}

.has-impact .weapon-slash {
  animation: weaponSlash 0.76s ease-out;
}

.has-impact .attack-arc {
  animation: attackArc 0.76s ease-out;
}

.walking-anim .sprite {
  animation: bounce 0.4s ease-in-out infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

@keyframes auraPulse {
  0%, 100% { transform: scale(0.9); opacity: 0.45; }
  50% { transform: scale(1.1); opacity: 0.75; }
}

@keyframes enemyHit {
  0% { transform: translateX(0) rotate(0) scale(1); filter: brightness(1); }
  42% { transform: translateX(16px) rotate(3deg) scale(1.04); filter: brightness(1.55) saturate(1.35); }
  100% { transform: translateX(0) rotate(0) scale(1); filter: brightness(1); }
}

@keyframes heroStrike {
  0% { transform: translateX(0) rotate(0) scale(1); filter: brightness(1); }
  24% { transform: translateX(8px) rotate(-8deg) scale(1.02); filter: brightness(1.08); }
  48% { transform: translateX(34px) rotate(8deg) scale(1.08); filter: brightness(1.18); }
  100% { transform: translateX(0) rotate(0) scale(1); filter: brightness(1); }
}

@keyframes weaponSlash {
  0% { transform: translate(-18px, 22px) rotate(-44deg) scale(0.55); opacity: 0; }
  25% { opacity: 1; }
  58% { transform: translate(26px, -10px) rotate(14deg) scale(1.08); opacity: 1; }
  100% { transform: translate(48px, -22px) rotate(24deg) scale(1.2); opacity: 0; }
}

@keyframes attackArc {
  0% { transform: translate(-42px, 26px) rotate(-38deg) scale(0.48); opacity: 0; }
  18% { opacity: 1; }
  52% { transform: translate(22px, -4px) rotate(4deg) scale(1.02); opacity: 1; }
  100% { transform: translate(48px, -20px) rotate(16deg) scale(1.18); opacity: 0; }
}

@keyframes impactSpark {
  0% { transform: scale(0.35) rotate(12deg); opacity: 0; }
  35% { transform: scale(1.25) rotate(12deg); opacity: 1; }
  100% { transform: scale(1.8) rotate(12deg); opacity: 0; }
}

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
  color: #fff8dd;
  text-shadow: 0 2px 0 #3a170f, 0 0 12px rgba(255, 91, 54, 0.7);
  margin-bottom: 4px;
  letter-spacing: 0;
}

.hp-bar {
  width: 74px;
  height: 9px;
  background: rgba(35, 18, 13, 0.88);
  border: 1px solid rgba(255, 231, 176, 0.52);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.46), 0 2px 8px rgba(0, 0, 0, 0.26);
}

.player .hp-bar .fill {
  background: linear-gradient(90deg, #5fd36d, #d9ff7a);
  height: 100%;
  transition: width 0.2s;
}

.enemy .hp-bar .fill {
  background: linear-gradient(90deg, #ff493c, #ffbd62);
  height: 100%;
  transition: width 0.1s;
}

.skills-bar {
  display: flex;
  gap: 8px;
  padding: 10px 10px 12px;
  background:
    linear-gradient(180deg, rgba(43, 26, 17, 0.84), rgba(18, 13, 10, 0.94)),
    radial-gradient(circle at 50% 0, rgba(255, 218, 147, 0.22), transparent 42%);
  border-top: 1px solid rgba(255, 218, 147, 0.28);
  overflow-x: auto;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.26);
}

.auto-btn {
  min-width: 54px;
  min-height: 50px;
  background: linear-gradient(180deg, #f7d071, #a45b22);
  border: 1px solid rgba(255, 237, 178, 0.72);
  color: #281409;
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.38),
    inset 0 -5px 10px rgba(71, 28, 10, 0.32),
    0 5px 12px rgba(0, 0, 0, 0.28);
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
}

.auto-label,
.auto-state {
  display: block;
}

.auto-btn.active {
  background: linear-gradient(180deg, #96f39b, #23763c);
  color: white;
  border-color: rgba(213, 255, 196, 0.78);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.45);
}

.skill-slot {
  width: 50px;
  height: 50px;
  flex: 0 0 50px;
  background:
    linear-gradient(180deg, rgba(99, 79, 58, 0.96), rgba(46, 32, 23, 0.98)),
    radial-gradient(circle at 50% 20%, rgba(255, 244, 207, 0.2), transparent 34%);
  border-radius: 8px;
  border: 1px solid rgba(255, 226, 159, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.12),
    inset 0 -8px 12px rgba(0, 0, 0, 0.26),
    0 4px 10px rgba(0, 0, 0, 0.22);
}

.lock-icon {
  width: 18px;
  height: 15px;
  position: relative;
  border-radius: 3px;
  background: linear-gradient(180deg, #d5b276, #7e5a2f);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.38);
}

.lock-icon::before {
  content: "";
  position: absolute;
  left: 3px;
  top: -10px;
  width: 12px;
  height: 12px;
  border: 3px solid #b99255;
  border-bottom: 0;
  border-radius: 9px 9px 0 0;
}

.floating-text {
  position: absolute;
  color: #fff6d7;
  font-weight: 900;
  font-size: 1.5rem;
  text-shadow: 0 2px 0 #7c1f14, 0 0 18px rgba(255, 109, 41, 0.82);
  pointer-events: none;
  z-index: 10;
  letter-spacing: 0;
}

.float-enter-active {
  animation: floatUp 0.8s ease-out forwards;
}

@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  50% { transform: translateY(-40px) scale(1.5); opacity: 1; }
  100% { transform: translateY(-80px) scale(1); opacity: 0; }
}

/* Enemy damage floats - red color */
.floating-text.enemy-dmg {
  color: #ff6b6b;
  text-shadow: 0 2px 0 #4a0e0e, 0 0 18px rgba(255, 40, 40, 0.82);
}

/* Hero HP text under bar */
.hero-hp-text {
  font-size: 0.7rem;
  font-weight: 900;
  color: #d4ffda;
  text-shadow: 0 1px 0 #1a3a1e, 0 0 8px rgba(95, 211, 109, 0.5);
  margin-top: 2px;
}

/* Enemy impact - hero gets hit */
.has-enemy-impact .player .sprite {
  animation: heroHit 0.5s ease-out;
}

@keyframes heroHit {
  0% { filter: brightness(1); }
  30% { filter: brightness(2) saturate(0.5); transform: translateX(-8px); }
  60% { filter: brightness(1.3); transform: translateX(4px); }
  100% { filter: brightness(1); transform: translateX(0); }
}

/* Death state */
.is-dead .player .sprite {
  animation: heroDeath 1.2s ease-out forwards;
}

@keyframes heroDeath {
  0% { transform: scaleX(-1) rotate(0); opacity: 1; filter: brightness(1); }
  40% { transform: scaleX(-1) rotate(-15deg); filter: brightness(1.5) saturate(0.3); }
  100% { transform: scaleX(-1) rotate(-90deg) translateY(20px); opacity: 0.3; filter: brightness(0.5) saturate(0); }
}

.death-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(10, 5, 3, 0.7);
  backdrop-filter: blur(2px);
}

.death-text {
  font-size: 2.2rem;
  font-weight: 900;
  color: #ff4444;
  text-shadow: 0 3px 0 #2a0808, 0 0 30px rgba(255, 40, 40, 0.6);
  animation: deathPulse 1s ease-in-out infinite alternate;
}

.death-sub {
  font-size: 0.9rem;
  color: #ffccaa;
  margin-top: 8px;
  opacity: 0.8;
}

@keyframes deathPulse {
  from { transform: scale(1); }
  to { transform: scale(1.08); }
}

/* BOSS badge */
.boss-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  background: linear-gradient(135deg, #ff4444, #cc0000);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 200, 200, 0.6);
  text-shadow: 0 1px 1px rgba(0,0,0,0.5);
  animation: bossPulse 1.2s ease-in-out infinite alternate;
  z-index: 5;
}

@keyframes bossPulse {
  from { box-shadow: 0 0 6px rgba(255, 0, 0, 0.5); }
  to { box-shadow: 0 0 16px rgba(255, 0, 0, 0.9); }
}

.is-boss .enemy-icon-sprite {
  border-color: rgba(255, 80, 80, 0.95);
  box-shadow:
    inset 0 2px 8px rgba(255, 100, 100, 0.42),
    inset 0 -10px 18px rgba(120, 10, 10, 0.5),
    0 10px 22px rgba(200, 0, 0, 0.42);
}

.dead-hint {
  color: #ff8888;
}
</style>
