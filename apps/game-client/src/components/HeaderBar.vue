<script setup lang="ts">
import { formatNumber } from '@tower/core'
import { computed } from 'vue'
import { useBattleStore } from '../stores/battle'
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()
const battle = useBattleStore()

const expPercent = computed(() => Math.min(100, (player.exp / player.levelUpThreshold) * 100))
</script>

<template>
  <header class="header-container" aria-label="玩家状态">
    <div class="top-row">
      <div class="avatar-box">
        <img class="avatar" src="/assets/hero-cutout.webp" alt="英雄头像">
        <div class="level-badge">{{ player.playerLevel }}</div>
      </div>
      <div class="player-info">
        <div class="exp-row">
          <span class="exp-label">Lv.{{ player.playerLevel }}</span>
          <div class="exp-bar">
            <div class="exp-fill" :style="{ width: `${expPercent}%` }" />
          </div>
          <span class="exp-text">{{ formatNumber(player.exp) }}/{{ formatNumber(player.levelUpThreshold) }}</span>
        </div>
        <div class="currency-row">
          <div class="currency-box gold">
            <span class="icon">🪙</span>
            <span class="value">{{ formatNumber(player.gold) }}</span>
          </div>
          <div class="currency-box gems">
            <span class="icon">💎</span>
            <span class="value">{{ player.gems }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="stage-info">
      <span class="zone-name">{{ battle.currentMonster.zoneName }}</span>
      <span class="stage-num">{{ battle.stage }}-{{ battle.subStage }}</span>
      <span v-if="battle.isBoss" class="boss-tag">BOSS</span>
      <span class="refresh-icon">🔄</span>
    </div>
  </header>
</template>

<style scoped>
.header-container {
  padding: 10px 12px 8px;
  background:
    linear-gradient(180deg, rgba(87, 59, 34, 0.98), rgba(33, 24, 18, 0.96)),
    radial-gradient(circle at 50% 0, rgba(255, 221, 145, 0.26), transparent 58%);
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-bottom: 1px solid rgba(255, 221, 151, 0.24);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.22);
  position: relative;
  z-index: 5;
}

.top-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-box {
  width: 44px;
  height: 44px;
  background:
    radial-gradient(circle at 52% 38%, rgba(255, 242, 194, 0.95), rgba(156, 95, 43, 0.82) 64%, rgba(57, 32, 18, 0.96));
  border-radius: 8px;
  border: 1px solid rgba(255, 225, 158, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.35),
    inset 0 -7px 12px rgba(55, 22, 9, 0.36),
    0 4px 12px rgba(0, 0, 0, 0.28);
}

.avatar {
  width: 130%;
  height: 130%;
  object-fit: contain;
  object-position: 42% 22%;
  transform: translateY(15px);
}

.level-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: linear-gradient(135deg, #f7d071, #a45b22);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 900;
  padding: 1px 4px;
  border-radius: 4px;
  border: 1px solid rgba(255, 230, 170, 0.7);
  text-shadow: 0 1px 1px rgba(0,0,0,0.4);
  line-height: 1.2;
}

.player-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exp-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.exp-label {
  color: #ffe8a8;
  font-weight: 900;
  font-size: 0.75rem;
  flex-shrink: 0;
  text-shadow: 0 1px 0 rgba(0,0,0,0.4);
}

.exp-bar {
  flex: 1;
  height: 6px;
  background: rgba(20, 14, 10, 0.8);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(255, 225, 158, 0.18);
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #a78bfa, #e879f9);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.exp-text {
  color: #c4a878;
  font-size: 0.6rem;
  flex-shrink: 0;
  font-weight: 600;
}

.currency-row {
  display: flex;
  gap: 6px;
}

.currency-box {
  display: flex;
  align-items: center;
  min-height: 28px;
  background:
    linear-gradient(180deg, rgba(38, 26, 19, 0.94), rgba(15, 11, 9, 0.94)),
    radial-gradient(circle at 18% 0, rgba(255, 231, 166, 0.18), transparent 40%);
  border-radius: 14px;
  padding: 3px 10px;
  color: #fff0c2;
  font-weight: bold;
  font-size: 0.8rem;
  border: 1px solid rgba(255, 225, 158, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 4px 10px rgba(0, 0, 0, 0.2);
  letter-spacing: 0;
}

.currency-box .icon {
  margin-right: 4px;
  font-size: 0.85rem;
}

.stage-info {
  text-align: center;
  font-weight: 800;
  font-size: 1.1rem;
  color: #fff3c9;
  text-shadow: 0 2px 0 #2c160d, 0 0 12px rgba(255, 207, 102, 0.38);
  letter-spacing: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.zone-name {
  color: #ffe8b8;
}

.stage-num {
  color: #fff6d8;
}

.boss-tag {
  background: linear-gradient(135deg, #ff4444, #cc0000);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 900;
  padding: 1px 6px;
  border-radius: 4px;
  animation: bossPulse 1.2s ease-in-out infinite alternate;
}

@keyframes bossPulse {
  from { box-shadow: 0 0 4px rgba(255, 0, 0, 0.4); }
  to { box-shadow: 0 0 12px rgba(255, 0, 0, 0.8); }
}

.refresh-icon {
  font-size: 0.9rem;
  cursor: pointer;
}
</style>
