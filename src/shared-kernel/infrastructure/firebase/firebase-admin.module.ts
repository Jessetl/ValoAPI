import { Global, Module } from '@nestjs/common';
import {
  firebaseAdminProvider,
  FIREBASE_ADMIN,
} from './firebase-admin.provider';

@Global()
@Module({
  providers: [firebaseAdminProvider],
  exports: [FIREBASE_ADMIN],
})
export class FirebaseAdminModule {}
