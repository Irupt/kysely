import { Kysely } from '../../kysely.js';
import { DialectAdapterBase } from '../dialect-adapter-base.js';
export declare class MssqlAdapter extends DialectAdapterBase {
    get supportsCreateIfNotExists(): boolean;
    get supportsTransactionalDdl(): boolean;
    get supportsReturning(): boolean;
    acquireMigrationLock(db: Kysely<any>): Promise<void>;
    releaseMigrationLock(): Promise<void>;
}
