<template>
  <div class="chart-container h-full flex justify-center">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default {
  name: 'LineChart',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const getMaxYValue = (data) => {
      const maxValue = Math.max(...data.datasets.flatMap(dataset => dataset.data));

      if (maxValue < 500000) {
        return 500000;
      } else if (maxValue < 1000000) {
        return 1000000;
      } else if (maxValue < 5000000) {
        return 5000000;
      } else {
        return 10000000;
      }
    };

    const createChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = chartCanvas.value.getContext('2d');

      Chart.register(...registerables, ChartDataLabels);

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: props.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            datalabels: {
              display: false, // Отключаем подписи на графике
            },
          },
          scales: {
            y: {
              min: 0,
              max: getMaxYValue(props.data),
            },
          },
        },
      });
    };

    onMounted(() => {
      createChart();
    });

    return {
      chartCanvas,
    };
  },
};
</script>