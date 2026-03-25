import { BaseEntity } from '../../../../shared-kernel/domain/base-entity.js';

export class User extends BaseEntity {
  readonly firebaseUid: string;
  readonly email: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(
    id: string,
    firebaseUid: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super(id);
    this.firebaseUid = firebaseUid;
    this.email = email;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(id: string, firebaseUid: string, email: string): User {
    const now = new Date();
    return new User(id, firebaseUid, email, now, now);
  }

  static reconstitute(
    id: string,
    firebaseUid: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(id, firebaseUid, email, createdAt, updatedAt);
  }
}
