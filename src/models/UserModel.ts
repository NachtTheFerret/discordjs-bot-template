import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table, Unique, Validate } from 'sequelize-typescript';

export interface UserAttributes {
  id: string;
  discordId: string;
  lastUsername?: string | null;
  lastDisplayName?: string | null;
  lastAvatar?: string | null;
}

@Table({ tableName: 'users' })
export class UserModel extends Model {
  @PrimaryKey
  @Default(DataType.UUID)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Unique
  @AllowNull(false)
  @Validate({ is: /^[0-9]{16,20}$/ }) // Discord IDs are numeric and typically 18 digits
  @Column({ type: DataType.STRING })
  declare discordId: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  declare lastUsername?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  declare lastDisplayName?: string | null;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  declare lastAvatar?: string | null;
}
