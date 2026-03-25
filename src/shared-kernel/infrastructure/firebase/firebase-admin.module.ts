import { Global, Module } from '@nestjs/common';
import {
  firebaseAdminProvider,
  FIREBASE_ADMIN,
} from './firebase-admin.provider.js';

@Global()
@Module({
  providers: [firebaseAdminProvider],
  exports: [FIREBASE_ADMIN],
})
export class FirebaseAdminModule {}
