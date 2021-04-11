const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "queue",
  aliases: ["q"],
  run: async (client, message, args) => {
    const { channel } = message.member.voice;
    if (!channel)
      return message.channel.send(
        "Je suis désolé mais vous devez être dans un Channel vocal pour voir la file d'attente!"
      );
    if (message.guild.me.voice.channel !== message.member.voice.channel) {
      return message.channel.send(
        "**Vous devez être dans le même Channel avec le bot!**"
      );
    }
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue)
      return message.channel.send("Rien ne joue sur ce serveur");
    try {
      let currentPage = 0;
      const embeds = generateQueueEmbed(message, serverQueue.songs);
      const queueEmbed = await message.channel.send(
        `**Page actuelle - ${currentPage + 1}/${embeds.length}**`,
        embeds[currentPage]
      );
      await queueEmbed.react("⬅️");
      await queueEmbed.react("⏹");
      await queueEmbed.react("➡️");

      const filter = (reaction, user) =>
        ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) &&
        message.author.id === user.id;
      const collector = queueEmbed.createReactionCollector(filter);

      collector.on("collecter", async (reaction, user) => {
        try {
          if (reaction.emoji.name === "➡️") {
            if (currentPage < embeds.length - 1) {
              currentPage++;
              queueEmbed.edit(
                `**Page actuelle - ${currentPage + 1}/${embeds.length}**`,
                embeds[currentPage]
              );
            }
          } else if (reaction.emoji.name === "⬅️") {
            if (currentPage !== 0) {
              --currentPage;
              queueEmbed.edit(
                `**Page actuelle - ${currentPage + 1}/${embeds.length}**`,
                embeds[currentPage]
              );
            }
          } else {
            collector.stop();
            reaction.message.reactions.removeAll();
          }
          await reaction.users.remove(message.author.id);
        } catch {
          serverQueue.connection.dispatcher.end();
          return message.channel.send(
            "**Autorisations manquantes - [ADD_REACTIONS, MANAGE_MESSAGES]!**"
          );
        }
      });
    } catch {
      serverQueue.connection.dispatcher.end();
      return message.channel.send(
        "**Permissions manquantes - [ADD_REACTIONS, MANAGE_MESSAGES]!**"
      );
    }
  }
};

function generateQueueEmbed(message, queue) {
  const embeds = [];
  let k = 10;
  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;
    const info = current
      .map(track => `${++j} :- [${track.title}](${track.url})`)
      .join("\n");
    const embed = new MessageEmbed()
      .setTitle("File d'attente de chansons\n")
      .setThumbnail(message.guild.iconURL())
      .setColor("GREEN")
      .setDescription(
        `**Morceau en cours ⤵️ [${queue[0].title}](${queue[0].url})**\n\n${info}`
      )
     .setFooter(`${message.guild}`) 
    .setTimestamp();
    embeds.push(embed);
  }
  return embeds;
}
