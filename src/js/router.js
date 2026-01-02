import {createRouter, createWebHistory} from 'vue-router';

import Home from '@/views/Home.vue';
import Transfer from "@/views/Transfer.vue";
import SignMessage from "@/views/SignMessage.vue";
import TransferHistory from "@/views/TransferHistory.vue";

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
        path: '/transfer-history',
        component: TransferHistory
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
