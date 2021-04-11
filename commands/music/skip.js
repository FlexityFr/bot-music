module.exports = {
        name: 'skip',
        run: async (client, message, args) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send("REJOIGNEZ LA VOC AVANT D'UTILISER CETTE COMMANDE!");
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("REJOIGNEZ LA VOCAL SI VOUS VOULEZ M'UTILISER!");
          }
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send("❌ **Rien ne joue sur ce serveur");
      try {
        serverQueue.connection.dispatcher.end();
        return message.channel.send({
          embed:{
          color: "BLUE",
          description:"⏩ Ignoré"
          }})
      } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send("RÉESSAYEZ POUR SAUTER")
      }
    }
};
