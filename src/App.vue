<template>
    <RouterView v-slot="{Component}">
        <keep-alive max="7">
            <component :is="Component"/>
        </keep-alive>
    </RouterView>
    <Toast class="max-w-9/10"/>
</template>
<script setup>

import {onMounted} from "vue";
import Store from "./js/store.js";

onMounted(() => {
    Store.initWharfKit();
});

</script>
