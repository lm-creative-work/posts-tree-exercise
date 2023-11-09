<script setup>
import {ref, nextTick, inject} from 'vue'
import PencilSquareIcon from '@heroicons/vue/24/outline/PencilSquareIcon' 
const editField = ref(false);
const field = ref(null);
const { updatePost, errorMessages } = inject('updatePost');
defineProps({
  type: {
    validator(value) {
      return ['author', 'location'].includes(value)
    }
  },
  value: String,
  postId: Number
})

function toggleEditField() {
  editField.value = editField.value ? false : true;
  if(editField.value){
    nextTick(() => {
      field.value.focus();
      field.value.select();
    });
  }
}
</script>

<template>
  <span class="flex align-center justify-center relative">
      <span class="title inline-block mr-1">{{ (type === 'author') ? '✍🏼':'📍' }}</span>
      <template v-if="editField">
        <input ref="field" :name="type" @change="event => {updatePost(postId,type,event.target.value,toggleEditField)}" :value="value">
        <div v-if="errorMessages[type+postId]" class="text-red-500 text-xs absolute left-5 -bottom-5">{{ errorMessages[type+postId] }}</div>
      </template>
      <template v-else>{{ value }}</template>
      <button class="ml-3" title="edit" @click="toggleEditField()"><PencilSquareIcon class="text-black w-4 h-4"/></button>
  </span>
</template>