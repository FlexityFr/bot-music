const discord = require("discord.js");

module.exports = {
  name: "help",
  run: async (client, message, args) => {
    const embed = new discord.MessageEmbed()

      .setTitle(`${client.user.username} HELP MENU`)

      .setThumbnail(
        message.author.displayAvatarURL({ dynamic: true, size: 1024 })
      )

      .setDescription(
        `

**COMMANDES MUSICALES**
\`lire [p], rechercher, mettre en pause, reprendre, arrêter, sauter, sauter tout, aller à, en cours de lecture [np], file d’attente, boucle, supprimer, volume\`


**COMMANDES INFO**
\`ping,help\`

__**À PROPOS DE BOT**__
 MUSIC BOT FAIT 24/7 LECTEURS DE MUSIQUE
13+ COMMANDS
`
      )
      .setFooter(message.guild);
    message.channel.send(embed);
  }
};
