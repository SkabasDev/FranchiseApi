import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRequestLogTable1751680355565 implements MigrationInterface {

    name = 'CreateRequestLogTable1719870000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "request_log" (
                "id" SERIAL PRIMARY KEY,
                "franchise" VARCHAR(64) NOT NULL,
                "version" VARCHAR(32) NOT NULL,
                "metadata" JSONB,
                "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
                "status" VARCHAR(16) NOT NULL,
                "error_message" VARCHAR(1024)
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "request_log"`);
    }
}
