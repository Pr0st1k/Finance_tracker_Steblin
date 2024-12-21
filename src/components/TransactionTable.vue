<template>
  <div class="table-container h-full xl:h-fit lg:p-[30px] p-[10px] flex flex-col justify-between">
    <!-- Кнопка для открытия сайдбара с фильтрами -->
    <div v-if="!showSidebar" class="filter-toggle-button" @click="toggleSidebar()">
      <img src="../assets/images/mobile_only/filter.svg" alt="Фильтры" width="29px" class="filter-icon">
    </div>

    <!-- Основной контент -->
    <div>
      <div class="flex-row justify-between md:flex hidden xl:mb-5">
        <span class="text-[32px] font-semibold">Список транзакций</span>
        <div class="xl:flex flex-row items-center hidden">
          <input
            v-model="filterTransactionId"
            class="transactionId-filter py-2.5 px-5 cursor-text"
            type="text"
            placeholder="№ транз. или №-№"
            id="transactionIdFilter"
          >
          <img src="/src/assets/images/Search.svg" alt="" width="24px" class="right h-fit relative right-10">
        </div>
      </div>
      <div class="table-content overflow-y-auto lg:max-h-[600px] max-h-[650px]">
        <table class="mt-4 w-full border-solid border-2 border-black-500">
          <thead>
            <tr class="border-solid border-2 border-b-black-500">
              <th class="p-2 sm:text-2xl font-medium hidden sm:table-cell text-xl">Номер</th>
              <th class="p-2 sm:text-2xl font-medium text-xl">Категория</th>
              <th class="p-2 sm:text-2xl font-medium text-xl">Сумма</th>
              <th class="p-2 sm:text-2xl font-medium text-xl">Дата</th>
              <th class="p-2 sm:text-2xl font-medium hidden lg:table-cell text-xl">Описание</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in displayedTransactions"
              :key="transaction.date"
              class="text-center border-solid border-2 border-b-black-500"
            >
              <td class="p-2 hidden sm:table-cell">{{ transaction.id }}</td>
              <td class="p-2">{{ transaction.category === 'income' ? 'Доход' : 'Расход' }}</td>
              <td class="p-2">{{ formatNumber(transaction.amount) }}</td>
              <td class="p-2">{{ formatDate(transaction.date) }}</td>
              <td class="p-2 hidden lg:table-cell">{{ transaction.description || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Кнопка "Загрузить еще" -->
    <div v-if="isMobileView && !isFullListLoaded" class="load-more-container max-lg:flex min-[1024px]:hidden justify-center items-center flex-col max-md:mb-5">
      <div class="mb-4 text-[12px]">Нажмите "Загрузить еще", чтобы отобразить полный список транзакций</div>
      <button @click="loadMore" class="load-more-button text-white py-2 px-7 rounded text-2xl">Загрузить еще</button>
    </div>

    <!-- Фильтры -->
    <div class="filter-container main-filter h-it flex min-w-[1400px]:flex-row max-[1400px]:flex-col md:items-center mt-5 max-md:hidden">
      <span class="text-[32px] font-semibold mr-8 mt-5">Фильтры:</span>
      <div class="mr-6 flex flex-col">
        <label for="categoryFilter">Тип</label>
        <select v-model="filterCategory" class="category-filter py-2.5 px-5 w-full cursor-pointer" id="categoryFilter">
          <option value="">Все</option>
          <option value="income">Доход</option>
          <option value="expense">Расход</option>
        </select>
      </div>
      <div class="mr-6">
        <label for="startDate">Дата от</label>
        <input v-model="filterStartDate" class="startDate-filter py-2.5 px-5 w-full cursor-text" type="date" id="startDate">
      </div>
      <div class="mr-10">
        <label for="endDate">Дата до</label>
        <input v-model="filterEndDate" class="endDate-filter py-2.5 px-5 w-full cursor-text" type="date" id="endDate">
      </div>
      <button @click="resetFilters" class="reset-filter bg-red-500 text-white py-2 xl:px-7 rounded text-xl xl:text-2xl mt-6">Сбросить фильтры</button>
    </div>

    <!-- Затемняющий фон -->
    <div
      v-if="showSidebar"
      class="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 min-[1440px]:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Сайдбар с фильтрами -->
    <div v-if="showSidebar" class="sidebar z-50">
      <div class="absolute top-4 left-4" @click="toggleSidebar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div class="flex justify-center items-center">
        <span class="text-[32px] font-semibold">Фильтры:</span>
      </div>
      <div class="filter-container sidebar-filter flex flex-col mt-5">
        <div class="flex flex-col mt-4">
          <label for="transactionIdFilter" class="mb-2">№ транзакции</label>
          <div class="flex flex-row items-center">
            <input
              v-model="filterTransactionId"
              class="transactionId-filter py-2.5 px-5 cursor-text"
              type="text"
              placeholder="№ транз. или №-№"
              id="transactionIdFilter"
            >
            <img src="/src/assets/images/Search.svg" alt="" width="24px" class="right h-fit absolute right-10">
          </div>
        </div>
        <div class="flex flex-col mt-4">
          <label for="categoryFilter" class="mb-2">Тип</label>
          <select v-model="filterCategory" class="category-filter py-2.5 px-5 w-full cursor-pointer" id="categoryFilter">
            <option value="">Все</option>
            <option value="income">Доход</option>
            <option value="expense">Расход</option>
          </select>
        </div>
        <div class="flex flex-col mt-4">
          <label for="startDate" class="mb-2">Дата от</label>
          <input v-model="filterStartDate" class="startDate-filter py-2.5 px-5 w-full cursor-text" type="date" id="startDate">
        </div>
        <div class="flex flex-col mt-4">
          <label for="endDate" class="mb-2">Дата до</label>
          <input v-model="filterEndDate" class="endDate-filter py-2.5 px-5 w-full cursor-text" type="date" id="endDate">
        </div>
        <button @click="resetFilters" class="reset-filter bg-red-500 text-white py-2 px-7 rounded text-2xl mt-6">Сбросить фильтры</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

export default {
  setup() {
    const store = useTransactionStore();

    // Состояние фильтров
    const filterCategory = ref('');
    const filterStartDate = ref('');
    const filterEndDate = ref('');
    const filterTransactionId = ref(''); 
    const showSidebar = ref(false); 
    const limit = ref(13); 
    const isFullListLoaded = ref(false); // Флаг для полного списка
    const isMobileView = ref(window.innerWidth < 1024); // Флаг для мобильного отображения

    // Фильтрация транзакций
    const filteredTransactions = computed(() => {
      let transactions = store.transactions;

      // Фильтр по категории
      if (filterCategory.value) {
        transactions = transactions.filter(transaction => transaction.category === filterCategory.value);
      }

      // Фильтр по дате
      if (filterStartDate.value || filterEndDate.value) {
        transactions = transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          const startDate = filterStartDate.value ? new Date(filterStartDate.value) : null;
          const endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;

          if (startDate && endDate) {
            return transactionDate >= startDate && transactionDate <= endDate;
          } else if (startDate) {
            return transactionDate >= startDate;
          } else if (endDate) {
            return transactionDate <= endDate;
          }
          return true;
        });
      }

      // Фильтр по номеру транзакции
      if (filterTransactionId.value) {
        const idRange = filterTransactionId.value.split('-');
        if (idRange.length === 1) {
          // Если введено одно число
          const singleId = parseInt(idRange[0], 10);
          transactions = transactions.filter(transaction => transaction.id === singleId);
        } else if (idRange.length === 2) {
          // Если введен диапазон
          const startId = parseInt(idRange[0], 10);
          const endId = parseInt(idRange[1], 10);
          transactions = transactions.filter(transaction => transaction.id >= startId && transaction.id <= endId);
        }
      }

      return transactions;
    });

    // Отображаемые транзакции
    const displayedTransactions = computed(() => {
      if (isFullListLoaded.value || !isMobileView.value) {
        return filteredTransactions.value;
      } else {
        return filteredTransactions.value.slice(0, limit.value);
      }
    });

    // Сброс фильтров
    const resetFilters = () => {
      filterCategory.value = '';
      filterStartDate.value = '';
      filterEndDate.value = '';
      filterTransactionId.value = ''; 
    };

    // Форматирование чисел и дат
    const formatNumber = (number) => {
      return number.toLocaleString('en-US', { useGrouping: false }).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    // Логика для кнопки "Загрузить еще"
    const loadMore = () => {
      isFullListLoaded.value = true;
    };

    // Логика для открытия/закрытия сайдбара
    const toggleSidebar = () => {
      showSidebar.value = !showSidebar.value;
    };

    // Определение мобильного отображения
    const updateMobileView = () => {
      isMobileView.value = window.innerWidth < 1024;
      if (!isMobileView.value) {
        isFullListLoaded.value = true; // Если экран больше 1024px, загружаем полный список
      } else {
        isFullListLoaded.value = false; // Если экран меньше 1024px, возвращаем лимит
      }
    };

    onMounted(() => {
      window.addEventListener('resize', updateMobileView);
      updateMobileView(); // Инициализация при загрузке
    });

    onUnmounted(() => {
      window.removeEventListener('resize', updateMobileView);
    });

    return {
      filterCategory,
      filterStartDate,
      filterEndDate,
      filterTransactionId,
      showSidebar,
      displayedTransactions,
      resetFilters,
      formatDate,
      formatNumber,
      loadMore,
      toggleSidebar,
      isMobileView,
      isFullListLoaded,
    };
  },
};
</script>

<style scoped lang="css">
.table-container {
  border-radius: 20px;
  background-color: #ffffff;
}

/* Стили для таблицы */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  border: 1px solid #ddd;
}

thead {
  background-color: #f9f9f9;
  position: sticky;
  top: 0;
  z-index: 1;
}

select.category-filter {
  min-width: 205px;
  height: 45px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.category-filter, .endDate-filter, .startDate-filter {
  border: 1px solid black;
  border-radius: 20px;
}

.reset-filter {
  border-radius: 20px;
  background: linear-gradient(to bottom right, #D62E14, #AB240F);
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25), inset -4px 4px 4px rgba(0, 0, 0, 0.25);
}

.transactionId-filter {
  height: 45px;
  border: 1px solid black;
  border-radius: 20px;
}

@media (max-width: 768px) {
  .description-column {
    display: none;
  }
}

.load-more-container {
  text-align: center;
}

.load-more-button {
  border-radius: 20px;
  background: linear-gradient(to bottom right, #84A98C, #52796F);
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25), inset -4px 4px 4px rgba(0, 0, 0, 0.25);
}

.filter-toggle-button {
  position: fixed;
  top: 160px;
  right: 0px;
  background: linear-gradient(to bottom right, #84A98C, #52796F);
  color: white;
  border-radius: 20px 0 0 20px;
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: white;
  border-radius: 20px 0 0 20px;
  box-shadow: -4px 0 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 20px;
  overflow-y: auto;
}

@media (min-width: 1441px) {
  .sidebar, .filter-toggle-button {
    display: none;
  }
}

@media (min-height: 1000px) {
  .table-container {
    height: 100%;
  }
}

@media (max-width: 1440px) {
  .filter-container.main-filter {
    display: none;
  }
}

.filter-icon {
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
}
</style>