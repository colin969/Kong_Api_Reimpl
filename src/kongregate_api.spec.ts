import { KongregateAPI } from "./models/KongregateAPI";

const mockLocation = 'http://example.com/game.swf?username=test&email=success';
global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    href: mockLocation
  }
});
const kongregate_api = new KongregateAPI();

describe('Kongregate API', function () {

  kongregate_api.loadAPI();

  test('Get API', () => {
    const kongregate = kongregate_api.getAPI();
    expect(kongregate_api);
  })

  test('Get Flash Vars String', () => {
    expect(kongregate_api.flashVarsString()).toBe('username=test&email=success');
  })

  test('Get Variable', () => {
    expect(kongregate_api.getVariable('username')).toBe('test')
  })
})

