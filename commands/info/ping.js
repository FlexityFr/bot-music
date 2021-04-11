module.exports = {
    name: "ping",
    category: "info",
    description: "Renvoie la latence et le ping API",
    run: async (client, message, args) => {
       message.channel.send(`Pong - ${client.ws.ping}ms`)
    }
}
