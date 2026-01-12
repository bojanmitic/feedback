<template>
  <div class="emoji-container">
    <button v-for="option in emojiOptions" :key="option.value" type="button" class="emoji-button"
      :class="{ selected: selectedEmoji === option.value }"
      :style="selectedEmoji === option.value ? { borderColor: option.bgColor } : {}" @click="selectEmoji(option.value)">
      <div class="emoji-icon-wrapper"
        :style="selectedEmoji === option.value ? { backgroundColor: option.bgColor } : {}">
        <img :src="option.icon" :alt="getLabel(option.value)" class="emoji-icon" />
      </div>
      <span class="emoji-label" :style="selectedEmoji === option.value ? { color: option.bgColor } : {}">{{
        getLabel(option.value) }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedEmoji = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

interface EmojiOption {
  value: string
  icon: string
  bgColor: string
}

const emojiOptions: EmojiOption[] = [
  {
    value: 'poor',
    icon: '/emojis/poor.svg',
    bgColor: '#FFD4E4'
  },
  {
    value: 'fair',
    icon: '/emojis/fair.svg',
    bgColor: '#FDCFC4'
  },
  {
    value: 'satisfactory',
    icon: '/emojis/satisfactory.svg',
    bgColor: '#FBECB7'
  },
  {
    value: 'good',
    icon: '/emojis/satisfied.svg',
    bgColor: '#DAEDCA'
  },
  {
    value: 'excellent',
    icon: '/emojis/excellent.svg',
    bgColor: '#B5F0E2'
  }
]

const getLabel = (value: string) => {
  try {
    const label = t(`emojiLabels.${value}`)
    return label || value
  } catch (error) {
    return value
  }
}

function selectEmoji(value: string): void {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.emoji-container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: flex-start;
  min-height: 140px;
}

.emoji-button {
  flex: 1;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  border: 3px solid #d1d5db;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  pointer-events: auto;
  z-index: 0;
  box-sizing: border-box;
  min-height: 140px;
}

.emoji-button:hover {
  border-color: #4a90e2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.emoji-button.selected {
  border-width: 3px;
  transform: scale(1);
  transform-origin: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1;
  pointer-events: auto;
}

.emoji-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  transition: background-color 0.3s ease;
}

.emoji-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.emoji-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
  text-align: center;
  transition: color 0.3s ease;
}

.emoji-button.selected .emoji-label {
  font-weight: 600;
}
</style>
