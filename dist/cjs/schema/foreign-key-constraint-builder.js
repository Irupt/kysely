"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeignKeyConstraintBuilder = void 0;
const foreign_key_constraint_node_js_1 = require("../operation-node/foreign-key-constraint-node.js");
const on_modify_action_parser_js_1 = require("../parser/on-modify-action-parser.js");
const prevent_await_js_1 = require("../util/prevent-await.js");
class ForeignKeyConstraintBuilder {
    #node;
    constructor(node) {
        this.#node = node;
    }
    onDelete(onDelete) {
        return new ForeignKeyConstraintBuilder(foreign_key_constraint_node_js_1.ForeignKeyConstraintNode.cloneWith(this.#node, {
            onDelete: (0, on_modify_action_parser_js_1.parseOnModifyForeignAction)(onDelete),
        }));
    }
    onUpdate(onUpdate) {
        return new ForeignKeyConstraintBuilder(foreign_key_constraint_node_js_1.ForeignKeyConstraintNode.cloneWith(this.#node, {
            onUpdate: (0, on_modify_action_parser_js_1.parseOnModifyForeignAction)(onUpdate),
        }));
    }
    /**
     * Simply calls the provided function passing `this` as the only argument. `$call` returns
     * what the provided function returns.
     */
    $call(func) {
        return func(this);
    }
    toOperationNode() {
        return this.#node;
    }
}
exports.ForeignKeyConstraintBuilder = ForeignKeyConstraintBuilder;
(0, prevent_await_js_1.preventAwait)(ForeignKeyConstraintBuilder, "don't await ForeignKeyConstraintBuilder instances directly.");
