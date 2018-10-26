const Alexa = require("alexa-sdk");
const config = require("../config");
const Todo = require('../models/Todo');
const User = require('../models/User');
const Daily = require('../models/Daily');
const Habit = require('../models/Habit');
var stringSimilarity = require('string-similarity');
const ApiSettings = require('../ApiSettings');
const util = require('util')
var express = require('express')
var app = express()
var bodyParser = require('body-parser')


var username = "test";
var password = "test";

const welcomeHandlers = Alexa.CreateStateHandler(config.WELCOME_STATE, {
    

    Welcome() {
        this.response.speak("Bienvenue sur Habitica, que voulez-vous faire ?").listen();
        this.emit(":responseReady");
    },

/*
    LoginIntent() {
        that.emit(':tell','Veuillez entrer votre username');
        var usrname = this.event.request.intent.slots.usrname.value
        let that = this;
        if(usrname){
            that.emit(':ask', "Veuillez entrer votre mot de passe");
            User.login(usrname,pwd)
            .then(function (response) { 
                that.emit(':ask', "Vous êtes bien connecté.");
            })
            .catch(function (error) {
                that.emit(':ask', "Erreur de connexion", error.message);
            });
        }
    },
*/
    SetUsernameIntent() {
        var usrname = this.event.request.intent.slots.usrname.value
        let that = this;
        if(usrname){
            this.username=usrname;
            ApiSettings.username=usrname;
            this.response.speak("Veuillez maintenant entrer votre mot de passe").listen();
            this.emit(":responseReady");
        }
        else{
            this.emit(':ask', "Je n'ai pas compris votre nom d'utilisatreur.", "Aucune tâche spécifiée.");
        }
    },


    SetPasswordIntent() {
        var pwd = this.event.request.intent.slots.pwd.value
        let that = this;
        if(pwd){
            this.password=pwd
            ApiSettings.password=pwd;
            User.login(ApiSettings.username,ApiSettings.password).then((result)=>{
                app.use(bodyParser.urlencoded({ extended: false }))
                app.use(bodyParser.json())
                this.emit(':tell', "Voici vos identifiants, id : "+JSON.stringify(result.body, null, 2))
            }).catch((err)=>{
                this.emit(':tell', "Il y a eu une erreur : " + err)
            })
        }
        else{
            this.emit(':ask', "Je n'ai pas compris votre nom d'utilisatreur.", "Aucune tâche spécifiée.");
        }
    },


    AddTodoIntent() {
        var task = this.event.request.intent.slots.task.value
        let that = this;
        if(task){
            Todo.addTodo(task)
            .then(function (response) {
                that.emit(':ask', "La tâche : " + task + " a bien été ajoutée !", "Autre ?");
            })
            .catch(function (error) {
                that.emit(':ask', "La tâche : " + task + " n'a pas été ajoutée...", error.message);
            });
        }
        else{
            this.emit(':ask', "Vous n'avez spécifié aucune tâche.", "Aucune tâche spécifiée.");
        }
    },

    DelTodoIntent() {
        var task = this.event.request.intent.slots.task.value
        let that = this;
        if(task){
            Todo.getTodos(task)
            .then(function(response){
                let todos = response.data.data;
                let todosText = todos.map(t => t.text);
                let bestMatch = stringSimilarity.findBestMatch(task, todosText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let taskId = todos.filter(t => t.text == bestMatch.target)[0].id;
                    Todo.deleteTodo(taskId)
                    .then(function(response){
                        that.emit(':tell', "La tâche : "+ bestMatch.target +" a bien été supprimée !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "La tâche n'a pas été trouvée. Peut-être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }

            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos tâches.");
            })
        }
    },

    ScoreUpTodoIntent() {
        var task = this.event.request.intent.slots.task.value
        let that = this;
        if(task){
            Todo.getTodos(task)
            .then(function(response){
                let todos = response.data.data;
                let todosText = todos.map(t => t.text);
                let bestMatch = stringSimilarity.findBestMatch(task, todosText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let taskId = todos.filter(t => t.text == bestMatch.target)[0].id;
                    Todo.scoreUp(taskId)
                    .then(function(response){
                        that.emit(':tell', "La tâche : "+ bestMatch.target +" a bien été validée !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "La tâche n'a pas été trouvée. Peut-être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }

            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos tâches.");
            })
        }
    },

    AddHabitIntent() {
        var habit = this.event.request.intent.slots.habit.value
        let that = this;
        if(habit){
            Habit.addHabit(habit)
            .then(function (response) {
                that.emit(':tell', "L'habitude : " + habit + " a bien été ajoutée !");
            })
            .catch(function (error) {
                that.emit(':tell', "L'habitude : " + habit + " n'a pas été ajoutée...");
            });
        }
        else{
            this.emit(':tell', "No habit");
        }
    },

    DelHabitIntent() {
        var task = this.event.request.intent.slots.habit.value
        let that = this;
        if(task){
            Habit.getHabits(task)
            .then(function(response){
                let habits = response.data.data;
                let habitsText = habits.map(h => h.text);
                let bestMatch = stringSimilarity.findBestMatch(task, habitsText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let habitId = habits.filter(h => h.text == bestMatch.target)[0].id;
                    Habit.deleteHabit(habitId)
                    .then(function(response){
                        that.emit(':tell', "L'habitude : "+ bestMatch.target +" a bien été supprimée !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "L'habitude n'a pas été trouvée. Peut-être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }

            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos habitudes." + error);
            })
        }
    },

    ScoreUpHabitIntent() {
        var task = this.event.request.intent.slots.habit.value
        let that = this;
        if(task){
            Habit.getHabits(task)
            .then(function(response){
                let habits = response.data.data;
                let habitText = habits.map(h => h.text);
                let bestMatch = stringSimilarity.findBestMatch(task, habitText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let taskId = habits.filter(h => h.text == bestMatch.target)[0].id;
                    Todo.scoreUp(taskId)
                    .then(function(response){
                        that.emit(':tell', "Le score de l'habitude : "+ bestMatch.target +" a bien été incrémenté !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "L'habitude n'a pas été trouvée. Peut-être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }

            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos habitudes.");
            })
        }
    },


    ScoreDownHabitIntent() {
        var task = this.event.request.intent.slots.habit.value
        let that = this;
        if(task){
            Habit.getHabits(task)
            .then(function(response){
                let habits = response.data.data;
                let habitText = habits.map(h => h.text);
                let bestMatch = stringSimilarity.findBestMatch(task, habitText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let taskId = habits.filter(h => h.text == bestMatch.target)[0].id;
                    Todo.scoreDown(taskId)
                    .then(function(response){
                        that.emit(':tell', "Le score de l'habitude : "+ bestMatch.target +" a bien été décrémentée !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "L'habitude n'a pas été trouvée. Peut-être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }

            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos habitudes.");
            })
        }
    },


    
    //DAILYS
    AddDailyIntent() {
        var daily = this.event.request.intent.slots.daily.value
        let that = this;
        if(daily){
            Daily.addDaily(daily)
            .then(function (response) {
                that.emit(':tell', "La tâche quotidienne : " + daily + " a bien été ajoutée !");
            })
            .catch(function (error) {
                that.emit(':tell', "La tâche quotidienne : " + daily + " n'a pas été ajoutée...");
            });
        }
        else{
            this.emit(':tell', "Aucune tâche quotidienne ajoutée");
        }
    },

    DelDailyIntent() {
        var daily = this.event.request.intent.slots.daily.value
        let that = this;
        if(daily){
            Daily.getDailys(daily)
            .then(function(response){
                let dailys = response.data.data;
                let dailysText = dailys.map(h => h.text);
                let bestMatch = stringSimilarity.findBestMatch(daily, dailysText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let dailyId = dailys.filter(h => h.text == bestMatch.target)[0].id;
                    Daily.deleteDaily(dailyId)
                    .then(function(response){
                        that.emit(':tell', "La tâche quotidienne : "+ bestMatch.target +" a bien été supprimée !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "La tâche quotidienne n'a pas été trouvée. Peut-être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }

            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos tâches quotidiennes." + error);
            })
        }
    },



    ScoreUpDailyIntent() {
        var task = this.event.request.intent.slots.daily.value
        let that = this;
        if(task){
            Daily.getDailys(task)
            .then(function(response){
                let dailys = response.data.data;
                let dailyText = dailys.map(h => h.text);
                let bestMatch = stringSimilarity.findBestMatch(task, dailyText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let taskId = dailys.filter(h => h.text == bestMatch.target)[0].id;
                    Todo.scoreUp(taskId)
                    .then(function(response){
                        that.emit(':tell', "Le score de la quotidienne : "+ bestMatch.target +" a bien été incrémenté !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "La quotidienne n'a pas été trouvée. Peut-être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }

            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos quotidiennes.");
            })
        }
    },


    ScoreDownDailyIntent() {
        var task = this.event.request.intent.slots.daily.value
        let that = this;
        if(task){
            Daily.getDailys(task)
            .then(function(response){
                let dailys = response.data.data;
                let dailyText = dailys.map(h => h.text);
                let bestMatch = stringSimilarity.findBestMatch(task, dailyText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let taskId = dailys.filter(h => h.text == bestMatch.target)[0].id;
                    Todo.scoreDown(taskId)
                    .then(function(response){
                        that.emit(':tell', "Le score de la quotidienne : "+ bestMatch.target +" a bien été décrémentée !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "La quotidienne n'a pas été trouvée. Peut-être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }

            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos quotidiennes.");
            })
        }
    },

    

    

    GetTodoIntent(){
        let that = this;
        Todo.getTodos()
        .then(function(response){
            that.response.speak("Voici votre liste de tâches : ");
            that.emit(':tell', response.map(t=>t.text))
        })
        .catch(function(error){
            that.response.speak("Impossible d'accéder à la liste de vos tâches... Erreur : " + error);
        })
    },

    

    // ==== Unhandled
    Unhandled() {
        let speechOutput = "Je n'ai pas compris votre demande.";
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    }
});

module.exports = welcomeHandlers;
