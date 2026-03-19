<template>
  <router-view />
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { playerStore } from '@/store/playerStore.js'
import { merchantStore } from '@/store/merchantStore.js'

if (localStorage.getItem('playerAuth'))   playerStore.load()
if (localStorage.getItem('merchantAuth')) merchantStore.load()

function applyDark(v) { document.body.classList.toggle('dark', !!v) }
onMounted(() => applyDark(playerStore.settings?.darkMode))
watch(() => playerStore.settings?.darkMode, applyDark)
</script>
