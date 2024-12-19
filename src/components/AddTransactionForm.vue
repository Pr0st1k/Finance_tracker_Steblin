<template>
  <div class="grid grid-cols-3 max-xl:grid-cols-1 h-full">
    <div class="left-side col-span-2 mr-8 max-xl:col-span-1 max-xl:mr-0 flex flex-col">
      <!-- Блок статистики -->
      <div class="stat flex flex-row justify-between lg:mb-8 max-xl:hidden">
        <div class="income flex flex-col items-center justify-center text-[42px] font-extrabold text-center text-white">
          <span class="h-[54px]">{{ formatNumber(totalIncome) }}</span>
          <span class="text-4xl font-bold h-[46px]">Доходы</span>
        </div>
        <div class="expense flex flex-col items-center justify-center text-[42px] font-extrabold text-center text-white">
          <span class="h-[54px]">{{ formatNumber(totalExpense) }}</span>
          <span class="text-4xl font-bold h-[46px]">Расходы</span>
        </div>
        <div class="balance flex flex-col items-center justify-center text-[42px] font-extrabold text-center text-white">
          <span class="h-[54px]">{{ formatNumber(balance) }}</span>
          <span class="text-4xl font-bold h-[46px]">Баланс</span>
        </div>
      </div>

      <!-- Форма добавления транзакции -->
      <form @submit.prevent="addTransaction" class="add_form flex-1 overflow-auto max-[1024px]:justify-between max-[1024px]:flex max-[1024px]:flex-col">
        <span class="block text-black font-semibold text-[32px] ml-2.5 lg:mb-6 max-lg:hidden">Добавление</span>
        <div>
          <div class="mb-4 w-[60%] min-w-[200px] flex flex-col">
            <div class="flex">
              <select v-model="category" class="select-input w-[30%] min-w-[200px] custom-select border bg-[#D9D9D9] px-[30px] text-[32px] tracking-[.02em] flex items-center font-medium cursor-pointer" required>
                <option value="income" class="font-medium">Доход</option>
                <option value="expense" class="font-medium">Расход</option>
              </select>
              <div class="right-10 relative content-center min-w-[50px]">
                <img src="/src/assets/images/angle_down.svg" alt="" width="16px" height="fit-content" style="transform: rotate(180deg);">
                <img src="/src/assets/images/angle_down.svg" alt="" width="16px" height="fit-content">
              </div>
            </div>
          </div>
          <div class="mb-4 w-[30%] min-w-[200px]">
            <input
              v-model="amount"
              @input="handleAmountInput"
              class="amount-input border w-full bg-[#D9D9D9] px-[30px] text-[32px] tracking-[.02em] flex items-center font-medium min-w-[200px]"
              type="number"
              min="1"
              placeholder="Сумма"
              required
            >
          </div>
          <div class="mb-4 w-[50%] min-w-[280px]">
            <input v-model="date" class="data-input border w-full bg-[#D9D9D9] px-[30px] text-[32px] tracking-[.02em] flex items-center font-medium cursor-pointer" type="date" required>
          </div>
          <div class="mb-4 w-full min-h-[60px] min-w-[280px]">
            <textarea v-model="description" class="description-input border w-full h-[60px] min-w-[280px] bg-[#D9D9D9] px-[30px] max-[1024px]:py-[10px] py-[5px] max-lg:py-0 text-[32px] max-[400px]:text-[28px] tracking-[.02em] flex items-center font-medium" maxlength="40" placeholder="Краткое описание транзакции"></textarea>
          </div>
          <div class="all-info mb-4 w-fit max-[1024px]:mt-7">
            <span class="text-[32px] font-medium tracking-[.02em]">Транзакция №{{ transactionId }} от {{ formatDate(date) }} ({{ category === 'income' ? 'Доход' : 'Расход' }}) на сумму {{ amount }}</span>
          </div>
        </div>
        <div class="flex flex-row justify-between max-[1024px]:relative">
          <button @click="resetForm" class="clear-form p-2 text-[32px] tracking-[.02em] font-medium align-middle max-[520px]:w-[180px] max-[520px]:text-2xl">Очистить</button>
          <button type="submit" class="submit-form p-2 text-[32px] tracking-[.02em] font-medium align-middle max-[520px]:w-[180px] max-[520px]:text-2xl text-white">Создать</button>
        </div>
      </form>
    </div>

    <!-- Блок списка транзакций -->
    <div class="right-side max-xl:hidden">
      <div class="transaction-list flex flex-col items-center justify-between">
        <div class="w-full flex flex-col items-center">
          <span class="text-[32px] font-semibold mt-5">Транзакции</span>
          <table class="mt-5 w-full">
            <thead>
              <tr>
                <th class="p-2 text-2xl font-medium">Номер</th>
                <th class="p-2 text-2xl font-medium">Тип</th>
                <th class="p-2 text-2xl font-medium">Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in lastTenTransactions" :key="transaction.id" class="text-center border-solid border-2 border-b-black-500">
                <td class="p-2 text-2xl font-medium">№{{ transaction.id }}</td>
                <td class="p-2 text-2xl font-medium">{{ transaction.category === 'income' ? 'Доход' : 'Расход' }}</td>
                <td class="p-2 text-2xl font-medium">{{ formatNumber(transaction.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="showall-button text-black text-[32px] font-medium flex justify-center items-center my-5">
          <router-link to="/transactions">Показать все</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

export default {
  setup() {
    const store = useTransactionStore();

    const category = ref('income');
    const amount = ref(0);
    const date = ref(new Date().toISOString().split('T')[0]);
    const description = ref('');

    const transactionId = computed(() => {
      return store.transactions.length > 0 ? store.transactions[store.transactions.length - 1].id + 1 : 1;
    });

    const resetForm = () => {
      category.value = 'income';
      amount.value = '';
      date.value = new Date().toISOString().split('T')[0];
      description.value = '';
    };

    const handleAmountInput = (event) => {
      const value = event.target.value;
      if (value.length > 8) {
        amount.value = value.slice(0, 8);
      }
    };

    const formatNumber = (number) => {
      if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M'; // Миллионы
      } else {
        return number.toLocaleString('en-US', { useGrouping: false }).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
    };

    const addTransaction = () => {
      store.addTransaction({
        category: category.value,
        amount: parseFloat(amount.value),
        date: date.value,
        description: description.value,
      });

      alert('Форма отправлена!');
      resetForm();
      window.location.reload();
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    const lastTenTransactions = computed(() => {
      return store.transactions.slice(-13).reverse();
    });

    return {
      category,
      amount,
      date,
      description,
      transactionId,
      addTransaction,
      formatDate,
      formatNumber,
      totalIncome: store.totalIncome,
      totalExpense: store.totalExpense,
      balance: store.balance,
      lastTenTransactions,
      resetForm,
      handleAmountInput,
    };
  },
};
</script>

<style lang="css" scoped>
  main {
    padding: 30px;
  }
  .add_form {
    background-color: #ffffff;
    border-radius: 20px;
    padding: 30px 50px 30px 50px;
  }

  select {
    height: 60px;
    border-radius: 20px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }

  input {
    height: 60px;
    border-radius: 20px;
  }

  input.data-input {
    min-width: 100%;
  }

  textarea.description-input {
    width: 100%;
    border-radius: 20px;
    resize: none;
    overflow-y: hidden;
  }

  input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
  }

  input[type="date"] {
    position: relative;
    padding-right: 40px; 
  }

  input[type="date"]::after {
    content: url('/src/assets/images/calendar.svg'); 
    position: absolute;
    right: 20px; 
    top: 56%;
    transform: translateY(-50%);
    pointer-events: none; 
  }

  @media (min-width: 1024px) {
    .submit-form, .clear-form {
      width: 230px;
    }
    form {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  }

  .submit-form {
    height: 55px;
    background: linear-gradient(to bottom right, #9cb788, #435c57);
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(0, 0, 0, 0.25);
  }

  .submit-form:hover {
    background: linear-gradient(to bottom right, #90b576, #273633);
    color: white;
  }

  .clear-form {
    height: 55px;
    background: #ffffff;
    border: 1px solid black;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(0, 0, 0, 0.25);
  }

  .clear-form:hover {
    background: linear-gradient(to bottom right, #ffffff, #BABABA);
  }

  .stat div {
    width: 30%;
    height: 170px;
    border-radius: 20px;
  }

  .stat div span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stat div.income {
    background-color: #52796F;
  }

  .stat div.expense {
    background-color: #3C5A52;
  }

  .stat div.balance {
    background-color: #2F3E46;
  }

  .stat div span {
    max-width: 250px;
  }

  .transaction-list {
    background-color: #ffffff;
    height: 100%;
    border-radius: 20px;
  }

  .showall-button {
    position: relative;
    border-radius: 20px;
    background: linear-gradient(to bottom right, #9cb788, #435c57);
    width: 80%;
    height: 66px;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25), inset -4px -4px 4px rgba(0, 0, 0, 0.25);
    text-align: center;
  }
  
  .showall-button:hover {
    background: linear-gradient(to bottom right, #90b576, #273633);
    color: white;
  }

  @media (max-width: 1024px) {
    .add_form {
      padding: 30px;
    }
    .description-input {
      height: fit-content; 
      word-wrap: break-word; 
    }
    .submit-form, .clear-form {
      width: 40%;
    }
    .all-info {
      border: 1px solid black; 
      border-radius: 20px;
      padding: 20px 15px;
    }
  }
</style>