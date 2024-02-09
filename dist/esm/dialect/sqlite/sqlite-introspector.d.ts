import { DatabaseIntrospector, DatabaseMetadata, DatabaseMetadataOptions, SchemaMetadata, TableMetadata } from '../database-introspector.js';
import { Kysely } from '../../kysely.js';
export declare class SqliteIntrospector implements DatabaseIntrospector {
    #private;
    constructor(db: Kysely<any>);
    getSchemas(): Promise<SchemaMetadata[]>;
    getTables(options?: DatabaseMetadataOptions): Promise<TableMetadata[]>;
    getMetadata(options?: DatabaseMetadataOptions): Promise<DatabaseMetadata>;
}
