import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const host = "0.0.0.0";
  const port = 3000;

  await app
    .listen(port, host, () => {
      console.log(`Listening at http://${host}:${port}`);
    })
    .catch((err) => console.log(err));
}
bootstrap();
