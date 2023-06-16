import HttpProvider from './HttpProvider';

export default class UserProvider {

    static logIn(data) {
        return HttpProvider.post('login', data).then(response => response.data);
    }

    static signUp(data) {
        return HttpProvider.post('signup', data).then(response => response.data);
    }    

}