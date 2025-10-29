import { createRouter, createWebHistory } from 'vue-router';

// Lazy-loaded views
const views = {
    Home: () => import('../views/HomeView.vue'),
    ShowDetail: () => import('../views/ShowDetailView.vue'),
    SearchResults: () => import('../views/SearchResultsView.vue'),
    Genre: () => import('../views/GenreView.vue')
};

const routes = [
    {
        path: '/',
        name: 'Home',
        component: views.Home
    },
    {
        path: '/show/:id',
        name: 'ShowDetail',
        component: views.ShowDetail,
        props: true
    },
    {
        path: '/search',
        name: 'SearchResults',
        component: views.SearchResults
    },
    {
        path: '/genre/:genre',
        name: 'GenreView',
        component: views.Genre,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
