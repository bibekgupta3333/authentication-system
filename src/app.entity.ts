// transformer
import { Expose } from 'class-transformer';

// entity
import { ProfileEntity } from './profile/entities/profile.entity';

export class UserInititializationResponse {
  @Expose()
  user: ProfileEntity;
}
