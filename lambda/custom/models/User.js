const querystring = require('querystring');
const axios = require('axios');
let apiSettings = require('ApiSettings')

class User {

    constructor(){
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-api-user': apiSettings.user,
            'x-api-key': apiSettings.key
        } 
    }

    getTasks() {
        let data = querystring.stringify({
            type: 'todo',
        });
        return axios.get('https://habitica.com/api/v3/tasks/user', {
            headers: this.headers
        }); 
    }

    login(usrname,pwd){
        let data = querystring.stringify({
            username: usrname,
            password: pwd
        })
        return axios.post('https://habitica.com/api/v3/user/auth/local/login', data, {
            header: 'Content-Type: application/x-www-form-urlencoded'
        });
    }
}

module.exports = new User();