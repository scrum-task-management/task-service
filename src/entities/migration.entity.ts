import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('migrations')
export class Migration extends BaseEntity {
  @Column({
    type: 'bigint',
  })
  public timestamp: number;

  @Column()
  public name: string;
}
