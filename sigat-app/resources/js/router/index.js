import { createRouter, createWebHistory } from 'vue-router';
// Asumiendo que los componentes se guardan en resources/js/components
import Login from '../components/Login.vue';
import PanelConductor from '../components/PanelConductor.vue';
import PanelPnc from '../components/PanelPnc.vue';

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guest: true }
    },
    {
        path: '/conductor',
        name: 'PanelConductor',
        component: PanelConductor,
        meta: { requiresAuth: true, role: 'Conductor' }
    },
    {
        path: '/pnc',
        name: 'PanelPnc',
        component: PanelPnc,
        meta: { requiresAuth: true, role: 'PNC' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Guardia de navegación
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('rol');

    if (to.meta.requiresAuth && !token) {
        next({ name: 'Login' });
    } else if (to.meta.role && to.meta.role !== role) {
        // Redirigir al panel correspondiente si intenta acceder a otra vista
        next(role === 'Conductor' ? { name: 'PanelConductor' } : { name: 'PanelPnc' });
    } else {
        next();
    }
});

export default router;
