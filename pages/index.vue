<template>
  <div class="container">
    <h1>Feedback Form</h1>
    <p>Welcome to the feedback form!</p>
    
    <EmojiSelector v-model="selectedEmoji" />
  </div>
</template>

<script setup lang="ts">
const selectedEmoji = ref('')
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

h1 {
  font-weight: 600;
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.1rem;
  color: #666;
}
</style>
