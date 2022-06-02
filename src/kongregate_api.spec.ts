import { KongregateAPI } from './models/KongregateAPI';

const mockParams = 'username=test&email=success&websocket_url=ws%3A%2F%2Flocalhost%3A12345%2F';
const mockLocation = 'http://example.com/game.swf?' + mockParams;
global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    href: mockLocation
  }
});
const kongregate_api = new KongregateAPI();

describe('Kongregate API', function () {

  beforeAll(() => {
    kongregate_api.loadAPI();
  });

  test('Get API', () => {
    expect(kongregate_api);
  });

  test('Get Flash Vars String', () => {
    expect(kongregate_api.flashVarsString()).toBe(mockParams);
  });

  test('Get Variable', () => {
    expect(kongregate_api.getVariable('username')).toBe('test');
  });
});

