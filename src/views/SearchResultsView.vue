<template>
  <div class="search-view">
    <input
      type="text"
      v-model="internalValue"
      placeholder="Search TV shows..."
      class="search-input"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// Accept v-model from parent
const props = defineProps({
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);

// Internal value for input
const internalValue = ref(props.modelValue || "");

// Sync internalValue with parent
watch(internalValue, (val) => emit("update:modelValue", val));
watch(
  () => props.modelValue,
  (val) => {
    internalValue.value = val;
  }
);
</script>

<style scoped>
.search-view {
  padding: 16px 0;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
