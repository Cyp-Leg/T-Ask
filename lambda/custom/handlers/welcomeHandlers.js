const Alexa = require("alexa-sdk");
const config = require("../config");
const Task = require('../models/Task');

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
            Task.deleteTask(task)
            .then(function(response){
                that.response.speak("La tache : " + task + " a bien été supprimée !");
                that.emit(':responseReady');
            })
            .catch(function(error){
                that.response.speak("La tache : " + task + " n'a pas été supprimée... Erreur : " + error);
                that.emit(':responseReady');
            })
        }
    },

    ScoreUpIntent() {
        let taskId = this.event.request.intent.slots.task.value;
        let that = this;
        if(taskId){
            Task.scoreUp(taskId)
            .then(function(response){
                that.emit(":tell", response.data.success)
            })
            .catch(function(error){
                that.emit(":ask", "Habitica n'a pas pu valider la tâche. Réessayez.", error.message)
            })
        }
    },

    // ==== Unhandled
    Unhandled() {
        let speechOutput = "Erreur on dirait";
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(":responseReady");
    }
});

module.exports = welcomeHandlers;
