import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import Chart from 'chart.js/auto'; 
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

Chart.register(ChartDataLabels);

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')