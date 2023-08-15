import { MinecraftChatMessage } from '../common/ChatInterface'
import MinecraftInstance from '../MinecraftInstance'
import { LOCATION, SCOPE } from '../../../common/ClientInstance'
import { ColorScheme } from '../../discord/common/DiscordConfig'
import { CommandsManager } from '../CommandsManager'
import { EventType } from '../../../common/ApplicationEvent'

export default {
  onChat: function (clientInstance: MinecraftInstance, commandsManager: CommandsManager, message: string): void {
    const regex = /^(?:\[[A-Za-z+]{3,10}\] ){0,3}(\w{3,32}) left the guild!/g

    const match = regex.exec(message)
    if (match != null) {
      const username = match[1]

      clientInstance.app.emit('event', {
        localEvent: true,
        instanceName: clientInstance.instanceName,
        location: LOCATION.MINECRAFT,
        scope: SCOPE.PUBLIC,
        name: EventType.LEAVE,
        username,
        severity: ColorScheme.BAD,
        message: 'left the guild!',
        removeLater: false
      })
    }
  }
} satisfies MinecraftChatMessage
