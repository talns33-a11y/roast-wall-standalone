
/**
 * roast service
 */
export class RoastService {
  
  /**
   * say hello.
   */
  async getHello() {
    return 'Hello World!';
  }

  /**
   * create a new instance of a roast service.
   */
  static from() {
    return new RoastService();
  }
}
