/// <reference types="./update-query-node.d.ts" />
import { freeze } from '../util/object-utils.js';
import { FromNode } from './from-node.js';
/**
 * @internal
 */
export const UpdateQueryNode = freeze({
    is(node) {
        return node.kind === 'UpdateQueryNode';
    },
    create(table, withNode) {
        return freeze({
            kind: 'UpdateQueryNode',
            table,
            ...(withNode && { with: withNode }),
        });
    },
    createWithoutTable() {
        return freeze({
            kind: 'UpdateQueryNode',
        });
    },
    cloneWithFromItems(updateQuery, fromItems) {
        return freeze({
            ...updateQuery,
            from: updateQuery.from
                ? FromNode.cloneWithFroms(updateQuery.from, fromItems)
                : FromNode.create(fromItems),
        });
    },
    cloneWithUpdates(updateQuery, updates) {
        return freeze({
            ...updateQuery,
            updates: updateQuery.updates
                ? freeze([...updateQuery.updates, ...updates])
                : updates,
        });
    },
});
