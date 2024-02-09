"use strict";
//import { type KyselyPlugin, type PluginTransformQueryArgs, type PluginTransformResultArgs } from 'kysely';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableGocPlugin = void 0;
const transformer_1 = require("./transformer");
class TableGocPlugin {
    #prefixTransformer;
    constructor(options) {
        this.#prefixTransformer = new transformer_1.TablePrefixOperationNodeTransformer(options);
    }
    transformQuery(args) {
        return this.#prefixTransformer.transformNode(args.node);
    }
    async transformResult(args) {
        return args.result;
    }
}
exports.TableGocPlugin = TableGocPlugin;
