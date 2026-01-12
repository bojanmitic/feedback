<template>
  <div class="feedback-form">
    <div class="form-header">
      <div class="studio-name">{{ $t('studioName') }}</div>
      <LanguageSwitcher />
    </div>

    <h1 class="form-title">{{ isSubmitted ? $t('thankYou') : $t('title') }}</h1>
    <p v-if="!isSubmitted" class="form-description">{{ $t('description') }}</p>

    <!-- Form view -->
    <template v-if="!isSubmitted">
      <EmojiSelector v-model="selectedEmoji" />

      <FreeTextInput v-model="freeText" :selected-emoji="selectedEmoji" :prompt="freeTextPrompt" />

      <ConsentCheckboxes v-model:is-public="isPublic" v-model:wants-contact="wantsContact"
        v-model:contact-info="contactInfo" v-model:agreed-to-privacy="agreedToPrivacy" :user-email="user?.email"
        :user-phone="user?.phone" />

      <div class="submit-button-wrapper">
        <button type="button" class="submit-button" :disabled="!canSubmit || isSubmitting" @click="handleSubmit">
          {{ isSubmitting ? 'Submitting...' : $t('submit') }}
        </button>
      </div>
    </template>

    <!-- Confirmation view -->
    <template v-else>
      <div class="feedback-preview">
        <div class="preview-emoji" :style="{ backgroundColor: previewEmojiBgColor }">
          <img v-if="submittedEmojiIcon" :src="submittedEmojiIcon" :alt="submittedEmojiLabel"
            class="preview-emoji-icon" />
        </div>
        <div class="preview-text">
          {{ submittedFreeText || '' }}
          <div v-if="isPublic && userFirstName && userLastName" class="preview-user-name">
            {{ userFirstName }} {{ userLastName.charAt(0).toUpperCase() }}.
          </div>
        </div>
      </div>

      <div class="confirmation-checkmarks">
        <div class="checkmark-item">
          <span class="checkmark">✓</span>
          <span>{{ isPublic ? $t('feedbackPublic') : $t('feedbackNotPublic') }}</span>
        </div>
        <div v-if="wantsContact" class="checkmark-item">
          <span class="checkmark">✓</span>
          <span>{{ $t('studioWillContact') }}</span>
        </div>
      </div>

      <div class="submit-button-wrapper">
        <button type="button" class="submit-button" @click="handleDone">{{ $t('done') }}</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { user, checkAuth, isLoading, logout } = useAuth()
const { success, error: showError } = useToast()
const router = useRouter()
const emit = defineEmits<{
  submitted: [data: any]
}>()

const emojiOptions = [
  { value: 'poor', icon: '/emojis/poor.svg', bgColor: '#FFD4E4' },
  { value: 'fair', icon: '/emojis/fair.svg', bgColor: '#FDCFC4' },
  { value: 'satisfactory', icon: '/emojis/satisfactory.svg', bgColor: '#FBECB7' },
  { value: 'good', icon: '/emojis/satisfied.svg', bgColor: '#DAEDCA' },
  { value: 'excellent', icon: '/emojis/excellent.svg', bgColor: '#B5F0E2' }
]

const previewEmojiBgColor = computed(() => {
  const emojiOption = emojiOptions.find(opt => opt.value === submittedEmoji.value)
  return emojiOption?.bgColor || '#f0f0f0'
})

// Ensure auth is checked and load existing feedback when component mounts
onMounted(async () => {
  if (!user.value && !isLoading.value) {
    await checkAuth()
  }

  // Check if user already has feedback
  await loadExistingFeedback()
})

const selectedEmoji = ref('')
const freeText = ref('')
const isPublic = ref(false)
const wantsContact = ref(false)
const contactInfo = ref('')
const agreedToPrivacy = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)

// Store submitted/existing data for confirmation view
const submittedEmoji = ref('')
const submittedEmojiLabel = ref('')
const submittedEmojiIcon = ref('')
const submittedFreeText = ref('')

// User name for display - can come from user or from feedback
const submittedFirstName = ref<string | null>(null)
const submittedLastName = ref<string | null>(null)

const userFirstName = computed(() => submittedFirstName.value || user.value?.firstName || null)
const userLastName = computed(() => submittedLastName.value || user.value?.lastName || null)

const loadExistingFeedback = async () => {
  try {
    const response = await $fetch<{ success: boolean; hasFeedback: boolean; feedback?: any }>('/api/feedback/me')

    if (response.success && response.hasFeedback && response.feedback) {
      const feedback = response.feedback

      // Set confirmation view data
      submittedEmoji.value = feedback.emoji
      submittedEmojiLabel.value = feedback.emoji_label
      const emojiOption = emojiOptions.find(opt => opt.value === feedback.emoji)
      submittedEmojiIcon.value = emojiOption?.icon || ''
      submittedFreeText.value = feedback.free_text || ''
      isPublic.value = feedback.is_public || false
      wantsContact.value = feedback.wants_contact || false

      // Store user name from feedback for immediate display
      submittedFirstName.value = feedback.firstName || null
      submittedLastName.value = feedback.lastName || null

      // Update user data if available from feedback
      if (feedback.firstName && feedback.lastName) {
        if (user.value) {
          user.value.firstName = feedback.firstName
          user.value.lastName = feedback.lastName
        }
      }

      // Show confirmation view
      isSubmitted.value = true
    }
  } catch (error) {
    // If error, allow user to submit new feedback
  }
}

const freeTextPrompt = computed(() => {
  if (!selectedEmoji.value) return ''
  return t(`freeTextPrompt.${selectedEmoji.value}`)
})

const canSubmit = computed(() => {
  return selectedEmoji.value && agreedToPrivacy.value
})

const handleSubmit = async () => {
  if (!canSubmit.value) return

  isSubmitting.value = true

  try {
    const emojiLabel = t(`emojiLabels.${selectedEmoji.value}`)
    const emojiOption = emojiOptions.find(opt => opt.value === selectedEmoji.value)

    const response = await $fetch<{ success: boolean; feedback?: any }>('/api/feedback/submit', {
      method: 'POST',
      body: {
        emoji: selectedEmoji.value,
        emojiLabel,
        freeText: freeText.value,
        isPublic: isPublic.value,
        wantsContact: wantsContact.value,
        contactInfo: wantsContact.value ? contactInfo.value : null,
        agreedToPrivacy: agreedToPrivacy.value
      }
    })

    if (response.success) {
      // Store submitted data for confirmation view
      submittedEmoji.value = selectedEmoji.value
      submittedEmojiLabel.value = emojiLabel
      submittedEmojiIcon.value = emojiOption?.icon || ''
      submittedFreeText.value = freeText.value

      // Store user name from response or user object
      if (response.feedback?.firstName && response.feedback?.lastName) {
        submittedFirstName.value = response.feedback.firstName
        submittedLastName.value = response.feedback.lastName
      } else if (user.value?.firstName && user.value?.lastName) {
        submittedFirstName.value = user.value.firstName
        submittedLastName.value = user.value.lastName
      } else {
        // Ensure user data is loaded to get name
        await checkAuth()
        submittedFirstName.value = user.value?.firstName || null
        submittedLastName.value = user.value?.lastName || null
      }

      // Show confirmation view
      isSubmitted.value = true
      success(t('toast.feedbackSubmitted') || 'Feedback submitted successfully!')

      if (response.feedback) {
        emit('submitted', response.feedback)
      }
    }
  } catch (error: any) {
    showError(error.data?.message || t('toast.error'))
  } finally {
    isSubmitting.value = false
  }
}

const handleDone = async () => {
  await logout()
  success(t('toast.logoutSuccess'))
  await router.push('/')
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

.feedback-preview {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  min-height: 150px;
}

.preview-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0 0 1rem 0;
}

.preview-emoji-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.preview-text {
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 120px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.preview-user-name {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.confirmation-checkmarks {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.checkmark-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.875rem;
}

.checkmark {
  color: #4a90e2;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
