"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamelCasePlugin = void 0;
const object_utils_js_1 = require("../../util/object-utils.js");
const camel_case_transformer_js_1 = require("./camel-case-transformer.js");
const camel_case_js_1 = require("./camel-case.js");
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
class CamelCasePlugin {
    opt;
    #camelCase;
    #snakeCase;
    #snakeCaseTransformer;
    constructor(opt = {}) {
        this.opt = opt;
        this.#camelCase = (0, camel_case_js_1.createCamelCaseMapper)(opt);
        this.#snakeCase = (0, camel_case_js_1.createSnakeCaseMapper)(opt);
        this.#snakeCaseTransformer = new camel_case_transformer_js_1.SnakeCaseTransformer(this.snakeCase.bind(this));
    }
    transformQuery(args) {
        return this.#snakeCaseTransformer.transformNode(args.node);
    }
    async transformResult(args) {
        if (args.result.rows && Array.isArray(args.result.rows)) {
            return {
                ...args.result,
                rows: args.result.rows.map((row) => this.mapRow(row)),
            };
        }
        return args.result;
    }
    mapRow(row) {
        return Object.keys(row).reduce((obj, key) => {
            let value = row[key];
            if (Array.isArray(value)) {
                value = value.map((it) => (canMap(it, this.opt) ? this.mapRow(it) : it));
            }
            else if (canMap(value, this.opt)) {
                value = this.mapRow(value);
            }
            obj[this.camelCase(key)] = value;
            return obj;
        }, {});
    }
    snakeCase(str) {
        return this.#snakeCase(str);
    }
    camelCase(str) {
        return this.#camelCase(str);
    }
}
exports.CamelCasePlugin = CamelCasePlugin;
function canMap(obj, opt) {
    return (0, object_utils_js_1.isPlainObject)(obj) && !opt?.maintainNestedObjectKeys;
}
