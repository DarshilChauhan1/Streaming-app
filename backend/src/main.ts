import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionHandling } from './common/helpers/globalCatchHandler';
import { ResponseHandlerInterceptor } from './common/helpers/responseHandler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ExceptionHandling());
  app.useGlobalInterceptors(new ResponseHandlerInterceptor());
  app.enableCors({
    origin: '*',
  });
  await app.listen(process.env.PORT || 3000);

}
bootstrap();
