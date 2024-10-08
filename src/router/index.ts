import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MASH from '@components/pages/Mash.vue';
import HowToPlay from '@components/pages/HowToPlay.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'How to play',
        component: HowToPlay
    },
    {
        path: '/Mash',
        name: 'Mash',
        component: MASH
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;