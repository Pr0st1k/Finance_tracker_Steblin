import { defineStore } from "pinia"

export const useTransactionStore = defineStore('transactions', {

    state: () => ({
       transactions : JSON.parse(localStorage.getItem('transactions')) || [] // Создаем массив "транзакций", в который помещаем элементы хранящиеся в хранилище localStorage, под id = transactions, а если данных в localStorage - нет, то массив остается пустым. Это позволит сохранять транзакции в системе.
    }), // Начальное состояние

    getters: {
        totalIncome: (state) => state.transactions.filter(t => t.category === 'income').reduce((sum, t) => sum + t.amount, 0), // Расчет всех полученных средств
        totalExpense: (state) => state.transactions.filter(t => t.category === "expense").reduce((sum, t) => sum + t.amount, 0), // Расчет всех потраченных средств
        balance: (state) => state.totalIncome - state.totalExpense, // Расчет баланса

        countIncome: (state) => state.transactions.filter(t => t.category === 'income').length, // Количество доходных транзакций
        countExpense: (state) => state.transactions.filter(t => t.category === 'expense').length, // Количество расходных транзакций

        maxIncome: (state) => {
           const incomeTransactions = state.transactions.filter(t => t.category === 'income') 
           if (incomeTransactions.length === 0) {
            return 0
           }
           else {
            return Math.max(...incomeTransactions.map(t => t.amount));
           }
        },
    }, // Вычисляемые свойства, расчитывающиеся на основе "state"

    actions: {
        addTransaction(transaction) {
            const id = this.transactions.length > 0 ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1; // Генерируем уникальный номер для новой транзакции
            this.transactions.push({ ...transaction, id }); // Пушим (добавляем элемент transaction в конец массива "transactions", который хранится в хранилище pinia)
            localStorage.setItem('transactions', JSON.stringify(this.transactions)); // Помещаем информацию о массиве transactions в localStorage под ключем 'transactions', преобразуя массив this.transactions в строку.
        }, // Функция добавления новой операции в массив транзакий и отправка данного массива в хранилище pinia и localStorage

        filterByDate(startDate, endDate) {
            return this.transactions.filter(t => {
                const transactionDate = new Date(t.date); // Преобразуем строку даты транзакции в объект Date
                const start = startDate ? new Date(startDate) : null; // Если startDate указана, преобразуем её в объект Date, иначе присваиваем null
                const end = endDate ? new Date(endDate) : new Date(); // Если endDate указана, преобразуем её в объект Date, иначе используем текущую дату

                if (start && end) { // Если указаны и startDate, и endDate
                    return transactionDate >= start && transactionDate <= end; // Возвращаем true, если transactionDate находится между start и end
                } else if (start) { // Если указана только startDate
                    return transactionDate >= start; // Возвращаем true, если transactionDate больше или равна start
                } else if (end) { // Если указана только endDate
                    return transactionDate <= end; // Возвращаем true, если transactionDate меньше или равна end
                }
                return true; // Возвращаем true для всех транзакций
            });
        },

        filterByCategory(category) {
            return this.transactions.filter(t => t.category === category);
        },
    }, // Аналог методов, которые выполняют определенные задачи
})