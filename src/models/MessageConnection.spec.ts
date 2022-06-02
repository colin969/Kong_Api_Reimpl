import { MessageConnection, MESSAGE_EVENT } from './MessageConnection';

describe('Kongregate API - Message Connection', function () {
  let mc: MessageConnection;

  beforeAll(() => {
    mc = new MessageConnection({
      target_window: globalThis.window,
      channel_id: 'test',
      websocket_url: 'ws://localhost:12345/'
    });
  });

  test('Parse Message', () => {
    const goodMsg = `{
            "opcode": "kongregate:api:message",
            "params": ["test", "params"]
            }`;
    let parsed = mc.parseMessage(goodMsg);
    expect(parsed).toEqual({
      opcode: MESSAGE_EVENT,
      params: ['test', 'params']
    });

    const badMsg = '{bad';
    parsed = mc.parseMessage(badMsg);
    expect(parsed).toBeNull();

    const objMsg = { dog: 63 };
    parsed = mc.parseMessage(objMsg);
    expect(parsed).toBeNull();
  });
});
