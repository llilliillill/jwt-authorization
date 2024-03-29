<template>
  <a-form
    :model="formState"
    name="normal_login"
    class="login-form"
    @submit.prevent="onSubmit"
  >
    <a-form-item
      name="email"
      :rules="[{ required: true, message: 'Введите email!' }]"
    >
      <a-input v-model:value="formState.email" placeholder="Email">
        <template #prefix>
          <UserOutlined class="site-form-item-icon" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      name="password"
      :rules="[{ required: true, message: 'Введите пароль!' }]"
    >
      <a-input-password v-model:value="formState.password" placeholder="Пароль">
        <template #prefix>
          <LockOutlined class="site-form-item-icon" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item>
      <a-form-item name="remember" no-style>
        <a-checkbox v-model:checked="formState.remember">запомнить меня</a-checkbox>
      </a-form-item>
      <a class="login-form-forgot" @click="() => { this.$emit('forgot') }">забыли пароль</a>
    </a-form-item>

    <a-form-item>
      <a-button 
        type="primary" 
        html-type="submit" 
        class="login-form-button"
        :disabled="!(this.formState.email && this.formState.password)"
      >
        Войти
      </a-button>
      или
      <a @click="() => { this.$emit('registr') }">зарегистрироваться</a>
    </a-form-item> 
  </a-form>
</template>

<script setup>
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
</script>
  
<script>
  import { mapActions, mapState } from 'vuex'

  export default {

    data() {
      return {
        formState: {
          email: '',
          password: '',
          remember: true
        }
      }
    },

    computed: {
      ...mapState({
        isAuth: state => state.isAuth,
        isLoading: state => state.isLoading,
      })
    },

    methods: {

      onSubmit() {
        this.$store.dispatch('login', { 
          email: this.formState.email, 
          password: this.formState.password 
        })
        this.$emit('close')
        this.formState = {
          email: '',
          password: ''
        }
      },

      ...mapActions({
        login: 'login'
      })
      
    }

  }
</script>
  
<style scoped>
  .login-form {
    height: 235px;
    padding-top: 15px;
  }
  .login-form-forgot {
    float: right;
  }
  .login-form-button {
    width: 100%;
  }
</style>