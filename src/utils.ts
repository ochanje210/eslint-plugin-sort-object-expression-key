import { Rule, SourceCode } from "eslint"
import { Property } from 'estree'


/**
 * Enumerates two node arrays and returns only the pairs where
 * the nodes are not equal.
 */
 export function enumerate<T>(a: T[], b: T[]) {
    return a
        .map((val, index) => [val, b[index]])
        .filter((x) => x[0] !== x[1]) as [T, T][]
}

/**
 * Returns an AST range for a node and it's preceding comments.
 */
export function getNodeRange(
    source: SourceCode,
    node: Node,
    includeComments = true
) {
    return [
        ((includeComments && source.getCommentsBefore(node)[0]) || node).range[0],
        node.range[1],
    ]
}

/**
 * Returns a node's text with it's preceding comments.
 */
 export function getNodeText(
    source: SourceCode,
    node: Node,
    includeComments = true
) {
    return source.getText().slice(...getNodeRange(source, node, includeComments))
}

  

export function groupNodes(properties: (Property)[]) {
    return properties.reduce((acc, cur) => {
      if (cur.type === 'Property') {
        return [
          ...acc.slice(0, acc.length - 2),
          [...(acc[acc.length - 1] || []), cur]
        ]
      }
      return [
        ...acc, []
      ]
    }, [] as (Property)[][])
    .filter(group => group.length > 1)
}


export function getName(node?: Property): string {
    switch (node?.key.type) {
      case "Identifier":
        return node.key.name
  
      case "Literal":
        return node.key.value!.toString()
  
      // `a${b}c${d}` becomes `abcd`
      case "TemplateLiteral":
        return node.key.quasis.reduce(
          (acc, quasi, i) => acc + quasi.value.raw + getName(node.key.expressions[i]),
          ""
        )
      // TestEnum.A becomes `TestEnum.A`
      case "MemberExpression":
        return `${node.key.object.name}.${node.key.property.name}`
  
      default:
        return ""
    }
  }

export function report(
    context: Rule.RuleContext,
    nodes: Node[],
    sorted: Node[]
) {
    const source = context.getSourceCode()
    const firstUnsortedNode = nodes.find((node, i) => node !== sorted[i])

    if (firstUnsortedNode) {
        context.report({
        node: firstUnsortedNode,
        messageId: "unsorted",
        *fix(fixer) {
            for (const [node, complement] of enumerate(nodes, sorted)) {
            yield fixer.replaceTextRange(
                getNodeRange(source, node),
                getNodeText(source, complement)
            )
            }
        },
        })
    }
}
