import { Column, CreateDateColumn, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('logs')
export class Log extends BaseEntity {
  @Column({ nullable: true })
  public context: string;

  @Column()
  public message: string;

  @Column()
  public level: string;

  @CreateDateColumn()
  creationDate: Date;
}
