const eslint = require('eslint');
const rule = require('./mui-name-matches-component-name');

const ruleTester = new eslint.RuleTester({ parser: require.resolve('@typescript-eslint/parser') });
ruleTester.run('mui-name-matches-component-name', rule, {
  valid: [
    `
      const StaticDateRangePicker = React.forwardRef(function StaticDateRangePicker<TDate>(
        inProps: StaticDateRangePickerProps<TDate>,
        ref: React.Ref<HTMLDivElement>,
      ) {
        const props = useThemeProps({ props: inProps, name: 'MuiStaticDateRangePicker' });
      });
    `,
    `
      function CssBaseline(inProps) {
        useThemeProps({ props: inProps, name: 'MuiCssBaseline' });
      }
    `,
  ],
  invalid: [
    {
      code: `
        const StaticDateRangePicker = React.forwardRef(function StaticDateRangePicker<TDate>(
          inProps: StaticDateRangePickerProps<TDate>,
          ref: React.Ref<HTMLDivElement>,
        ) {
          const props = useThemeProps({ props: inProps, name: 'MuiPickersDateRangePicker' });
        });
      `,
      errors: [
        {
          message:
            "Expected `name` to be 'MuiStaticDateRangePicker' but instead got 'MuiPickersDateRangePicker'.",
          type: 'Literal',
        },
      ],
    },
    {
      code: 'useThemeProps({ props: inProps })',
      errors: [
        {
          message: 'Unable to find `name` property. Did you forget to pass `name`?',
          type: 'ObjectExpression',
        },
      ],
    },
    {
      code: 'useThemeProps({ props: inProps, name })',
      errors: [
        {
          message:
            'Unable to resolve `name`. Please hardcode the `name` i.e. use a string literal.',
          type: 'Identifier',
        },
      ],
    },
    {
      code: "useThemeProps({ props: inProps, name: 'MuiPickersDateRangePicker' })",
      errors: [{ message: 'Unable to find component for this call.', type: 'CallExpression' }],
    },
  ],
});
