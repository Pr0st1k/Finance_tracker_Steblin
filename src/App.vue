<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <div class="flex">
    <!-- Хедер с бургер-меню -->
    <header class="header min-[1024px]:ml-20 max-lg:justify-between flex items-center fixed z-20">
      <img src="./assets/images/logo.svg" alt="" class="mini-logo w-[30%] h-full min-[1024px]:hidden ">
      <div class="max-lg:flex max-lg:justify-center max-lg:w-[30%] max-lg:h-full max-lg:items-center">
        <span class="font-semibold text-4xl max-[425px]:text-2xl max-[1023px]:text-white">{{ $route.meta.title }}</span>
      </div>
      <div class="burger-menu flex justify-center w-[20%] h-full items-center min-[1024px]:hidden" @click="toggleSidebar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </div>
    </header>

    <!-- Затемняющий фон -->
    <div
      v-if="isSidebarOpen"
      class="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 min-[1024px]:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Боковая панель -->
    <aside
      :class="[
        'sidebar flex flex-col items-center z-50 max-lg:min-w-[260px] max-[1023px]:right-0 min-lg:left-0',
        isSidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:translate-x-full',
        'max-lg:transition-transform max-lg:duration-300 max-lg:ease-in-out',
      ]"
    >
      <div class="absolute top-4 left-4 max-lg:block min-[1024px]:hidden" @click="toggleSidebar">
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
      <img src="/src/assets/images/logo.svg" class="logo mt-10 max-lg:hidden">
      <div class="mt-8 w-full flex flex-col items-center">
        <span class="min-[1024px]:hidden font-semibold text-2xl">Меню</span>
        <nav class="mb-4 flex flex-col min-lg:mt-5 max-lg:mt-8 2xl:ml-7 xl:ml-6">
          <router-link to="/" class="nav-link flex flex-row w-full items-center text-xl xl:text-2xl 2xl:text-[32px]" :class="{ 'font-semibold': $route.path === '/' }" @click="toggleSidebar">
            <img src="/src/assets/images/menu_total.svg" class="menu-icon 2xl:w-[41px] w-8 2xl:mr-8 mr-4">Общее
          </router-link>
          <router-link to="/transactions" class="nav-link flex flex-row w-full items-center text-xl xl:text-2xl 2xl:text-[32px]" :class="{ 'font-semibold': $route.path === '/transactions' }" @click="toggleSidebar">
            <img src="/src/assets/images/menu_transactions.svg" class="menu-icon 2xl:w-[41px] w-8 2xl:mr-8 mr-4">Транзакции
          </router-link>
          <router-link to="/statistics" class="nav-link flex flex-row w-full items-center text-xl xl:text-2xl 2xl:text-[32px]" :class="{ 'font-semibold': $route.path === '/statistics' }" @click="toggleSidebar">
            <img src="/src/assets/images/menu_stat.svg" class="menu-icon 2xl:w-[41px] w-8 2xl:mr-8 mr-4">Статистика
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- Основной контент -->
    <main class="main z-20">
      <router-view />
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Onest:wght@100..900&family=Prata&display=swap');

body {
  font-family: 'Onest', sans-serif;
}

.sidebar {
  width: 19%;
  height: 100vh; /* Высота на всю высоту экрана */
  position: fixed; /* Фиксированное положение */
  top: 0;
}

.main {
  position: fixed;
}

@media (min-width: 1024px) {
  main {
    left: 19%; /* Смещение на ширину сайдбара */
    top: 110px; /* Смещение на высоту хедера */
    width: calc(100% - 19%); /* Ширина минус ширина сайдбара */
    height: -webkit-fill-available;
    overflow-y: auto;
    background-color: #EFEFEF;
    padding: 30px;
  }
  header {
    left: 19%;
    height: 110px;
    position: relative;
    top: 0;
    height: 110px;
  }
  aside {
    background: linear-gradient(to bottom right, #CAD2C5, #486961);
  }
  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .nav-link {
    padding: 10px;
  }
}

@media (max-width: 1023px) {
  main {
    top: 110px; /* Смещение на высоту хедера */
    height: -webkit-fill-available;
    width: -webkit-fill-available;
    overflow-y: auto;
  }
  header {
    height: 110px;
    position: relative;
    top: 0;
    height: 110px;
    width: -webkit-fill-available;
    background: linear-gradient(to bottom right, #84A98C, #344B46);
    padding: 0 0 0 10px;
  }
  aside {
    border-radius: 20px 0 0 20px;
    background: linear-gradient(to bottom right, #FFFFFF, #BABABA);
  }

  .nav-link:hover {
    background-color: rgb(0 0 0 / 10%);
  }

  .nav-link {
    padding: 10px 10px 10px 2rem;
  }

}

nav {
  width: -webkit-fill-available;
}

.nav-link {
  font-weight: 300;
  color: #000000;
  text-decoration: none;
  transition: background-color 0.3s;
}

.logo {
  width: 250px;
}

.overlay {
  transition: opacity 0.3s ease-in-out;
}

.mini-logo {
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%);
}
</style>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const isSidebarOpen = ref(false);

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    return {
      isSidebarOpen,
      toggleSidebar,
    };
  },
};
</script>