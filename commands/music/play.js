const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

module.exports = {
  name: "play",
  description: "Pour lire des chansons :D",
  usage: "<song_name>",
  aliases: ["p"],

  run: async function(client, message, args) {
    const channel = message.member.voice.channel;
    if (!channel) {
      message.channel.send("Je suis désolé mais vous devez être dans un canal vocal avant d'utiliser cette commande");
    }

    if (!message.guild.me.hasPermission("CONNECT")) {
      message.channel.send({
        embed: {
          color: "FF0000",
          description:
            "<:emoji_17:763367241327706118> Je n'ai pas la permission de connecter votre vc!"
        }
      });
    }
    if (!message.guild.me.hasPermission("PARLER")) {
      message.channel.send({
        embed: {
          color: "FF0000",
          description:
            "<:emoji_17:763367241327706118>J'ai besoin de l'autorisation de parler pour écouter de la musique!"
        }
      });
    }
    var searchString = args.join(" ");
    if (!searchString) {
      message.channel.send("<:emoji_17:763367241327706118>fournissez-nous une chanson' nom ou lien de la chanson");
    }

    var serverQueue = message.client.queue.get(message.guild.id);

    var searched = await yts.search(searchString);
    if (searched.videos.length === 0) {
      message.channel.send("Je ne trouve pas cette chanson");
    }
    var songInfo = searched.videos[0];

    const song = {
      id: songInfo.videoId,
      title: Util.escapeMarkdown(songInfo.title),
      views: String(songInfo.views).padStart(10, " "),
      url: songInfo.url,
      ago: songInfo.ago,
      duration: songInfo.duration.toString(),
      img: songInfo.image,
      req: message.author
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      let thing = new MessageEmbed()
        .setTitle("LE MORCEAU A ÉTÉ AJOUTÉ À LA FILE")
        .setImage(song.img)
        .setColor("ORANGE")
        .setDescription(
          `**TITRE DE CHANSON**   
[${song.title}](${song.url})     

**DURÉE**
${song.duration}

**DEMANDÉ PAR**
[${message.author}]


        
        
        `
        )
        .setFooter(`Musique Flexity`);
      return message.channel.send(thing);
    }

    const queueConstruct = {
      textChannel: message.channel,
      voiceChannel: channel,
      connection: null,
      songs: [],
      volume: 3.5,
      playing: true
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async song => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
         message.client.queue.delete(message.guild.id);
        return;
      }

      const dispatcher = queue.connection
        .play(ytdl(song.url))
        .on("terminer", () => {
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on("Erreur", error => console.error(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 5);
      let thing = new MessageEmbed()
        .setTitle("COMMENCER À JOUER")
        .setDescription(
          `
**TITRE DE CHANSON**   
[${song.title}](${song.url})     

**DURÉE**
${song.duration}

**DEMANDÉ PAR**
[${message.author}]
`
        )

        .setImage(song.img)
        .setColor("GREEN")
        .setFooter(`Musique Flexity`);
      queue.textChannel.send(thing);
    };

    try {
      const connection = await channel.join();
      queueConstruct.connection = connection;
      channel.guild.voice.setSelfDeaf(true);
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Je n'ai pas pu rejoindre le canal vocal: ${error}`);
      message.client.queue.delete(message.guild.id);
      //await channel.leave();
      return console.log(
        `Je n'ai pas pu rejoindre le canal vocal: ${error}`,
        message.channel
      );
    }
  }
};
