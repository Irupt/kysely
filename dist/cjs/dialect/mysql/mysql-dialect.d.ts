import { Driver } from '../../driver/driver.js';
import { Kysely } from '../../kysely.js';
import { QueryCompiler } from '../../query-compiler/query-compiler.js';
import { Dialect } from '../dialect.js';
import { DatabaseIntrospector } from '../database-introspector.js';
import { DialectAdapter } from '../dialect-adapter.js';
import { MysqlDialectConfig } from './mysql-dialect-config.js';
/**
 * MySQL dialect that uses the [mysql2](https://github.com/sidorares/node-mysql2#readme) library.
 *
 * The constructor takes an instance of {@link MysqlDialectConfig}.
 *
 * ```ts
 * import { createPool } from 'mysql2'
 *
 * new MysqlDialect({
 *   pool: createPool({
 *     database: 'some_db',
 *     host: 'localhost',
 *   })
 * })
 * ```
 *
 * If you want the pool to only be created once it's first used, `pool`
 * can be a function:
 *
 * ```ts
 * import { createPool } from 'mysql2'
 *
 * new MysqlDialect({
 *   pool: async () => createPool({
 *     database: 'some_db',
 *     host: 'localhost',
 *   })
 * })
 * ```
 */
export declare class MysqlDialect implements Dialect {
    #private;
    constructor(config: MysqlDialectConfig);
    createDriver(): Driver;
    createQueryCompiler(): QueryCompiler;
    createAdapter(): DialectAdapter;
    createIntrospector(db: Kysely<any>): DatabaseIntrospector;
}
