const Alexa = require("alexa-sdk");
const config = require("../config");
const handlers = require("./handlers");
const ApiSettings = require("./../ApiSettings")
const User = require('../models/User');

const loginHandlers = Alexa.CreateStateHandler(config.LOGIN_STATE, Object.assign({    

    Welcome() {
        this.emit(
            ":ask",
            "Pour vous connecter à habitica, indiquez votre pseudo et votre mot de passe, un par un. <emphasis level='strong'>Mon pseudo est ...</emphasis>",
            "Répétez."
        );
    },
    SetUsernameIntent() {
        var usrname = this.event.request.intent.slots.usrname.value
        if(usrname){
            ApiSettings.username = usrname;
            if(ApiSettings.password){
                User.login(ApiSettings.username, ApiSettings.password)
                .then((response)=>{
                    const credentials = response.data.data;
                    ApiSettings.user = credentials.id;
                    ApiSettings.key = credentials.apiToken;
                    that.emit(':ask', "Vous êtes connecté, bienvenue sur Habitica. Que voulez-vous faire ?");
                })
                .catch((err)=>{
                    that.emit(':tell', "Il y a eu une erreur : " + err)
                })
            }
            this.emit(":ask", "Très bien, il manque cependant encore votre mot de passe. <emphasis level='strong'>Mon mot de passe est ...</emphasis>", "Réessayez.");
        }
        else{
            this.emit(':ask', "Je n'ai pas compris votre nom d'utilisatreur.", "Aucune tâche spécifiée.");
        }
    },
    SetPasswordIntent() {
        var pwd = this.event.request.intent.slots.pwd.value
        let that = this;
        if(pwd){
            ApiSettings.password = pwd;
            if(ApiSettings.username){
                User.login(ApiSettings.username, ApiSettings.password)
                .then((response)=>{
                    this.handler.state = config.WELCOME_STATE
                    const credentials = response.data.data;
                    ApiSettings.user = credentials.id;
                    ApiSettings.key = credentials.apiToken;
                    that.emit(':ask', "Vous êtes connecté, bienvenue sur Habitica. Que voulez-vous faire ?");
                })
                .catch((err)=>{
                    that.emit(':tell', "Il y a eu une erreur : " + err)
                })
            }
            else {
                this.emit(":ask", "Très bien, il manque cependant encore votre pseudo. <emphasis level='strong'>Mon pseudo est ...</emphasis>", "Réessayez.");
            }
        }
        else{
            this.emit(':ask', "Je n'ai pas compris votre nom d'utilisatreur.", "Aucune tâche spécifiée.");
        }
    },
    Unhandled() {
        let speechOutput = "Je n'ai pas compris votre demande.";
        this.emit(":ask", speechOutput, speechOutput);
    }
}, handlers));

    
module.exports = loginHandlers;
