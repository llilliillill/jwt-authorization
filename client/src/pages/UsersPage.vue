<template>
    <div>
        <h2>Users page</h2>
        <br>
        <div v-if="isAuth">
            <div class="btns">
                <a-button type="primary" @click="$store.dispatch('getUsers')">
                    Получить пользователей
                </a-button>
                <a-button @click="() => { $store.commit('setUsers', []) }">
                    Скрыть
                </a-button>
            </div>

            <div class="list-users">
                <div class="item-user" v-for="user in this.users" :key="user.id">
                    <h4 class="title">{{ user.email }}</h4>
                    <span class="status">
                        {{ status[user.isActivated] }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex'

    export default {
        computed: {
            ...mapState({
                isAuth: state => state.isAuth,
                isLoading: state => state.isLoading,
                users: state => state.users,
                status: state => state.status
            })
        },

        methods: {
            ...mapMutations({
                setUsers: 'setUsers'
            })
        }
    }
</script>

<style scoped>
    .btns {
        max-width: 280px;
        display: flex;
        justify-content: space-between;
    }

    .list-users {
        margin-top: 10px;
    }

    .item-user {
        border: 1px solid gray;
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 10px;
        max-width: 280px;
        display: flex;
    }

    .title {
        flex: 1;
    }

    .status {
        font-weight: bold;
        color: green;
    }
</style>
