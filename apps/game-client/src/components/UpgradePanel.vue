<script setup lang="ts">
import { usePlayerStore } from '../stores/player'
import { formatNumber } from '@tower/core'

const player = usePlayerStore()
</script>

<template>
  <div class="upgrade-panel">
    <div class="total-power">
      ⚔️ {{ formatNumber(player.totalPower) }}
    </div>

    <div class="upgrade-list">
      <!-- Attack -->
      <div class="upgrade-item">
        <div class="icon">🗡️<br/><small>Lv.{{ player.attackLevel }}</small></div>
        <div class="info">
          <div class="name">攻击力</div>
          <div class="value">{{ formatNumber(player.attack) }}</div>
        </div>
        <button 
          class="upgrade-btn" 
          :disabled="player.gold < player.attackUpgradeCost"
          @click="player.upgradeAttack"
        >
          <div class="label">强化</div>
          <div class="cost">🪙 {{ formatNumber(player.attackUpgradeCost) }}</div>
        </button>
      </div>

      <!-- Health -->
      <div class="upgrade-item">
        <div class="icon">❤️<br/><small>Lv.{{ player.healthLevel }}</small></div>
        <div class="info">
          <div class="name">生命</div>
          <div class="value">{{ formatNumber(player.health) }}</div>
        </div>
        <button 
          class="upgrade-btn" 
          :disabled="player.gold < player.healthUpgradeCost"
          @click="player.upgradeHealth"
        >
          <div class="label">强化</div>
          <div class="cost">🪙 {{ formatNumber(player.healthUpgradeCost) }}</div>
        </button>
      </div>

      <!-- Health Regen -->
      <div class="upgrade-item">
        <div class="icon">💖<br/><small>Lv.{{ player.regenLevel }}</small></div>
        <div class="info">
          <div class="name">生命恢复</div>
          <div class="value">{{ formatNumber(player.regen) }}</div>
        </div>
        <button 
          class="upgrade-btn" 
          :disabled="player.gold < player.regenUpgradeCost"
          @click="player.upgradeRegen"
        >
          <div class="label">强化</div>
          <div class="cost">🪙 {{ formatNumber(player.regenUpgradeCost) }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.upgrade-panel {
  background-color: var(--panel-bg);
  border-top: 4px solid #5a422e;
  display: flex;
  flex-direction: column;
}

.total-power {
  background: #5a422e;
  color: white;
  text-align: center;
  padding: 8px;
  font-weight: 900;
  font-size: 1.1rem;
}

.upgrade-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upgrade-item {
  display: flex;
  align-items: center;
  background: #e6d5b8;
  border-radius: 8px;
  padding: 8px 12px;
  border: 2px solid #bba585;
}

.icon {
  text-align: center;
  font-size: 24px;
  width: 48px;
  line-height: 1.2;
}

.icon small {
  font-size: 10px;
  color: #666;
  font-weight: bold;
}

.info {
  flex: 1;
  margin-left: 12px;
  color: #333;
}

.name {
  font-weight: bold;
  font-size: 0.9rem;
}

.value {
  font-weight: 900;
  font-size: 1.1rem;
}

.upgrade-btn {
  background: #a0d911;
  border: 2px solid #5b8c00;
  border-bottom-width: 4px;
  border-radius: 8px;
  padding: 6px 16px;
  color: #fff;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upgrade-btn:disabled {
  background: #ccc;
  border-color: #999;
  color: #666;
  text-shadow: none;
  transform: none;
  cursor: not-allowed;
}

.upgrade-btn:active:not(:disabled) {
  border-bottom-width: 2px;
  transform: translateY(2px);
}

.label {
  font-weight: bold;
  font-size: 0.9rem;
}

.cost {
  font-size: 0.8rem;
  font-weight: bold;
}
</style>
