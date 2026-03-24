import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthResolver } from './graphql/auth/auth.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      sortSchema: true,
      introspection: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthResolver],
})
export class AppModule {}
