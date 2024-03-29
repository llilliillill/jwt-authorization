import $api from "@/http";

export class AuthService {
    static async login(userObj) {
        return $api.post('/login', userObj)
    }

    static async registration(userObj) {
        return $api.post('/registration', userObj)
    }

    static async logout() {
        return $api.post('/logout')
    }
}



