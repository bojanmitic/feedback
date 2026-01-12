<template>
  <div class="container">
    <RegistrationForm @submitted="handleSubmitted" />
  </div>
</template>

<script setup lang="ts">
const handleSubmitted = (data: { email: string; password: string; phone?: string }) => {
  console.log('Registration submitted:', data)
  // TODO: Handle registration submission
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
