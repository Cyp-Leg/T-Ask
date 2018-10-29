const querystring = require('querystring');
const axios = require('axios');
let apiSettings = require('ApiSettings')

class Todo {

    getHeaders(){
        return {
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
            headers: this.getHeaders()
        });
    }

    getTodos() {
        return axios.get("https://habitica.com/api/v3/tasks/user?type=todos", {
            headers: this.getHeaders()
        });
    }

    deleteTodo(taskId) {
        return axios.delete('https://habitica.com/api/v3/tasks/'+ taskId, {
            headers: this.getHeaders()
        });
    }

    scoreUp(taskId) {
        let data = querystring.stringify({});
        return axios.post("https://habitica.com/api/v3/tasks/"+ taskId +"/score/up", data, {
            headers: this.getHeaders()
        });
    }

    scoreDown(taskId) {
        let data = querystring.stringify({});
        return axios.post("https://habitica.com/api/v3/tasks/"+ taskId +"/score/down", data, {
            headers: this.getHeaders()
        });
    }

}

module.exports = new Todo();