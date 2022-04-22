import { Rule } from 'eslint';
import { groupNodes, getName, report } from './utils'

export default {
  create(context) {
    return {
      ObjectExpression(expression: any) {
        for (const nodes of groupNodes(expression.properties)) {
          const sorted = [...nodes].sort((a, b) => getName(a).localeCompare(getName(b)));

          report(context, nodes, sorted);
        }
      }
    }
  },
  meta: {
    type: 'suggestion',
    fixable: 'code',
    messages: {
      unsorted: 'Object properties should be sorted',
    }
  }
} as Rule.RuleModule
