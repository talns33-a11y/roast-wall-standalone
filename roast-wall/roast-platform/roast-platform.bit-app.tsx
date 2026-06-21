import { Platform } from '@bitdev/platforms.platform';

const RoastApp = import.meta.resolve('@ai-roast-wall/roast-wall.roast-app');
const RoastService = import.meta.resolve('@ai-roast-wall/roast-wall.roast-service');
const PlatformGateway = import.meta.resolve('@bitdev/platforms.backend.gateway-server');

export const RoastPlatform = Platform.from({
  name: 'roast-platform',

  frontends: {
    main: RoastApp,
    mainPortRange: [3000, 3100]
  },

  backends: {
    // use the default gateway component. supports proxy of graphql and restful requests.
    main: PlatformGateway,
    services: [
      RoastService
    ]
  },
});

export default RoastPlatform;
