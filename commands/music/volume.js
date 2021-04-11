
module.exports = {
        name: 'volume',
        aliases: ["vol"],
       run: async (client, message, args) => {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send("REJOINDRE LA VOCAL!");
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("Vous devez être dans le même vocal avec le bot!");
          }
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue){message.channel.send("Il n'y a rien qui joue!")}
        if (!args[0]) return message.channel.send(`Le volume actuel est: **${serverQueue.volume}**`);
      try {
        serverQueue.volume = args[0];
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
        return message.channel.send(`J'ai réglé le volume sur **${args[0]}**`);
      } catch {
          return message.channel.send("RÉESSAYER!");
      }
    }
};
