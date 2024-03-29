<template>
    <a-form
      :model="formState"
      name="normal_login"
      class="regist-form"
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
            name="username"
            :rules="[{ required: true, message: 'Введите имя пользователя!' }]"
        >
            <a-input v-model:value="formState.username" placeholder="Имя пользователя">
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

        <a-form-item
            name="password2"
            :rules="[{ required: true, message: 'Пароли не совпадают!' }]"
        >
            <a-input-password v-model:value="formState.password2" placeholder="Пароль">
                <template #prefix>
                    <LockOutlined class="site-form-item-icon" />
                </template>
            </a-input-password>
        </a-form-item>

        <a-form-item>
            <a-button 
                type="primary" 
                html-type="submit" 
                class="regist-form-button"
                :disabled="!(
                    this.formState.email && 
                    this.formState.username && 
                    this.formState.password &&
                    this.formState.password2
                )"
            >
                Зарегистрироваться
            </a-button>
        </a-form-item> 
    </a-form>
</template>
  
<script setup>
    import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
</script>

<script>
    export default {

        data() {
            return {
                formState: {
                    email: '',
                    username: '',
                    password: '',
                    password2: ''
                }
            }
        },

        methods: {
            onSubmit() {
                $store.dispatch('registration', { 
                    email: this.formState.email, 
                    username: this.formState.username,
                    password: this.formState.password 
                })
                this.$emit('close')
                this.formState = {
                    email: '',
                    username: '',
                    password: '',
                    password2: ''
                }
            }
        }

    }
</script>

<style scoped>
    .regist-form {
        height: 270px;
        padding-top: 15px;
    }
    .regist-form-button {
        width: 100%;
    }
</style>