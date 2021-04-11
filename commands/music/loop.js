module.exports = {
  name: "loop",
  aliases: ["repeat"],
  run: async (client, message, args) => {
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel.send(
        "Je suis désolé mais vous devez être dans un canal vocal pour écouter de la musique en boucle!"
      );
    const serverQueue = client.queue.get(message.guild.id);
    try {
      if (!serverQueue)
        return message.channel.send("Il n'y a rien à jouer.");
      if (message.guild.me.voice.channel !== message.member.voice.channel) {
        return message.channel.send(
          "**Vous devez être dans le même canal avec le bot!**"
        );
      }
      if (!serverQueue.loop) {
        serverQueue.loop = true;
        return message.channel.send({
          embed:{
        color: "BLUE",
        description:"🔁 La répétition de la file d'attente a été activée."}});
      } else {
        serverQueue.loop = false;
        return message.channel.send(
          {embed: {
            color: "BLUE",
            description:"🔁 La répétition de la file d'attente a été désactivée."}});
      }
    } catch {
      serverQueue.connection.dispatcher.end();
      await channel.leave();
      return message.channel.send(
        "**Une erreur s'est produite. Veuillez réessayer!**"
      );
    }
  }
};
