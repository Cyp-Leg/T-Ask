const Alexa = require("alexa-sdk");
const config = require("../config");
const Task = require('../models/Task');
const User = require('../models/User');
const Habit = require('../models/Habit');
var stringSimilarity = require('string-similarity');

const welcomeHandlers = Alexa.CreateStateHandler(config.WELCOME_STATE, {
    Welcome() {
        this.response.speak("Bienvenue sur habitica, que voulez-vous faire ?").listen();
        this.emit(":responseReady");
    },

    AddTaskIntent() {
        var task = this.event.request.intent.slots.task.value
        let that = this;
        if(task){
            Task.addTask(task)
            .then(function (response) {
                that.emit(':ask', "La tache : " + task + " a bien été ajoutée !", "Autre ?");
            })
            .catch(function (error) {
                that.emit(':ask', "La tache : " + task + " n'a pas été ajoutée...", error.message);
            });
        }
        else{
            this.emit(':ask', "Vous n'avez spécifiez aucune tâche.", "Aucune tâche spécifiée.");
        }
    },

    DelTaskIntent() {
        var task = this.event.request.intent.slots.task.value
        let that = this;
        if(task){
            Task.getTodos(task)
            .then(function(response){
                let todos = response.data.data;
                let todosText = todos.map(t => t.text);
                let bestMatch = stringSimilarity.findBestMatch(task, todosText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let taskId = todos.filter(t => t.text == bestMatch.target)[0].id;
                    Task.deleteTask(taskId)
                    .then(function(response){
                        that.emit(':tell', "La tache : "+ bestMatch.target +" a bien été supprimée !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "La tache n'a pas été trouvée. Peut être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }
                
            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos tâches.");
            })
        }
    },

    ScoreUpIntent() {
        var task = this.event.request.intent.slots.task.value
        let that = this;
        if(task){
            Task.getTodos(task)
            .then(function(response){
                let todos = response.data.data;
                let todosText = todos.map(t => t.text);
                let bestMatch = stringSimilarity.findBestMatch(task, todosText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let taskId = todos.filter(t => t.text == bestMatch.target)[0].id;
                    Task.scoreUp(taskId)
                    .then(function(response){
                        that.emit(':tell', "La tache : "+ bestMatch.target +" a bien été validée !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "La tache n'a pas été trouvée. Peut être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }
                
            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos tâches.");
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
                let habitText = habits.map(t => t.text);
                let bestMatch = stringSimilarity.findBestMatch(task, habitText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let taskId = habits.filter(t => t.text == bestMatch.target)[0].id;
                    Task.scoreUp(taskId)
                    .then(function(response){
                        that.emit(':tell', "Le score de l'habitude : "+ bestMatch.target +" a bien été incrémenté !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "La tache n'a pas été trouvée. Peut être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }
                
            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos tâches.");
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
                let habitText = habits.map(t => t.text);
                let bestMatch = stringSimilarity.findBestMatch(task, habitText).bestMatch;

                if(bestMatch.rating > 0.8){
                    let taskId = habits.filter(t => t.text == bestMatch.target)[0].id;
                    Task.scoreDown(taskId)
                    .then(function(response){
                        that.emit(':tell', "Le score de l'habitude : "+ bestMatch.target +" a bien été décrémentée !");
                    })
                    .catch(function(error){
                        that.emit(':ask', "Une erreur s'est produite sur Habitica.", error.message);
                    });
                }
                else {
                    that.emit(':ask', "La tache n'a pas été trouvée. Peut être que vous vouliez dire : " + bestMatch.target + " ?", "");
                }
                
            })
            .catch(function(error){
                that.emit(':tell', "Impossible de récupérer vos tâches.");
            })
        }
    },


    GetTaskIntent(){
        let that = this;
        User.getTasks()
        .then(function(response){
            that.response.speak("Voici votre liste de tâches : ");
            that.emit(':tell', response.map(t=>t.text))
        })
        .catch(function(error){
            that.response.speak("Impossible d'accéder à la liste de vos taches... Erreur : " + error);
        })
    },

    HabitIntent() {
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

    // ==== Unhandled
    Unhandled() {
        let speechOutput = "Je n'ai pas compris votre demande.";
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    }
});

module.exports = welcomeHandlers;
