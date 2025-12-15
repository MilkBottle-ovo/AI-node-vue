<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps<{
  userInput: string;
  send: () => Promise<void>;
}>();
const emit = defineEmits<{
  (e: "update:userInput", value: string): void;
}>();
const inputValue = ref(props.userInput);

watch(inputValue, (newVal) => {
  emit("update:userInput", newVal);
});
watch(
  () => props.userInput,
  (newVal) => {
    inputValue.value = newVal;
  }
);
const sendMessage = async () => {
  if (!inputValue.value.trim()) return;
  await props.send();
  
};
</script>
<template>
  <div class="input-box">
    <textarea
      v-model="inputValue"
      class="input-textarea"
      placeholder="Type your message..."
      @keydown.enter.exact.prevent="sendMessage"
    ></textarea>
    <button class="send-button" @click="sendMessage">Send</button>
  </div>
</template>
<style scoped>
.input-box {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 100px;
  width: 65%;
  margin:10px auto;
  
}
textarea {
  width: 70%;
  height: 60px;
  font-size: 20px;
  padding: 10px;
  margin: 10px;
  border-radius: 20px;
  color: #e6dddd;
  background: linear-gradient(to bottom,#01b9f1, #008cff);
  
}
textarea::placeholder {
  color: #d1d1d1;
}
button {
  margin-left: 10px;
  padding: 10px 20px;
  background: linear-gradient(to bottom,#01f1dd, #008cff);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
}
</style>
