<template>
  <div class="container">
    <FeedbackForm @submitted="handleSubmitted" />
  </div>
</template>

<script setup lang="ts">
const handleSubmitted = (data: any) => {
  console.log('Form submitted:', data)
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
</style>
