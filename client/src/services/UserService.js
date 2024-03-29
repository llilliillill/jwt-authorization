import $api from "@/http";

export class UserService {
    static featchUsers() {
        return $api.get('/users')
    }
}