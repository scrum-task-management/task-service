import { Module } from '@nestjs/common';
import { AuthGuard } from './guard';

@Module({
  providers: [AuthGuard],
  controllers: [],
})
export class AuthModule {}
