import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginView from "@/views/LoginView.vue";
const HomeView = () => import("@/views/HomeView.vue");
const AdminBookings = () => import("@/views/admin/AdminBookings.vue");
const AdminSpaces = () => import("@/views/admin/AdminSpaces.vue");
const AdminHistory = () => import("@/views/admin/AdminHistory.vue");
const AdminRegister = () => import("@/views/admin/AdminRegister.vue");
const UserBookings = () => import("@/views/user/UserBookings.vue");
const UserBook = () => import("@/views/user/UserBook.vue");
const UserArchive = () => import("@/views/user/UserArchive.vue");
const NotFoundView = () => import("@/views/NotFoundView.vue");

const router = createRouter({
    // Go back and forth between pages, like a server-rendered app
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: {guest: true}
        },
        {
            path: '/admin/bookings',
            name: 'admin-bookings',
            component: AdminBookings,
            meta: {requireAuth: true, role: 'admin'}
        },
        {
            path: '/admin/spaces',
            name: 'admin-spaces',
            component: AdminSpaces,
            meta: {requireAuth: true, role: 'admin'}
        },
        {
            path: '/admin/history',
            name: 'admin-history',
            component: AdminHistory,
            meta: {requireAuth: true, role: 'admin'}
        },
        {
            path: '/admin/register',
            name: 'admin-register',
            component: AdminRegister,
            meta: {requireAuth: true, role: 'admin'}
        },
        {
            path: '/user/bookings',
            name: 'user-bookings',
            component: UserBookings,
            meta: {requireAuth: true, role: 'user'}
        },
        {
            path: '/user/book',
            name: 'user-book',
            component: UserBook,
            meta: {requireAuth: true, role: 'user'}
        },
        {
            path: '/user/archive',
            name: 'user-archive',
            component: UserArchive,
            meta: {requireAuth: true, role: 'user'}
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: NotFoundView
        }
    ]
})

router.beforeEach(async (to, from) => {
    const auth = useAuthStore()
    if(!auth.isAuthResolved) {
        await auth.attempt()
    }

    if(to.path === '/' || to.path === '/admin' || to.path === '/user') {
        if(auth.isAuthenticated) {
            return {name: auth.isAdmin ? 'admin-bookings' : 'user-bookings'}
        }
        else {
            return {name: 'login'}
        }
    }

    if(to.meta.requireAuth && auth.isAuthenticated) {
        if(to.meta.role && to.meta.role !== auth.user.role) { // If user tries to acces a route different from their role
            return {name: auth.isAdmin ? 'admin-bookings' : 'user-bookings'}
        }
    } else if(to.meta.requireAuth && !auth.isAuthenticated) {
        return {name: 'login'}
    }

    if(to.meta.guest && auth.isAuthenticated) {
        return {name: auth.isAdmin ? 'admin-bookings' : 'user-bookings'}
    }

})

export default router