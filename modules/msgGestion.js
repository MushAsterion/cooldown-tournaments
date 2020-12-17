/**
 * DiscordJS module
 */
const Discord = require('discord.js')

/**
 * Map containing datas of each phases
 */
const phases = new Map()
phases.set(0, {
    name: "Check In",
    description: "En attente des checkin sur l'événement Battlefy...",
    fields: new Array(
        "🔄 faire un checkin manuel",
        "➡️ terminer la phase de checkin et générer les poules"
    )
})
phases.set(1, {
    name: "Qualifs",
    description: "La phase de qualification (Top32) a démarré et les poules ont été générées !",
    fields: new Array(
        ":regional_indicator_a: récupérer le résultat de la poule A",
        ":regional_indicator_b: récupérer le résultat de la poule B",
        ":regional_indicator_c: récupérer le résultat de la poule C",
        ":regional_indicator_d: récupérer le résultat de la poule D",
        "➡️ terminer la phase des qualifs et générer les demis"
    )
})
phases.set(2, {
    name: "Demis",
    description: "La phase des demis-finales (Top16) a démarré et le seeding a été effectué !",
    fields: new Array(
        ":regional_indicator_a: récupérer le résultat de la demi A",
        ":regional_indicator_b: récupérer le résultat de la demi B",
        "➡️ terminer la phase des demis et générer la finale"
    )
})
phases.set(3, {
    name: "Finale",
    description: "La phase de la finale (Top8) a démarré !",
    fields: new Array(
        "⬇️ récupérer le résultat de la finale",
        "➡️ terminer le tournoi"
    )
})
phases.set(4, {
    name: "Ended",
    description: "Le tournoi est terminé !",
    fields: new Array()
})

/**
 * This module is create to generate formated discord message
 */
module.exports = class MsgGestion{

    /**
     * Get a message depending on the phase and player of a possible equality
     * @param {*} phase 
     * @param {*} equality 
     */
    static getMessageByPhase(phase, equality){
        console.log(`ENTER: getMessageByPhase(${phase})`)

        //Create base embed message
        let embed = new Discord.MessageEmbed()
            .setTitle(`Cooldown TFT Cup - ${phases.get(phase).name}`)
            .setColor("#008cff")
            .setURL("https://docs.google.com/spreadsheets/d/15xow2CpBy9Q5MZuDEarpQX88G-teRRpVoqV3x3lMzzs")
            .setThumbnail("https://pbs.twimg.com/profile_images/1076249303604170757/Dbc3Qhof_400x400.jpg")
            .setTimestamp()
        
        let textToAdd = ""
        //Add text depending on the equality
        if(equality && equality.length > 0 && phase == 2){
            textToAdd = "\n\n*Une égalité a été gérée en demi avec cet ordre* :"
            for(let player of equality){
                textToAdd += `\n- ${player.name} | Pos1: **${player.pos1}** | Pos2: **${player.pos2}**`
            }
        }else if(equality && equality.length > 0 && phase == 3){
            textToAdd = "\n\n*Une égalité a été détectée en final concernant* :"
            for(let player of equality){
                textToAdd += `\n- ${player.name}`
            }
        }
        //Add text depending on the phase to give to users informations about the actions they can do
        textToAdd += "\n\n"
        for(let field of phases.get(phase).fields){
            textToAdd += field + "\n"
        }
        embed.setDescription(phases.get(phase).description + textToAdd)

        console.log(`EXIT: getMessageByPhase()`)
        return embed
    }

    /**
     * Add a footer to an embed message 
     * @param {*} message 
     * @param {*} footer 
     */
    static editMessageFooter(message, footer){
        let embed = message.embeds[0]
        embed.setFooter(footer)
        message.edit(embed)
    }

    /**
     * Add reactions to a message depending on the phase so the users can easily perform actions
     * @param {*} message 
     * @param {*} phase 
     */
    static addReactionsOnMessage(message, phase){
        switch(phase){
            case 0:
                message.react("🔄")
                .then(() => message.react("➡️"))
                return
            case 1:
                message.react("🇦")
                .then(() => message.react("🇧"))
                .then(() => message.react("🇨"))
                .then(() => message.react("🇩"))
                .then(() => message.react("➡️"))
                return
            case 2:
                message.react("🇦")
                .then(() => message.react("🇧"))
                .then(() => message.react("➡️"))
                return
            case 3:
                message.react("⬇️")
                .then(() => message.react("➡️"))
                return
            default:
                return          
        }
    }

}