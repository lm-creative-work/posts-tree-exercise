<script setup>
import TreeLists from './components/TreeList/TreeList.vue'
import TreeListItem from './components/TreeList/TreeListItem.vue'
import { ref, onMounted, computed, provide, nextTick } from 'vue'
import moment from 'moment';
const groupeBy = ref('Date')
const groupOptions = ref([
  { text: 'Posting Week', value: 'Date'},
  { text: 'Author', value: 'Author'},
  { text: 'Location', value: 'Location'}
])
const groupedPosts = computed(() => {
  let sortedGroups = {};
  if(groupeBy.value === 'Date'){ 
    const myPosts = orderDescending.value ? [...posts.value].reverse() : posts.value;
    myPosts.forEach(post => {
      if('time' in post){
        let date = moment.unix(post.time);
        let week = date.isoWeekYear() + "-W" + date.isoWeek();
        if(week in sortedGroups === false) {
          sortedGroups[week] = [];
        }
        sortedGroups[week].push(post);
      }
    });
  } else {
    const groups = {};
    posts.value.forEach(post => {
      if(groupeBy.value === 'Author'){ 
        if('author' in post){
          if(post.author in groups === false) {
            groups[post.author] = [];
          }
          groups[post.author].push(post);
        }
      }else {
        if('location' in post){
          if(post.location in groups === false) {
            groups[post.location] = [];
          }
          groups[post.location].push(post);
        }
      }
    });
    const keys = Object.keys(groups);
    const sortedKeys = orderDescending.value ? keys.sort().reverse() : keys.sort();
    sortedGroups = sortedKeys.reduce((acc, key) => {acc[key] = groups[key];return acc;}, {});
  }
  return sortedGroups;
})
const orderDescending = ref(false);
const posts = ref([]);
function getPosts() {
  fetch('http://localhost:5173/data.json')
    .then(response => response.json())
    .then(data => posts.value = data.sort((a,b) => a.time - b.time))
    .catch((error) => {
      console.log(error)
    });
}
const pattern = /([A-ZÀ-Þ0-9][-,a-zß-ÿ0-9. ']+[ ]*)+/;
const errorMessages = ref({});
function updatePost(id,field,value,callback){
  if(pattern.test(value)){
    const index = posts.value.findIndex((obj => obj.id === id));
    posts.value[index][field] = value;
    delete errorMessages.value[field+id];
    callback();
    nextTick(() => {
      let target = document.getElementById('post-'+id);
      let parent = document.getElementById(target.dataset.parent);
      if(target.classList.contains('active') === false){
        target.click();
      }
      if(parent.classList.contains('active') === false){
        parent.click();
      }
    });
  }else {
    errorMessages.value[field+id] = `Enter a valid ${field} name.`;
  }
}
provide('updatePost', {
  updatePost,
  errorMessages
})
onMounted(() => {
  getPosts();
})
</script>

<template>
  <div class="p-4 text-right">
  <span>Sort: </span>
  <button class="mr-6" @click="orderDescending = !orderDescending">
    {{ groupeBy }}
    <template v-if="orderDescending"> 🔽</template>
    <template v-else> 🔼</template>
  </button>
  <span>Group by: </span>
    <select v-model="groupeBy">
    <option v-for="option in groupOptions" :value="option.value">
      {{ option.text }}
    </option>
  </select>
  </div>
  <TreeLists>
    <TreeListItem v-for="(posts, title, index) in groupedPosts" :id="'group-'+index" :key="title" :title="title" class="font-bold text-xl">
        <TreeLists>
          <TreeListItem v-for="post in posts" class="text-base" :id="'post-'+post.id" :parent="'group-'+index" :key="post.id" :title="post.text">
            <TreeLists>
              <TreeListItem :post="post"/>
            </TreeLists>
          </TreeListItem>
        </TreeLists>
    </TreeListItem>
  </TreeLists>
</template>