import { Provider } from '@nestjs/common';
import * as dotenv from 'dotenv';

export const CONFIG = 'ConfigAuthService';

export const ConfigProvider: Provider = {
  provide: CONFIG,
  useFactory: () => {
    dotenv.config();
    return import('config');
  },
};
