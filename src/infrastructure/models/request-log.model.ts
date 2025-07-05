import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'request_log' })
export class RequestLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64 })
  franchise: string;

  @Column({ type: 'varchar', length: 32 })
  version: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'varchar', length: 16 })
  status: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  error_message: string;
}