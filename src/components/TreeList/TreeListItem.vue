<script setup>
import UpdateField from '@/components/TreeList/UpdateField.vue'
import moment from 'moment';
import { ref } from 'vue';

defineProps({
  title: String,
  parent: String,
  post: Object
})
defineOptions({
  inheritAttrs: false
})
function formatDate(timeStamp){
  return moment.unix(timeStamp).format('DD/MM/YYYY');
}
const collapse = ref(null);
function toggleCollapse(event) {
  if(collapse.value.classList.contains("active")){
    event.target.classList.remove('active');
    collapse.value.classList.remove('active');
    collapse.value.style.maxHeight = null;
  }else {
    var height = 0;
    collapse.value.querySelectorAll('.tree-list-body').forEach((el) => {
      height += el.offsetHeight;
    });
    event.target.classList.add('active');
    collapse.value.classList.add('active');
    collapse.value.style.maxHeight = height+'px';
  }
}
</script>

<template>
  <li>
    <div class="rounded overflow-hidden shadow-inner px-4 py-2">
      <template v-if="$slots.default">
        <div :id="$attrs.id" :class="['title hover:cursor-pointer caret toggle-collapse py-2',$attrs.class]" :data-parent="parent" @click="toggleCollapse">{{ title }}</div>
      </template>
      <template v-else>
        <div v-if="title" :class="['title py-2',$attrs.class]">{{ title }}</div>
      </template>
      <template v-if="post">
        <span v-if="post.author" class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 my-2 mr-2">
          <UpdateField type="author" :postId="parseInt(post.id)" :value="post.author"/>
        </span>
        <span v-if="post.location" class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 my-2 mr-2">
          <UpdateField type="location" :postId="parseInt(post.id)" :value="post.location"/>
        </span>
        <span v-if="post.time" class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700s my-2">📅 {{ formatDate(post.time) }}</span>
      </template>
      <div v-if="$slots.default" ref="collapse" class="overflow-hidden max-h-0 transition-all">
        <div class="tree-list-body px-3"><slot></slot></div>
      </div>
  </div>
  </li>
</template>
<style scoped>
/* Create the caret/arrow with a unicode, and style it */
.caret::before {
  content: "\25B6";
  color: black;
  display: inline-block;
  margin-right: 6px;
}

/* Rotate the caret/arrow icon when clicked on (using JavaScript) */
.caret.active::before {
  transform: rotate(90deg);
}
</style>