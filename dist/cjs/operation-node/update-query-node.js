"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQueryNode = void 0;
const object_utils_js_1 = require("../util/object-utils.js");
const from_node_js_1 = require("./from-node.js");
/**
 * @internal
 */
exports.UpdateQueryNode = (0, object_utils_js_1.freeze)({
    is(node) {
        return node.kind === 'UpdateQueryNode';
    },
    create(table, withNode) {
        return (0, object_utils_js_1.freeze)({
            kind: 'UpdateQueryNode',
            table,
            ...(withNode && { with: withNode }),
        });
    },
    createWithoutTable() {
        return (0, object_utils_js_1.freeze)({
            kind: 'UpdateQueryNode',
        });
    },
    cloneWithFromItems(updateQuery, fromItems) {
        return (0, object_utils_js_1.freeze)({
            ...updateQuery,
            from: updateQuery.from
                ? from_node_js_1.FromNode.cloneWithFroms(updateQuery.from, fromItems)
                : from_node_js_1.FromNode.create(fromItems),
        });
    },
    cloneWithUpdates(updateQuery, updates) {
        return (0, object_utils_js_1.freeze)({
            ...updateQuery,
            updates: updateQuery.updates
                ? (0, object_utils_js_1.freeze)([...updateQuery.updates, ...updates])
                : updates,
        });
    },
});
