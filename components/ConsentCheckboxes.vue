<template>
  <div class="consent-section">
    <div class="checkbox-group">
      <div class="checkbox-item">
        <input id="make-public" :checked="isPublic"
          @change="$emit('update:isPublic', ($event.target as HTMLInputElement).checked)" type="checkbox" />
        <label for="make-public">
          {{ $t('consent.makePublic') }}
          <div class="checkbox-description">
            {{ $t('consent.makePublicDescription') }}
          </div>
        </label>
      </div>

      <div class="checkbox-item">
        <input id="wants-contact" :checked="wantsContact"
          @change="$emit('update:wantsContact', ($event.target as HTMLInputElement).checked)" type="checkbox" />
        <label for="wants-contact">
          {{ $t('consent.wantsContact') }}
          <input v-if="wantsContact" :model-value="contactInfo"
            @update:model-value="$emit('update:contactInfo', $event)" type="text" class="contact-input"
            :placeholder="$t('consent.contactPlaceholder')" />
        </label>
      </div>

      <div class="checkbox-item">
        <input id="privacy-agreement" :checked="agreedToPrivacy"
          @change="$emit('update:agreedToPrivacy', ($event.target as HTMLInputElement).checked)" type="checkbox"
          required />
        <label for="privacy-agreement">
          {{ $t('consent.privacyAgreement') }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isPublic: boolean
  wantsContact: boolean
  contactInfo: string
  agreedToPrivacy: boolean
}>()

defineEmits<{
  'update:isPublic': [value: boolean]
  'update:wantsContact': [value: boolean]
  'update:contactInfo': [value: string]
  'update:agreedToPrivacy': [value: boolean]
}>()
</script>

<style scoped>
.consent-section {
  margin-bottom: 2rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.checkbox-item {
  display: flex;
  align-items: flex-start;
}

.checkbox-item input[type="checkbox"] {
  margin-right: 0.75rem;
  margin-top: 0.25rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-item label {
  flex: 1;
  cursor: pointer;
  line-height: 1.6;
}

.checkbox-description {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.contact-input {
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.contact-input:focus {
  outline: none;
  border-color: #4a90e2;
}
</style>
