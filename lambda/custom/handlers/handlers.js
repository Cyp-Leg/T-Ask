const Todo = require('../models/Todo');
const Daily = require('../models/Daily');
const Habit = require('../models/Habit');
var stringSimilarity = require('string-similarity');

const handlers = {

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
        this.emit(":ask", speechOutput, speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(
            ':ask',
            "Vous pouvez lire vos tâches, vos quotidiennes ou vos habitudes. Vous pouvez aussi en ajouter, en supprimer ou en valider.",
            "Réessayez."
        );
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak("Annuler");
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', "Au revoir !");
    }
}

module.exports = Object.assign(handlers);