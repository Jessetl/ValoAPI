import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '../../../../shared-kernel/infrastructure/decorators/current-user.decorator.js';
import { ParseUUIDPipe } from '../../../../shared-kernel/infrastructure/pipes/parse-uuid.pipe.js';
import { SyncFirebaseUserUseCase } from '../../application/use-cases/sync-firebase-user.use-case.js';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id.use-case.js';
import type { FirebaseUser } from '../../../../shared-kernel/infrastructure/guards/firebase-auth.guard.js';

@Controller('users')
export class UsersController {
  constructor(
    private readonly syncFirebaseUser: SyncFirebaseUserUseCase,
    private readonly getUserById: GetUserByIdUseCase,
  ) {}

  @Get('me')
  async getMe(@CurrentUser() user: FirebaseUser) {
    return this.syncFirebaseUser.execute({
      firebaseUid: user.uid,
      email: user.email || '',
    });
  }

  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.getUserById.execute(id);
  }
}
