import { User } from '../../../domain/entities/user.entity.js';
import { UserOrmEntity } from '../orm-entities/user.orm-entity.js';

export class UserPersistenceMapper {
  static toDomain(orm: UserOrmEntity): User {
    return User.reconstitute(
      orm.id,
      orm.firebaseUid,
      orm.email,
      orm.createdAt,
      orm.updatedAt,
    );
  }

  static toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.firebaseUid = user.firebaseUid;
    orm.email = user.email;
    orm.createdAt = user.createdAt;
    orm.updatedAt = user.updatedAt;
    return orm;
  }
}
