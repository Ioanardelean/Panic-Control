import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  private id: number;

  get Id(): number {
    return this.id;
  }
}
