<script setup lang="ts">
import { formatNumber } from '@tower/core'
import { useBattleStore } from '../stores/battle'
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()
const battle = useBattleStore()
</script>

<template>
  <header class="header-container" aria-label="玩家状态">
    <div class="top-row">
      <div class="avatar-box">
        <img class="avatar" src="/assets/hero-cutout.webp" alt="英雄头像">
      </div>
      <div class="currency-box gold">
        <span class="icon">🪙</span>
        <span class="value">{{ formatNumber(player.gold) }}</span>
      </div>
      <div class="currency-box gems">
        <span class="icon">💎</span>
        <span class="value">{{ player.gems }}</span>
      </div>
    </div>

    <div class="stage-info">
      普通 {{ battle.stage }}-{{ battle.subStage }} 🔄
    </div>
  </header>
</template>

<style scoped>
.header-container {
  padding: 12px 12px 10px;
  background:
    linear-gradient(180deg, rgba(87, 59, 34, 0.98), rgba(33, 24, 18, 0.96)),
    radial-gradient(circle at 50% 0, rgba(255, 221, 145, 0.26), transparent 58%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 221, 151, 0.24);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.22);
  position: relative;
  z-index: 5;
}

.top-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-box {
  width: 48px;
  height: 48px;
  background:
    radial-gradient(circle at 52% 38%, rgba(255, 242, 194, 0.95), rgba(156, 95, 43, 0.82) 64%, rgba(57, 32, 18, 0.96));
  border-radius: 8px;
  border: 1px solid rgba(255, 225, 158, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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

.currency-box {
  display: flex;
  align-items: center;
  min-height: 34px;
  background:
    linear-gradient(180deg, rgba(38, 26, 19, 0.94), rgba(15, 11, 9, 0.94)),
    radial-gradient(circle at 18% 0, rgba(255, 231, 166, 0.18), transparent 40%);
  border-radius: 20px;
  padding: 5px 12px;
  color: #fff0c2;
  font-weight: bold;
  border: 1px solid rgba(255, 225, 158, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 4px 10px rgba(0, 0, 0, 0.2);
  letter-spacing: 0;
}

.currency-box .icon {
  margin-right: 4px;
}

.stage-info {
  text-align: center;
  font-weight: 800;
  font-size: 1.2rem;
  color: #fff3c9;
  text-shadow: 0 2px 0 #2c160d, 0 0 12px rgba(255, 207, 102, 0.38);
  letter-spacing: 0;
}
</style>
