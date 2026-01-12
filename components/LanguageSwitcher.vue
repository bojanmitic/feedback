<template>
  <div class="language-switcher">
    <button @click="toggleDropdown" class="language-toggle" type="button">
      <img src="/languageIcon/language.svg" alt="Language" class="language-icon" />
      <span class="current-language">{{ currentLocaleName }}</span>
      <svg class="dropdown-arrow" :class="{ open: isOpen }" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div v-if="isOpen" class="dropdown-menu">
      <button v-for="locale in availableLocales" :key="locale.code" @click="selectLanguage(locale.code)"
        class="dropdown-item" :class="{ active: currentLocale === locale.code }">
        {{ locale.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => locales.value)
const currentLocale = computed(() => locale.value)
const isOpen = ref(false)

const currentLocaleName = computed(() => {
  const current = availableLocales.value.find(l => l.code === currentLocale.value)
  return current?.name || currentLocale.value
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = async (lang: 'en' | 'fi') => {
  await setLocale(lang)
  isOpen.value = false
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest('.language-switcher')) {
      isOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
.language-switcher {
  position: relative;
}

.language-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.language-toggle:hover {
  border-color: #4a90e2;
  background: #f5f5f5;
}

.language-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0);
}

.current-language {
  font-weight: 500;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
  color: #666;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  border: none;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.active {
  background: #4a90e2;
  color: white;
  font-weight: 600;
}
</style>
