<template>
  <div class="container">
    <div v-if="!isAuthenticated" class="auth-section">
      <RegistrationForm :is-loading="isRegistering" @submitted="handleRegistration" />
      <div class="auth-divider">
        <span class="divider-text">{{ $t('auth.or') }}</span>
      </div>
      <div class="login-link-wrapper">
        <p class="login-text">{{ $t('auth.alreadyHaveAccount') }}</p>
        <NuxtLink to="/login" class="login-link">{{ $t('auth.loginHere') }}</NuxtLink>
      </div>
    </div>
    <div v-else>
      <FeedbackForm @submitted="handleSubmitted" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, checkAuth, register } = useAuth()
const { t } = useI18n()
const { success, error: showError } = useToast()

const isRegistering = ref(false)

// Check authentication on mount
onMounted(async () => {
  await checkAuth()
})

const handleRegistration = async (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
  isRegistering.value = true
  try {
    const result = await register(data.firstName, data.lastName, data.email, data.password, data.phone)
    if (result.success) {
      success(t('toast.registrationSuccess'))
      // User is now authenticated, feedback form will show
      await checkAuth()
    } else {
      showError(result.error || t('toast.registrationError'))
      isRegistering.value = false
    }
  } catch (error) {
    showError(t('toast.registrationError'))
    isRegistering.value = false
  }
}

const handleSubmitted = (data: any) => {
  // TODO: Handle form submission
}
</script>

<style scoped>
.container {
  padding: 1rem;
  min-height: 100vh;
  background: #f5f5f5;
  box-sizing: border-box;
}

@media (min-width: 640px) {
  .container {
    padding: 2rem 1rem;
  }
}

.auth-section {
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  text-align: center;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.divider-text {
  padding: 0 1rem;
  color: #666;
  font-size: 0.875rem;
}

.login-link-wrapper {
  text-align: center;
  padding-top: 1rem;
}

.login-text {
  color: #666;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.login-link {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #357abd;
  text-decoration: underline;
}
</style>
