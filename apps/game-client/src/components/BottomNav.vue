<script setup lang="ts">
import { ref } from 'vue'

const tabs = ref([
  { id: 'character', name: '角色', icon: '👑', active: true, locked: false },
  { id: 'territory', name: '领地', icon: '⛺', active: false, locked: true },
  { id: 'dungeon', name: '副本', icon: '⚔️', active: false, locked: true },
  { id: 'guild', name: '公会', icon: '🛡️', active: false, locked: true },
  { id: 'summon', name: '召唤', icon: '🔮', active: false, locked: true },
])
</script>

<template>
  <div class="bottom-nav">
    <div 
      v-for="tab in tabs" 
      :key="tab.id"
      class="nav-item"
      :class="{ active: tab.active, locked: tab.locked }"
    >
      <div class="icon">{{ tab.icon }}</div>
      <div class="name">{{ tab.name }}</div>
      <div v-if="tab.locked" class="lock-overlay">🔒</div>
    </div>
  </div>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  background: #2a2a2a;
  border-top: 2px solid #000;
  padding: 8px 0 12px;
  justify-content: space-around;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item.active {
  color: #ffd700;
  transform: translateY(-4px);
}

.icon {
  font-size: 24px;
  margin-bottom: 4px;
  filter: grayscale(100%);
}

.nav-item.active .icon {
  filter: none;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.name {
  font-size: 0.75rem;
  font-weight: bold;
}

.locked {
  opacity: 0.6;
}

.lock-overlay {
  position: absolute;
  top: -8px;
  right: 12px;
  font-size: 16px;
}
</style>
