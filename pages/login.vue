<template>
  <div class="container">
    <LoginForm :is-loading="isLoading" @submitted="handleSubmitted" />
  </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const { t } = useI18n()
const router = useRouter()
const { success, error: showError } = useToast()

const isLoading = ref(false)

const handleSubmitted = async (data: { email: string; password: string }) => {
  isLoading.value = true
  try {
    const result = await login(data.email, data.password)
    if (result.success) {
      success(t('toast.loginSuccess'))
      // Redirect to home page after successful login
      await router.push('/')
    } else {
      showError(result.error || t('toast.loginError'))
      isLoading.value = false
    }
  } catch (error) {
    showError(t('toast.loginError'))
    isLoading.value = false
  }
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
</style>
