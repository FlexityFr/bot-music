module.exports = {
        name: 'resume',
        
    run: async (client, message, args) => {
        const { channel } = message.member.voice;
        if (!channel) { message.channel.send("DOIT REJOINDRE VOC AVANT D'UTILISER CETTE COMMANDE!")
                       }
        const serverQueue = client.queue.get(message.guild.id);
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("REJOIGNEZ MON CHANNEL VOCAL SI VOUS VOULEZ M'UTILISER!");
        }
      try {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send({embed:{
color: "BLUE",                                       description:'▶ **A repris**'}});
        }
        return message.channel.send('**Il ny a rien à reprendre**.');
      } catch {
        serverQueue.connection.dispatcher.end();
        return message.channel.send("**RÉESSAYER**")
      }
    }
};
