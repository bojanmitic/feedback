<template>
  <div class="container">
    <RegistrationForm :is-loading="isLoading" @submitted="handleSubmitted" />
  </div>
</template>

<script setup lang="ts">
const { register } = useAuth()
const { t } = useI18n()
const router = useRouter()
const { success, error: showError } = useToast()

const isLoading = ref(false)

const handleSubmitted = async (data: { email: string; password: string; phone?: string }) => {
  isLoading.value = true
  try {
    const result = await register(data.email, data.password, data.phone)
    if (result.success) {
      success(t('toast.registrationSuccess'))
      // Redirect to home page after successful registration
      await router.push('/')
    } else {
      showError(result.error || t('toast.registrationError'))
      isLoading.value = false
    }
  } catch (error) {
    showError(t('toast.registrationError'))
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
