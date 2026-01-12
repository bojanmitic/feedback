<template>
  <div v-if="selectedEmoji" class="free-text-section">
    <label :for="'free-text'" class="free-text-label">
      {{ prompt }}
    </label>
    <textarea id="free-text" :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" class="free-text-input"
      :placeholder="placeholder" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  selectedEmoji: string
  prompt: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
.free-text-section {
  margin-bottom: 2rem;
}

.free-text-label {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.75rem;
  display: block;
}

.free-text-input {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.free-text-input:focus {
  outline: none;
  border-color: #4a90e2;
}
</style>
