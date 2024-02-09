/// <reference types="./plugins.d.ts" />
//import { type KyselyPlugin, type PluginTransformQueryArgs, type PluginTransformResultArgs } from 'kysely';
import { TablePrefixOperationNodeTransformer } from './transformer';
export class TableGocPlugin {
    #prefixTransformer;
    constructor(options) {
        this.#prefixTransformer = new TablePrefixOperationNodeTransformer(options);
    }
    transformQuery(args) {
        return this.#prefixTransformer.transformNode(args.node);
    }
    async transformResult(args) {
        return args.result;
    }
}
