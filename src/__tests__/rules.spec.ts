import { RuleTester} from 'eslint'
import rule from '../rules';

const ruleTester = new RuleTester({
  parserOptions: {
     ecmaVersion: 2018,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum TestEnum {
  A = 'A',
  B = 'B',
}

ruleTester.run('sort-object-expression-key/object-properties', rule, {
  valid: [
    `
    var a = {
      [\`${1}\`]: 5,
      1234: 6,
      a: 1,
      b: 3,
      [TestEnum.A]: 2,
      [TestEnum.B]: 4,
    }
  `.trim()
  ],
  invalid: [
    {
      code: `
      var a = {
        a: 1,
        [TestEnum.A]: 2,
        b: 3,
        [TestEnum.B]: 4,
        [\`${1}\`]: 5,
        1234: 6,
      }
    `.trim(),
      output: `
      var a = {
        [\`${1}\`]: 5,
        1234: 6,
        a: 1,
        b: 3,
        [TestEnum.A]: 2,
        [TestEnum.B]: 4,
      }
      `.trim(),
      errors: [{ messageId: "unsorted" }],
    },
  ]
})