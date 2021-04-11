module.exports = {
        name: 'skipall',
        aliases: ['skip-all'],
       run: async (client, message, args) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m désolé mais vous devez être dans une vocal pour sauter un titre! ');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("**Vous devez être dans la même Voc avec le bot!**");
          }
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("Rien ne joue sur ce serveur");
        if (!serverQueue.songs) return message.channel.send("Il n'y a aucune chanson dans la file d'attente!");
      try {
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        return message.channel.send("✅Sauté toutes les chansons**");
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send("RÉESSAYER");
      }
    }
};
