const Alexa = require("alexa-sdk");
const config = require("../config");
const Todo = require('../models/Todo');
const User = require('../models/User');
const Daily = require('../models/Daily');
const Habit = require('../models/Habit');
var stringSimilarity = require('string-similarity');
var ApiSettings = require('../ApiSettings');
const util = require('util')


const welcomeHandlers = Alexa.CreateStateHandler(config.WELCOME_STATE, {
    

    Welcome() {
        this.response.speak("Bienvenue sur Habitica, que voulez-vous faire ?").listen();
        this.emit(":responseReady");
    }
}, handlers));

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
    
module.exports = welcomeHandlers;
