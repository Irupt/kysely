/// <reference types="./compiled-query.d.ts" />
import { RawNode } from '../operation-node/raw-node.js';
import { freeze } from '../util/object-utils.js';
export const CompiledQuery = freeze({
    raw(sql, parameters = []) {
        return freeze({
            sql,
            query: RawNode.createWithSql(sql),
            parameters: freeze(parameters),
        });
    },
});
