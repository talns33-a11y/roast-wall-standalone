import { RoastService } from './roast-service.js';

describe('roast service', () => {
  it('should say hello', async () => {
    const roastService = RoastService.from();
    const greeting = await roastService.getHello();
    expect(greeting).toEqual('Hello World!');
  })
});
    