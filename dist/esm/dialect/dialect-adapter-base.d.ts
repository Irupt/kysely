import { Kysely } from '../kysely.js';
import { DialectAdapter, MigrationLockOptions } from './dialect-adapter.js';
/**
 * A basic implementation of `DialectAdapter` with sensible default values.
 * 3rd party dialects can extend this instead of implementing the `DialectAdapter`
 * interface from scratch. That way all new settings will get default values when
 * they are added and there will be less breaking changes.
 */
export declare abstract class DialectAdapterBase implements DialectAdapter {
    get supportsCreateIfNotExists(): boolean;
    get supportsTransactionalDdl(): boolean;
    get supportsReturning(): boolean;
    abstract acquireMigrationLock(db: Kysely<any>, options: MigrationLockOptions): Promise<void>;
    abstract releaseMigrationLock(db: Kysely<any>, options: MigrationLockOptions): Promise<void>;
}
