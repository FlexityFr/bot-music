module.exports = {
  name: "pause",
  run: async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    const { channel } = message.member.voice;
    try {
      if (!channel)
        return message.channel.send(
          "Je suis désolé mais vous devez être dans un canal vocal pour mettre la musique en pause!"
        );
      if (message.guild.me.voice.channel !== message.member.voice.channel) {
        return message.channel.send(
          "VOUS DEVEZ ÊTRE DANS LE MÊME CANAL VOCAL SI VOUS VOULEZ METTRE EN PAUSE DE LA MUSIQUE"
        );
      }
      if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause(true);
        return message.channel.send({
          embed: {
            color: "BLUE",
            description: "**⏸ PAUSE**"
          }
        });
      }
      return message.channel.send("**Il n'y a rien qui joue!**");
    } catch {
      serverQueue.connection.dispatcher.end();
      await channel.leave();
    }
  }
};
