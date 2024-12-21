<template>
  <div class="stat-block flex w-full flex-col h-full p-[10px] max-md:p-0">
    <div class="up-side flex h-full max-sm:h-auto w-full mb-5">
      <div class="statistic stat_1 md:flex inline-grid flex-col md:px-[30px] py-5">
        <h3 class="text-[32px] font-medium">Статистика доходов по месяцам</h3>
          <LineChart :data="lineChartData" />
      </div>
      <div class="statistic stat_2 flex flex-col pl-[30px] pr-0 py-5">
        <h3 class="text-[32px] font-medium">Статистика по типам транзакций</h3>
          <PieChart :data="chartData" />
      </div>
    </div>
    <div class="down-side h-full min-h-[300px]">
      <div class="statistic h-full flex flex-row justify-center">
        <div class="flex flex-row mt-10 2xl:mt-15 justify-between max-w-[90%] max-h-[200px] h-full w-full">
          <div class="stat-container flex flex-col max-w-[400px] text-wrap text-center">
            <span class="2xl:text-[36px] xl:text-[32px] text-[28px] font-medium tracking-[0.01em]">Самый<br>прибыльный год</span>
            <div class="stat-data mt-8 2xl:text-[64px] xl:text-[58px] lg:text-5xl text-4xl font-normal">{{ getMostProfitableYear() }}</div>
          </div>
          <div class="stat-container flex flex-col max-w-[440px] text-wrap text-center">
            <span class="2xl:text-[36px] xl:text-[32px] text-[28px] font-medium tracking-[0.01em]">Самый<br>прибыльный месяц</span>
            <div class="stat-data mt-8 2xl:text-[64px] xl:text-[58px] lg:text-5xl text-4xl font-normal">{{ getHighestIncomeMonth() }}</div>
          </div>
          <div class="stat-container flex flex-col max-w-[300px] text-wrap text-center">
            <span class="2xl:text-[36px] xl:text-[32px] text-[28px] font-medium tracking-[0.01em]">Количество<br>всех транзакций</span>
            <div class="stat-data mt-8 2xl:text-[64px] xl:text-[58px] lg:text-5xl text-4xl font-normal">{{ getCountTransactions() }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="swiper-block md:hidden block py-[40px] px-[10px]">
      <div class="slider">
        <div class="slides">
          <div class="slide flex flex-col items-center">
            <div class="slide-head">
              <div class="slide-title text-center text-[28px] font-medium">
                Самый прибыльный<br>год
              </div>
              <div class="slide-info text-[64px] justify-center flex flex-row items-center">
                <div class="me-5"><img src="../assets/images/mobile_only/Business.svg" width="64px" height="64px" alt="coin_img"></div>
                <div class="text-center">{{ getMostProfitableYear() }}</div>
                <div class="ms-5"><img src="../assets/images/mobile_only/Business.svg" width="64px" height="64px" alt="coin_img" style="transform: scaleX(-1);"></div>
              </div>
            </div>
            <div class="slide-img">
              <img src="../assets/images/mobile_only/Success.svg" alt="cup_img">
            </div>
          </div>
          <div class="slide flex flex-col items-center">
            <div class="slide-head">
              <div class="slide-title text-center text-[28px] font-medium">
                Самый большой<br>приход
              </div>
              <div class="slide-info text-[64px] justify-center flex flex-row items-center">
                <div class="me-5"><img src="../assets/images/mobile_only/money.svg" width="64px" height="64px" alt="coin_img"></div>
                <div class="text-center">{{ formatNumber(maxIncome) }}</div>
                <div class="ms-5"><img src="../assets/images/mobile_only/money.svg" width="64px" height="64px" alt="coin_img" style="transform: scaleX(-1);"></div>
              </div>
            </div>
            <div class="slide-img">
              <img src="../assets/images/mobile_only/money_bag.svg" alt="cup_img">
            </div>
          </div>
          <div class="slide flex flex-col items-center">
            <div class="slide-head">
              <div class="slide-title text-center text-[28px] font-medium">
                Количество всех<br>транзакций
              </div>
              <div class="slide-info text-[64px] justify-center flex flex-row items-center">
                <div class="me-5"><img src="../assets/images/mobile_only/calculator.svg" width="64px" height="64px" alt="coin_img"></div>
                <div class="text-center">{{ getCountTransactions() }}</div>
                <div class="ms-5"><img src="../assets/images/mobile_only/calculator.svg" width="64px" height="64px" alt="coin_img" style="transform: scaleX(-1);"></div>
              </div>
            </div>
            <div class="slide-img">
              <img src="../assets/images/mobile_only/documents.svg" alt="cup_img">
            </div>
          </div>
        </div>
        <button class="prev-btn">&#10094;</button>
        <button class="next-btn">&#10095;</button>
      </div>
    </div>  
  </div>
</template>

<script>
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import PieChart from '@/components/graphs/PieChart.vue';
import LineChart from '@/components/graphs/LineChart.vue'; 

export default {
  components: {
    PieChart,
    LineChart, // Регистрируем LineChart
  },
  setup() {
    const store = useTransactionStore();

    const formatNumber = (number) => {
      if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M'; // Миллионы
      } else {
        return number.toLocaleString('en-US', { useGrouping: false }).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
    };

    // Данные для круговой диаграммы
    const chartData = computed(() => {
      return {
        labels: ['Доходы', 'Расходы'],
        datasets: [
          {
            data: [store.countIncome, store.countExpense], // Количество доходов и расходов
            backgroundColor: [
              'rgba(99, 142, 108, 0.9)', // Цвет для доходов
              'rgba(88, 111, 123, 1)', // Цвет для расходов
            ],
            borderColor: [
              'rgba(255, 255, 255, 0.5)', // Граница для доходов
              'rgba(255, 255, 255, 0.5)', // Граница для расходов
            ],
            borderWidth: 1,
          },
        ],
      };
    });

    // Данные для линейного графика
    const lineChartData = computed(() => {
      const transactions = store.transactions;

      const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
      ];

      const incomeData = Array(12).fill(0);

      transactions.forEach((t) => {
        const month = new Date(t.date).getMonth();
        if (t.category === 'income') {
          incomeData[month] += t.amount;
        }
      });

      return {
        labels: months,
        datasets: [
          {
            label: 'Доходы',
            data: incomeData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
          },
        ],
      };
    });

    // Функция для получения самого прибыльного года
    const getMostProfitableYear = () => {
      const transactions = store.transactions;

      if (!transactions || transactions.length === 0) {
        return '-';
      }

      const yearStats = {};

      transactions.forEach((transaction) => {
        const year = new Date(transaction.date).getFullYear();

        if (!yearStats[year]) {
          yearStats[year] = { income: 0, expense: 0 };
        }

        if (transaction.category === 'income') {
          yearStats[year].income += transaction.amount;
        } else if (transaction.category === 'expense') {
          yearStats[year].expense += transaction.amount;
        }
      });

      let mostProfitableYear = null;
      let maxProfit = -Infinity;

      for (const year in yearStats) {
        const profit = yearStats[year].income - yearStats[year].expense;
        if (profit > maxProfit) {
          maxProfit = profit;
          mostProfitableYear = year;
        }
      }

      return mostProfitableYear ? `${mostProfitableYear}` : '-';
    };

    const getHighestIncomeMonth = () => {
      const transactions = store.transactions;

      if (!transactions || transactions.length === 0) {
        return '-';
      }

      const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
      ];

      const incomeData = Array(12).fill(0);

      transactions.forEach((t) => {
        const month = new Date(t.date).getMonth();
        if (t.category === 'income') {
          incomeData[month] += t.amount;
        }
      });

      let highestIncomeMonth = null;
      let maxIncome = -Infinity;

      incomeData.forEach((income, index) => {
        if (income > maxIncome) {
          maxIncome = income;
          highestIncomeMonth = months[index];
        }
      });

      return highestIncomeMonth ? `${highestIncomeMonth}` : '-';
    };

    const getCountTransactions = () => {
      return store.transactions.length
    }

    return {
      chartData,
      formatNumber,
      maxIncome: store.maxIncome,
      lineChartData,
      getMostProfitableYear,
      getCountTransactions,
      getHighestIncomeMonth,
    };
  },
  mounted() {
    const slides = document.querySelector('.slides');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    function updateSlider() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.children.length - 1;
      updateSlider();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.children.length - 1) ? currentIndex + 1 : 0;
      updateSlider();
    });
  }
};
</script>

<style lang="css" scoped>

.statistic {
  background-color: #ffffff;
  border-radius: 20px;
}

@media (max-width: 767px) {
  .up-side {
    flex-direction: column;
    margin-top: 20px;
  }

  .down-side {
    display: none;
  }

  .statistic {
    padding: 0 10px 0 10px;
    height: 100%;
  }

  .chart-container {
    height: 100%;
    overflow: hidden;
  }

  .statistic h3 {
    margin-bottom: 20px;
  }

  .stat_2 {
    margin-top: 40px;
  }

  .stat_2 .chart-container {
    border: 1px solid black;
    border-radius: 20px;
  }

  .stat_2 , .stat_1 .chart-container {
    min-height: 300px;
    max-height: 500px;
  }

  .stat_2 .chart-container {
    min-height: 300px;
  }

  .slider {
    position: relative;
    width: 100%;
    overflow: hidden;
    border: 1px solid black;
    border-radius: 20px;
  }

  .slides {
    display: flex;
    transition: transform 0.7s cubic-bezier(0.65, 0.05, 0.36, 1);
  }

  .slide {
    min-width: 100%;
    box-sizing: border-box;
    padding: 20px 10px 30px 10px;
  }

  .prev-btn, .next-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: black;
    border: none;
    padding: 10px;
    cursor: pointer;
  }

  .prev-btn {
    left: 10px;
  }

  .next-btn {
    right: 10px;
  }

  .slide-info {
    font-family: 'Prata', sans-serif;
    margin-bottom: 20px;
    margin-top: 10px;
  }

}

@media (min-width: 768px) {
  .up-side {
    flex-direction: row;
    max-height: 500px;
  }

  .up-side .statistic {
    width: 50%;
  }

  .down-side {
    display: flex;
  }

  .stat_1 {
    margin-right: 10px;
  }

  .stat_2 {
    margin-left: 10px;
  }

  .chart-container {
    height: 100%;
    overflow: hidden;
    padding: 10px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .stat-block {
    background-color:#EFEFEF;
  }
}

.down-side {
  flex-direction: column;
  justify-content: center;
}

.chart-container {
  height: 100%;
  overflow: hidden;
  padding: 10px;
}

.down-side .statistic {
  background-image: url(../assets/images/Wave.svg);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: bottom;
  width: -webkit-fill-available;
}

.down-side .statistic .stat-container .stat-data {
  font-family: 'Prata', sans-serif;
}
</style>