<script setup lang="ts">
const tabs = [
  { id: 'character', name: '角色', icon: '👑', active: true, locked: false },
  { id: 'territory', name: '领地', icon: '⛺', active: false, locked: true },
  { id: 'dungeon', name: '副本', icon: '⚔️', active: false, locked: true },
  { id: 'guild', name: '公会', icon: '🛡️', active: false, locked: true },
  { id: 'summon', name: '召唤', icon: '🔮', active: false, locked: true },
] as const
</script>

<template>
  <nav class="bottom-nav" aria-label="主导航">
    <button
      v-for="tab in tabs"
      :id="`nav-${tab.id}-button`"
      :key="tab.id"
      type="button"
      class="nav-item"
      :class="{ active: tab.active, locked: tab.locked }"
      :disabled="tab.locked"
    >
      <div class="icon">
        {{ tab.icon }}
      </div>
      <div class="name">
        {{ tab.name }}
      </div>
      <div v-if="tab.locked" class="lock-overlay" />
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: flex;
  background:
    linear-gradient(180deg, rgba(33, 25, 20, 0.98), rgba(12, 10, 9, 0.98)),
    radial-gradient(circle at 50% 0, rgba(255, 225, 156, 0.14), transparent 48%);
  border-top: 1px solid rgba(255, 225, 156, 0.18);
  padding: 8px 0 12px;
  justify-content: space-around;
  box-shadow: 0 -8px 22px rgba(0, 0, 0, 0.22);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  min-width: 0;
  color: #a89479;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: 0;
}

.nav-item.active {
  color: #ffe08c;
  transform: translateY(-4px);
}

.icon {
  font-size: 24px;
  margin-bottom: 4px;
  filter: grayscale(100%);
  width: 38px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: linear-gradient(180deg, rgba(91, 68, 47, 0.7), rgba(34, 25, 20, 0.72));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.nav-item.active .icon {
  filter: none;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  background: linear-gradient(180deg, rgba(127, 84, 37, 0.9), rgba(64, 36, 20, 0.92));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    0 6px 12px rgba(0, 0, 0, 0.18);
}

.name {
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0;
}

.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.lock-overlay {
  position: absolute;
  top: -7px;
  right: 12px;
  width: 14px;
  height: 12px;
  border-radius: 3px;
  background: linear-gradient(180deg, #d1ae70, #73522d);
}

.lock-overlay::before {
  content: "";
  position: absolute;
  left: 2px;
  top: -8px;
  width: 10px;
  height: 10px;
  border: 2px solid #a9824b;
  border-bottom: 0;
  border-radius: 8px 8px 0 0;
}
</style>
