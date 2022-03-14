const EventHandler = require("../common/EventHandler")

const DISCORD_PUBLIC_CHANNEL = process.env.DISCORD_PUBLIC_CHANNEL
const DISCORD_OFFICER_CHANNEL = process.env.DISCORD_OFFICER_CHANNEL

class ChatManager extends EventHandler {
    constructor(clientInstance) {
        super(clientInstance)
    }

    registerEvents() {
        this.clientInstance.client.on('messageCreate', message => this.#onMessage(message))
    }

    #onMessage(event) {
        if (event.author.bot || !event.content || event.content.length === 0) return

        let content = ChatManager.#stripDiscordContent(event.content).trim()
        if (content.length === 0) return

        if (event.channel.id === DISCORD_PUBLIC_CHANNEL) {
            this.clientInstance.bridge.onPublicChatMessage(
                this.clientInstance,
                event.member.displayName,
                event.content)

        } else if (event.channel.id === DISCORD_OFFICER_CHANNEL) {
            this.clientInstance.bridge.onOfficerChatMessage(
                this.clientInstance,
                event.member.displayName,
                event.content
            )
        }
    }

    static #stripDiscordContent(message) {
        return message
            .replace(/<[@|#|!|&]{1,2}(\d+){16,}>/g, '\n')
            .replace(/<:\w+:(\d+){16,}>/g, '\n')
            .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '\n')
            .split('\n')
            .map(part => {
                part = part.trim()
                return part.length === 0 ? '' : part + ' '
            })
            .join('')
    }
}

module.exports = ChatManager