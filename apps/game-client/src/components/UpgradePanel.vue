<script setup lang="ts">
import { formatNumber } from '@tower/core'
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()
</script>

<template>
  <section class="upgrade-panel" aria-label="角色强化">
    <div class="total-power">
      <span class="power-icon">⚔️</span>
      <span>{{ formatNumber(player.totalPower) }}</span>
    </div>

    <div class="upgrade-list">
      <div class="upgrade-item">
        <div class="icon">
          🗡️<br><small>Lv.{{ player.attackLevel }}</small>
        </div>
        <div class="info">
          <div class="name">
            攻击力
          </div>
          <div class="value">
            {{ formatNumber(player.attack) }}
          </div>
        </div>
        <button
          id="upgrade-attack-button"
          type="button"
          class="upgrade-btn"
          :disabled="player.gold < player.attackUpgradeCost"
          @click="player.upgradeAttack"
        >
          <div class="label">
            强化
          </div>
          <div class="cost">
            🪙 {{ formatNumber(player.attackUpgradeCost) }}
          </div>
        </button>
      </div>

      <div class="upgrade-item">
        <div class="icon">
          ❤️<br><small>Lv.{{ player.healthLevel }}</small>
        </div>
        <div class="info">
          <div class="name">
            生命
          </div>
          <div class="value">
            {{ formatNumber(player.health) }}
          </div>
        </div>
        <button
          id="upgrade-health-button"
          type="button"
          class="upgrade-btn"
          :disabled="player.gold < player.healthUpgradeCost"
          @click="player.upgradeHealth"
        >
          <div class="label">
            强化
          </div>
          <div class="cost">
            🪙 {{ formatNumber(player.healthUpgradeCost) }}
          </div>
        </button>
      </div>

      <div class="upgrade-item">
        <div class="icon">
          💖<br><small>Lv.{{ player.regenLevel }}</small>
        </div>
        <div class="info">
          <div class="name">
            生命恢复
          </div>
          <div class="value">
            {{ formatNumber(player.regen) }}
          </div>
        </div>
        <button
          id="upgrade-regen-button"
          type="button"
          class="upgrade-btn"
          :disabled="player.gold < player.regenUpgradeCost"
          @click="player.upgradeRegen"
        >
          <div class="label">
            强化
          </div>
          <div class="cost">
            🪙 {{ formatNumber(player.regenUpgradeCost) }}
          </div>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.upgrade-panel {
  background:
    linear-gradient(180deg, rgba(114, 75, 43, 0.98), rgba(66, 42, 27, 0.98)),
    radial-gradient(circle at 50% 0, rgba(255, 220, 151, 0.2), transparent 48%);
  border-top: 1px solid rgba(255, 224, 165, 0.28);
  display: flex;
  flex-direction: column;
  box-shadow: 0 -10px 28px rgba(20, 12, 8, 0.24);
}

.total-power {
  background:
    linear-gradient(180deg, rgba(47, 31, 22, 0.96), rgba(24, 17, 13, 0.96)),
    radial-gradient(circle at 50% 0, rgba(255, 218, 140, 0.2), transparent 46%);
  color: #fff2c6;
  text-align: center;
  padding: 8px;
  font-weight: 900;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255, 226, 166, 0.18);
  text-shadow: 0 2px 0 #281408, 0 0 12px rgba(255, 193, 77, 0.34);
  letter-spacing: 0;
}

.power-icon {
  margin-right: 6px;
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
  background:
    linear-gradient(180deg, rgba(245, 222, 181, 0.98), rgba(194, 151, 96, 0.98)),
    radial-gradient(circle at 0 0, rgba(255, 255, 255, 0.32), transparent 30%);
  border-radius: 8px;
  padding: 8px 12px;
  border: 1px solid rgba(95, 55, 27, 0.5);
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.36),
    inset 0 -8px 14px rgba(94, 52, 22, 0.14),
    0 5px 14px rgba(29, 16, 10, 0.22);
}

.icon {
  text-align: center;
  font-size: 24px;
  width: 48px;
  line-height: 1.2;
  filter: drop-shadow(0 2px 1px rgba(70, 34, 13, 0.24));
}

.icon small {
  font-size: 10px;
  color: #6b3f1e;
  font-weight: bold;
}

.info {
  flex: 1;
  margin-left: 12px;
  color: #2f1d12;
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
  min-width: 84px;
  background: linear-gradient(180deg, #a5ed62, #3f8a34);
  border: 1px solid rgba(220, 255, 175, 0.72);
  border-radius: 8px;
  padding: 6px 16px;
  color: #fff;
  text-shadow: 0 1px 1px rgba(0,0,0,0.42);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.34),
    inset 0 -6px 10px rgba(24, 88, 31, 0.35),
    0 4px 10px rgba(36, 25, 12, 0.26);
}

.upgrade-btn:disabled {
  background: linear-gradient(180deg, #b9b0a1, #756d62);
  border-color: rgba(255, 255, 255, 0.2);
  color: #3c342e;
  text-shadow: none;
  transform: none;
  cursor: not-allowed;
  box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.15);
}

.upgrade-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow:
    inset 0 2px 8px rgba(15, 65, 22, 0.34),
    0 2px 6px rgba(36, 25, 12, 0.2);
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
