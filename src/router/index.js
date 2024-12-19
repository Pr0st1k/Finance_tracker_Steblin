import { createRouter, createWebHistory } from 'vue-router';
import AddTransactionForm from '../components/AddTransactionForm.vue';
import TransactionListPage from '../components/TransactionTable.vue';
import StatisticsPage from '../components/Summary.vue';

const routes = [
  {
    path: '/',
    component: AddTransactionForm,
    meta: { title: 'Общее' }
  },
  {
    path: '/transactions',
    component: TransactionListPage,
    meta: { title: 'Транзакции' }
  },
  {
    path: '/statistics',
    component: StatisticsPage,
    meta: { title: 'Статистика' }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;