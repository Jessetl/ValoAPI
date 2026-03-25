import { Provider } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const FIREBASE_ADMIN = Symbol('FIREBASE_ADMIN');

export const firebaseAdminProvider: Provider = {
  provide: FIREBASE_ADMIN,
  useFactory: () => {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
    return admin;
  },
};
