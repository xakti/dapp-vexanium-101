import {createRouter, createWebHistory} from 'vue-router';

import Home from '@/views/Home.vue';
import Transfer from "@/views/Transfer.vue";
import SignMessage from "@/views/SignMessage.vue";

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/transfer',
        component: Transfer
    },
    {
        path: '/sign',
        component: SignMessage
    }
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;
