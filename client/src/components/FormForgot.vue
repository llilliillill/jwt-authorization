<template>
    <a-form
    :model="formState"
    name="normal_login"
    class="forgot-form"
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

    <a-form-item>
      <a-button 
        type="primary" 
        html-type="submit" 
        class="forgot-form-button"
        :disabled="!formState.email"
      >
        Восстановить пароль
      </a-button>
    </a-form-item> 
  </a-form>
</template>
  
<script setup>
  import { UserOutlined } from '@ant-design/icons-vue';
</script>
    
<script>
  export default {

    data() {
      return {
        formState: {
          email: ''
        }
      }
    },

    methods: {
      onSubmit() {
        this.formState = {
          email: '',
        }
      }
    }

  }
</script>
  
<style scoped>
  .forgot-form {
    height: 110px;
    padding-top: 15px;
  }
  .forgot-form-button {
    width: 100%;
  }
</style>