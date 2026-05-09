<script setup lang="ts">
import HeaderBar from './components/HeaderBar.vue'
import BattleArea from './components/BattleArea.vue'
import UpgradePanel from './components/UpgradePanel.vue'
import BottomNav from './components/BottomNav.vue'
</script>

<template>
  <div class="game-container">
    <HeaderBar class="header" />
    <BattleArea class="battle" />
    <UpgradePanel class="upgrades" />
    <BottomNav class="nav" />
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.header {
  flex-shrink: 0;
}

.battle {
  flex: 1;
  min-height: 0; /* Important for flex children */
}

.upgrades {
  flex-shrink: 0;
  height: 40%;
  max-height: 400px;
}

.nav {
  flex-shrink: 0;
}
</style>
