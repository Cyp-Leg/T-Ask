const Alexa = require("alexa-sdk");
const config = require("../config");
const Todo = require('../models/Todo');
const User = require('../models/User');
const Habit = require('../models/Habit');
var stringSimilarity = require('string-similarity');

const welcomeHandlers = Alexa.CreateStateHandler(config.WELCOME_STATE, {
    Welcome() {
        this.response.speak("Bienvenue sur Habitica, que voulez-vous faire ?").listen();
        this.emit(":responseReady");
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
