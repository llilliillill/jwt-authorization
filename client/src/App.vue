<template>
  <div>
    <!-- Login -->
    <a-modal 
      width="350px"
      v-model:open="loginModal" 
      title="Вход/Регистрация" 
      :footer="null"
    >
      <form-login 
        @close="() => { this.loginModal = false }"
        @registr="onRegistr" 
        @forgot="onForgot"
      />
    </a-modal>

    <!-- Regist -->
    <a-modal 
      width="350px"
      v-model:open="registModal" 
      title="Регистрация" 
      :footer="null"
    >
      <form-regist 
        @close="() => { this.registModal = false }"
      />
    </a-modal>

    <!-- Forgot -->
    <a-modal 
      width="350px"
      v-model:open="forgotModal" 
      title="Восстановить пароль" 
      :footer="null"
    >
      <form-forgot />
    </a-modal>

    <a-layout>
      <a-layout-header class="layout-header">
        <div class="header-content">

          <router-link to="/">
            <CodeOutlined class="logo-icon" />
          </router-link>

          <navbar />

          <div v-if="!isLoading" class="btns">
            <a-button v-if="!isAuth" type="primary" @click="() => { this.loginModal = true }">
              Вход/Регистрация
            </a-button>

            <div class="user" v-else>
              <div class="user-data">{{ user.email }}</div>
              <a-button type="primary" @click="$store.dispatch('logout')">
                Выход
              </a-button>
            </div>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content class="layout-content">
        <div class="wrapper">
          <router-view />
        </div>
      </a-layout-content>

      <a-layout-footer class="footer">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>

    </a-layout>
  </div>
</template>

<script setup>
  import { CodeOutlined } from '@ant-design/icons-vue';
</script>

<script>
  import Navbar from './components/UI/Navbar.vue'
  import FormLogin from '@/components/FormLogin.vue';
  import FormRegist from './components/FormRegist.vue';
  import FormForgot from './components/FormForgot.vue';
  import { mapState, mapActions } from 'vuex';

  export default {

    components: {
      FormLogin,
      FormRegist,
      FormForgot,
      Navbar
    },

    mounted() {
      if (localStorage.getItem('token')) {
        this.$store.dispatch('checkAuth')
      }
    },

    data() {
      return {
        loginModal: false,
        registModal: false,
        forgotModal: false
      }
    },

    computed: {
      ...mapState({
        isAuth: state => state.isAuth,
        user: state => state.user,
        isLoading: state => state.isLoading,
      })
    },

    methods: {
      onRegistr() {
        this.loginModal = false
        this.registModal = true
      },

      onForgot() {
        this.loginModal = false
        this.forgotModal = true 
      },

      ...mapActions({
        logout: 'logout'
      })
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }
</style>

<style scoped>

  /* .anchor {
    background: white; 
    height: 100%; 
    display: flex;
    align-items: center;
  } */

  .logo-icon {
    color: white; 
    font-size: 45px; 
    line-height: 1.5;
    margin: 0 20px;
  }

  .layout-header {
    position: fixed;
    z-index: 1; 
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .header-content {
    display: flex;
    width: 100%;
    max-width: 1200px;
  }

  .menu {
    line-height: 64px;
    flex: 1;
  }

  .layout-content {
    margin: 0 auto;
    width: 100%;
    max-width: 1300px;
    padding: 0 50px;
    margin-top: 64px;
  }

  .wrapper {
    background: #fff;
    padding: 24px;
    min-height: 1380px;
    margin: 16px 0;
  }

  .btns {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .user {
    display: flex;
    align-items: center;
  }

  .user-data {
    color: white;
    margin: 0 10px;
  }

  .footer {
    text-align: center;
  }

  .site-layout .site-layout-background {
    background: #fff;
  }

  [data-theme='dark'] .site-layout 
  .site-layout-background {
    background: #141414;
  }
</style>
