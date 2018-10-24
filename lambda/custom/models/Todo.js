const querystring = require('querystring');
const axios = require('axios');
const apiSettings = require('ApiSettings')

class Todo {

    constructor(){
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-api-user': apiSettings.user,
            'x-api-key': apiSettings.key
        } 
    }

    addTodo(todo) {
        let data = querystring.stringify({
            text: todo,
            type: 'todo'
        });
        return axios.post('https://habitica.com/api/v3/tasks/user', data, {
            headers: this.headers
        });
    }

    getTodos() {
        return axios.get("https://habitica.com/api/v3/tasks/user?type=todos", {
            headers: this.headers
        });
    }

    deleteTodo(taskId) {
        return axios.delete('https://habitica.com/api/v3/tasks/'+ taskId, {
            headers: this.headers
        });
    }

    scoreUp(taskId) {
        let data = querystring.stringify({});
        return axios.post("https://habitica.com/api/v3/tasks/"+ taskId +"/score/up", data, {
            headers: this.headers
        });
    }

    scoreDown(taskId) {
        let data = querystring.stringify({});
        return axios.post("https://habitica.com/api/v3/tasks/"+ taskId +"/score/down", data, {
            headers: this.headers
        });
    }

}

module.exports = new Todo();