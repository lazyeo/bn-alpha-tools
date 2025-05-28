<template>
  <div
    @click="toggle"
    :class="{
      'bg-blue-500': modelValue,
      'bg-gray-300': !modelValue
    }"
    class="w-12 h-6 rounded-full shadow-inner relative cursor-pointer transition-all"
  >
    <div
      :class="{
        'translate-x-6': modelValue,
        'translate-x-0': !modelValue
      }"
      class="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"
    ></div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>
