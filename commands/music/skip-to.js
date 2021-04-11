module.exports = {
  name: "skipto",

  run: async (client, message, args) => {
    if (!args[0])
      return message.channel.send("**Veuillez saisir un numéro de morceau!**");

    const { channel } = message.member.voice;
    if (!channel) return message.channel.send("REJOIN LA VOC !");
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) {
      message.channel.send("Rien ne joue sur ce serveur");
    }

    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.channel.send(
        "Vous devez être dans le même voc avec le bot!"
      );
    }

    if (args[0] < 1 && args[0] >= serverQueue.songs.length) {
      return message.channel.send("**Veuillez saisir un numéro de morceau valide!**");
    }
    try {
      serverQueue.songs.splice(0, args[0] - 2);
      serverQueue.connection.dispatcher.end();
      return;
    } catch {
      serverQueue.connection.dispatcher.end();
      await channel.leave();
      return message.channel.send("VEUILLEZ RÉESSAYER");
    }
  }
};
