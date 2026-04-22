import { createRouter, createWebHistory } from 'vue-router';
import MenuPrincipal from '../components/MenuPrincipal.vue';
import PanelConductor from '../components/PanelConductor.vue';
import PanelPnc from '../components/PanelPnc.vue';

const routes = [
    {
        path: '/',
        name: 'Inicio',
        component: MenuPrincipal
    },
    {
        path: '/conductor',
        name: 'PanelConductor',
        component: PanelConductor
    },
    {
        path: '/pnc',
        name: 'PanelPnc',
        component: PanelPnc
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
