import { QueryResult } from '../../driver/database-connection.js';
import { RootOperationNode } from '../../query-compiler/query-compiler.js';
import { UnknownRow } from '../../util/type-utils.js';
import { KyselyPlugin, PluginTransformQueryArgs, PluginTransformResultArgs } from '../kysely-plugin.js';
export interface CamelCasePluginOptions {
    /**
     * If true, camelCase is transformed into upper case SNAKE_CASE.
     * For example `fooBar => FOO_BAR` and `FOO_BAR => fooBar`
     *
     * Defaults to false.
     */
    upperCase?: boolean;
    /**
     * If true, an underscore is added before each digit when converting
     * camelCase to snake_case. For example `foo12Bar => foo_12_bar` and
     * `foo_12_bar => foo12Bar`
     *
     * Defaults to false.
     */
    underscoreBeforeDigits?: boolean;
    /**
     * If true, an underscore is added between consecutive upper case
     * letters when converting from camelCase to snake_case. For example
     * `fooBAR => foo_b_a_r` and `foo_b_a_r => fooBAR`.
     *
     * Defaults to false.
     */
    underscoreBetweenUppercaseLetters?: boolean;
    /**
     * If true, nested object's keys will not be converted to camel case.
     *
     * Defaults to false.
     */
    maintainNestedObjectKeys?: boolean;
}
/**
 * A plugin that converts snake_case identifiers in the database into
 * camelCase in the javascript side.
 *
 * For example let's assume we have a table called `person_table`
 * with columns `first_name` and `last_name` in the database. When
 * using `CamelCasePlugin` we would setup Kysely like this:
 *
 * ```ts
 * interface Person {
 *   firstName: string
 *   lastName: string
 * }
 *
 * interface Database {
 *   personTable: Person
 * }
 *
 * const db = new Kysely<Database>({
 *   dialect: new PostgresDialect({
 *     database: 'kysely_test',
 *     host: 'localhost',
 *   }),
 *   plugins: [
 *     new CamelCasePlugin()
 *   ]
 * })
 *
 * const person = await db.selectFrom('personTable')
 *   .where('firstName', '=', 'Arnold')
 *   .select(['firstName', 'lastName'])
 *   .executeTakeFirst()
 *
 * // generated sql:
 * // select first_name, last_name from person_table where first_name = $1
 *
 * if (person) {
 *   console.log(person.firstName)
 * }
 * ```
 *
 * As you can see from the example, __everything__ needs to be defined
 * in camelCase in the typescript code: table names, columns, schemas,
 * __everything__. When using the `CamelCasePlugin` Kysely works as if
 * the database was defined in camelCase.
 *
 * There are various options you can give to the plugin to modify
 * the way identifiers are converted. See {@link CamelCasePluginOptions}.
 * If those options are not enough, you can override this plugin's
 * `snakeCase` and `camelCase` methods to make the conversion exactly
 * the way you like:
 *
 * ```ts
 * class MyCamelCasePlugin extends CamelCasePlugin {
 *   protected override snakeCase(str: string): string {
 *     return mySnakeCase(str)
 *   }
 *
 *   protected override camelCase(str: string): string {
 *     return myCamelCase(str)
 *   }
 * }
 * ```
 */
export declare class CamelCasePlugin implements KyselyPlugin {
    #private;
    readonly opt: CamelCasePluginOptions;
    constructor(opt?: CamelCasePluginOptions);
    transformQuery(args: PluginTransformQueryArgs): RootOperationNode;
    transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>>;
    protected mapRow(row: UnknownRow): UnknownRow;
    protected snakeCase(str: string): string;
    protected camelCase(str: string): string;
}
