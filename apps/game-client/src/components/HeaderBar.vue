<script setup lang="ts">
import { usePlayerStore } from '../stores/player'
import { useBattleStore } from '../stores/battle'
import { formatNumber } from '@tower/core'

const player = usePlayerStore()
const battle = useBattleStore()
</script>

<template>
  <div class="header-container">
    <div class="top-row">
      <div class="avatar-box">
        <div class="avatar">👦</div>
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
  </div>
</template>

<style scoped>
.header-container {
  padding: 12px;
  background: linear-gradient(180deg, #8bc34a 0%, rgba(139, 195, 74, 0.5) 100%);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.top-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar-box {
  width: 48px;
  height: 48px;
  background: #f0f0f0;
  border-radius: 8px;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.currency-box {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 4px 12px;
  color: white;
  font-weight: bold;
  border: 1px solid rgba(255,255,255,0.2);
}

.currency-box .icon {
  margin-right: 4px;
}

.stage-info {
  text-align: center;
  font-weight: 800;
  font-size: 1.2rem;
  color: white;
  text-shadow: 1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
}
</style>
