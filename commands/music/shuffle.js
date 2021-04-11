const Discord = require("discord.js");

module.exports = {
  name: "shuffle",
  aliases: ["sf", "shufflequeue"],
  run: async (client, message, args) => {
    const Channel = message.member.voice.channel;

    if (!Channel) return message.channel.send("REJOIGNEZ UNE CHAÎNE VOCALE");

    const Queue = await client.queue.get(message.guild.id);

    if (!Queue)
      return message.channel.send(
        "Rien ne joue sur ce serveur"
      );
    
    const Current = await Queue.Songs.shift();
    
    Queue.Songs = Queue.Songs.sort(() => Math.random() - 0.5);
    await Queue.Songs.unshift(Current);
    
    const Embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle("Success")
    .setDescription("🎶 La file d'attente a été mélangée")
    .setTimestamp();
    
    return message.channel.send(Embed).catch(() => message.channel.send("🎶 La file d'attente a été mélangée"));
  }
};
