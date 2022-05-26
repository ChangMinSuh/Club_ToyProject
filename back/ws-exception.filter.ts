import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    super.catch(exception, host);
    const socket = host.switchToWs().getClient();
    const data = host.switchToWs().getData();
    //console.log(host.switchToWs().getClient());
    //console.log(host.switchToWs().getData());
    console.log(exception.error, exception.message);
    if (exception.error === 'jwt expired') {
      socket.emit('refreshEmit', data);
    }
  }
}
