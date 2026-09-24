import { app } from './config/app';
import { env } from './config/env';
import './config/module-alias'

import 'reflect-metadata'

app.listen(env.port, () => {
  console.log(`Server running at http:localhost:${env.port}`);
})