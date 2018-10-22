const querystring = require('querystring');
const axios = require('axios');
const apiSettings = require('ApiSettings')

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
        return axios.get('https://habitica.com/api/v3/tasks/user', data, {
            headers: this.headers
        }); 
    }
}

module.exports = new User();