<template>
    <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        class="menu"
    >
        <a-menu-item key="users">
            <router-link to="/">Users</router-link>
        </a-menu-item>

        <a-menu-item key="profile">
            <router-link to="/profile">Profile</router-link>
        </a-menu-item>

        <a-menu-item key="dialogs">
            <router-link to="/dialogs">Dialogs</router-link>
        </a-menu-item>

        <a-menu-item key="chat">
            <router-link to="/chat">Chat</router-link>
        </a-menu-item>
    </a-menu>
</template>

<script>
    export default {
        data() {
            return {
                selectedKeys: ['users']
            }
        },

        // При переходе по ссылке активируем нужный tab в header
        mounted() {
            this.selectedKeys = [
                window.location.pathname.replace('/', '')
            ]
        }
    }
</script>
