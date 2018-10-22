const querystring = require('querystring');
const axios = require('axios');
const apiSettings = require('ApiSettings')

class Task {

    constructor(){
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-api-user': apiSettings.user,
            'x-api-key': apiSettings.key
        } 
    }

    addTask(task) {
        let data = querystring.stringify({
            text: task,
            type: 'todo',
            alias: task.replace(" ","")
        });
        return axios.post('https://habitica.com/api/v3/tasks/user', data, {
            headers: this.headers
        });
    }

    deleteTask(task) {
        let data = task.replace(" ","")
        return axios.delete('https://habitica.com/api/v3/tasks/'+ data, {
            headers: this.headers
        });
    }

    scoreUp(task) {
        let data = querystring.stringify({});
        return axios.post("https://habitica.com/api/v3/tasks/"+ task +"/score/up", data, {
            headers: this.headers
        });
    }
}

module.exports = new Task();