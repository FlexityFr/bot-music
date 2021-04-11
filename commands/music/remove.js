module.exports = {
        name: "remove",
        aliases: ["rs"],
        run: async (client, message, args) => {
        if (!args[0]) return message.channel.send("**Veuillez saisir un numéro de morceau!**")

        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m désolé mais vous devez être dans un channel vocal pour supprimer un numéro de morceau particulier!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**Vous devez être dans le même channel avec le bot!**");
        };
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Rien ne joue sur ce serveur");
      try {
        if (args[0] < 1 && args[0] >= serverQueue.songs.length) {
            return message.channel.send("Veuillez saisir un numéro de morceau valide!");
        }
        serverQueue.songs.splice(args[0] - 1, 1);
        return message.channel.send(`Numéro de chanson supprimé ${args[0]} de la file d'attente`);
      } catch {
          serverQueue.connection.dispatcher.end();
          return message.channel.send("RÉESSAYER!")
      }
    }
};
