<template>
  <TransitionGroup name="toast" tag="div" class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', `toast-${toast.type}`]"
      @click="removeToast(toast.id)"
    >
      <div class="toast-content">
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click.stop="removeToast(toast.id)">×</button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  width: calc(100% - 2rem);
  pointer-events: none;
}

@media (max-width: 640px) {
  .toast-container {
    top: 0.5rem;
    right: 0.5rem;
    left: 0.5rem;
    width: auto;
    max-width: none;
  }
}

.toast {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  border-left: 4px solid;
}

.toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.toast-success {
  border-left-color: #10b981;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.toast-message {
  flex: 1;
  color: #333;
  font-size: 0.875rem;
  line-height: 1.5;
}

.toast-close {
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

/* Transition animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(-100%);
  }
}
</style>
