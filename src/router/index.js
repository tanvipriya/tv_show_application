import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/show/:id',
        name: 'ShowDetail',
        component: () => import('../views/ShowDetailView.vue'),
        props: true
    },
    {
        path: '/genre/:genre',
        name: 'GenreView',
        component: () => import('../views/GenreView.vue'),
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
