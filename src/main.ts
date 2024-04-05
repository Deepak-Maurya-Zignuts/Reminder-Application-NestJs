import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // app.useStaticAssets({
  //   root: path.join(__dirname, '..', 'public'),
  //   prefix: '/public/',
  // });
}
bootstrap();
