<template>
  <div class="chart-container h-full w-full flex items-center justify-start overflow-hidden">
    <canvas ref="chartCanvas" class="w-full h-full"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default {
  name: 'PieChart',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const createChart = () => {
      const ctx = chartCanvas.value.getContext('2d');
      Chart.register(...registerables, ChartDataLabels);

      chartInstance = new Chart(ctx, {
        type: 'pie',
        data: props.data,
        options: {
          maintainAspectRatio: false, // Отключаем сохранение соотношения сторон
          plugins: {
            legend: {
              position: 'right',
              labels: {
                font: {
                  size: 24,
                },
                align: 'center',
              },
              maxHeight: 200,
              maxWidth: 200,
            },
            datalabels: {
              formatter: (value, ctx) => {
                const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(0) + '%';
                return percentage;
              },
              color: 'white',
              font: {
                weight: 'bold',
                size: 24,
              },
              align: 'center',
              anchor: 'center',
            },
          },
        },
      });
    };

    const resizeChart = () => {
      if (chartInstance) {
        chartInstance.resize(); // Перерисовываем диаграмму при изменении размеров
      }
    };

    onMounted(() => {
      createChart();
      window.addEventListener('resize', resizeChart); // Добавляем обработчик события resize
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeChart); // Удаляем обработчик события resize
    });

    return {
      chartCanvas,
    };
  },
};
</script>

<style scoped>

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; 
}
</style>