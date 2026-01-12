<template>
  <div class="feedback-form">
    <div class="form-header">
      <div class="studio-name">{{ $t('studioName') }}</div>
      <LanguageSwitcher />
    </div>

    <h1 class="form-title">{{ $t('title') }}</h1>
    <p class="form-description">{{ $t('description') }}</p>

    <EmojiSelector v-model="selectedEmoji" />

    <FreeTextInput v-model="freeText" :selected-emoji="selectedEmoji" :prompt="freeTextPrompt" />

    <ConsentCheckboxes v-model:is-public="isPublic" v-model:wants-contact="wantsContact"
      v-model:contact-info="contactInfo" v-model:agreed-to-privacy="agreedToPrivacy" />

    <div class="submit-button-wrapper">
      <button type="button" class="submit-button" :disabled="!canSubmit || isSubmitting" @click="handleSubmit">
        {{ isSubmitting ? 'Submitting...' : $t('submit') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const emit = defineEmits<{
  submitted: [data: any]
}>()

const selectedEmoji = ref('')
const freeText = ref('')
const isPublic = ref(false)
const wantsContact = ref(false)
const contactInfo = ref('')
const agreedToPrivacy = ref(false)
const isSubmitting = ref(false)

const freeTextPrompt = computed(() => {
  if (!selectedEmoji.value) return ''
  return t(`freeTextPrompt.${selectedEmoji.value}`)
})

const canSubmit = computed(() => {
  return selectedEmoji.value && agreedToPrivacy.value
})

const handleSubmit = () => {
  if (!canSubmit.value) return

  isSubmitting.value = true

  const formData = {
    emoji: selectedEmoji.value,
    freeText: freeText.value,
    isPublic: isPublic.value,
    wantsContact: wantsContact.value,
    contactInfo: wantsContact.value ? contactInfo.value : null,
    agreedToPrivacy: agreedToPrivacy.value
  }

  emit('submitted', formData)
  isSubmitting.value = false
}
</script>

<style scoped>
.feedback-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .feedback-form {
    padding: 2rem;
  }
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 480px) {
  .form-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

.studio-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .form-title {
    font-size: 1.75rem;
  }
}

.form-description {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.8;
}

.submit-button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.submit-button {
  padding: 1rem 2rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-block;
}

.submit-button:hover:not(:disabled) {
  background-color: #357abd;
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
