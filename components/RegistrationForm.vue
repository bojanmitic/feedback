<template>
  <div class="feedback-form">
    <div class="form-header">
      <div class="studio-name">{{ $t('studioName') }}</div>
      <LanguageSwitcher />
    </div>

    <h1 class="form-title">{{ $t('registration.title') }}</h1>
    <p class="form-description">{{ $t('registration.description') }}</p>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email" class="form-label">{{ $t('registration.email') }}</label>
        <input id="email" v-model="email" type="email" class="form-input"
          :placeholder="$t('registration.emailPlaceholder')" required />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">{{ $t('registration.password') }}</label>
        <input id="password" v-model="password" type="password" class="form-input"
          :placeholder="$t('registration.passwordPlaceholder')" required />
      </div>

      <div class="form-group">
        <label for="phone" class="form-label">{{ $t('registration.phone') }}</label>
        <input id="phone" v-model="phone" type="tel" class="form-input"
          :placeholder="$t('registration.phonePlaceholder')" />
      </div>

      <div class="submit-button-wrapper">
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? $t('registration.submitting') : $t('registration.submit') }}
        </button>
      </div>
    </form>

    <div class="form-footer">
      <p class="footer-text">{{ $t('registration.hasAccount') }}</p>
      <NuxtLink to="/login" class="link-button">{{ $t('registration.login') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const emit = defineEmits<{
  submitted: [data: { email: string; password: string; phone?: string }]
}>()

const email = ref('')
const password = ref('')
const phone = ref('')
const isSubmitting = ref(false)

const handleSubmit = () => {
  if (!email.value || !password.value) return

  isSubmitting.value = true

  const formData = {
    email: email.value,
    password: password.value,
    phone: phone.value || undefined
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.form-label {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
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

.form-footer {
  margin-top: 2rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.footer-text {
  color: #666;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.link-button {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.link-button:hover {
  color: #357abd;
  text-decoration: underline;
}
</style>
