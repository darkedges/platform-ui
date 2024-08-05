/**
 * Copyright (c) 2024 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { transformSchemaToFormGenerator } from './formGeneratorSchemaTransformer';

describe('formGeneratorSchemaTransformer', () => {
  it('should transform form editor schema to form generator schema', () => {
    const schema = [
      {
        type: 'text',
        model: 'field1',
        label: 'Field 1',
        description: 'Field 1 description',
        defaultValue: 'Field 1 default value',
        layout: {
          columns: 6,
          offset: 0,
        },
        validation: {
          required: true,
        },
      },
      {
        type: 'textarea',
        model: 'field2',
        label: 'Field 2',
        description: 'Field 2 description',
        defaultValue: 'Field 2 default value',
        layout: {
          columns: 6,
          offset: 0,
        },
        validation: {
          required: true,
        },
      },
      {
        type: 'checkbox',
        model: 'field3',
        label: 'Field 3',
        description: 'Field 3 description',
        defaultValue: true,
        layout: {
          columns: 4,
          offset: 0,
        },
        validation: {
          required: true,
        },
      },
      {
        type: 'select',
        model: 'field4',
        label: 'Field 4',
        description: 'Field 4 description',
        options: [
          {
            text: 'Option 1',
            value: 'option1',
          },
          {
            text: 'Option 2',
            value: 'option2',
          },
        ],
        defaultValue: 'option1',
        layout: {
          columns: 4,
          offset: 0,
        },
        validation: {
          required: true,
        },
      },
      {
        type: 'multiselect',
        model: 'field5',
        label: 'Field 5',
        description: 'Field 5 description',
        layout: {
          columns: 4,
          offset: 0,
        },
        validation: {
          required: true,
        },
        options: [
          {
            text: 'Option 1',
            value: 'option1',
          },
          {
            text: 'Option 2',
            value: 'option2',
          },
          {
            text: 'Option 3',
            value: 'option3',
          },
        ],
        defaultValue: ['option1'],
      },
      {
        type: 'date',
        model: 'field6',
        label: 'Field 6',
        description: 'Field 6 description',
        defaultValue: '2024-01-01',
        layout: {
          columns: 4,
          offset: 0,
        },
        validation: {
          required: true,
        },
      },
      {
        type: 'text',
        model: 'field7',
        label: 'Field 7',
        description: 'Field 7 description',
        layout: {
          columns: 12,
          offset: 0,
        },
        validation: {
          required: true,
        },
      },
    ];
    const expected = [
      [
        {
          columnClass: 'col-md-6 offset-md-0',
          description: 'Field 1 description',
          label: 'Field 1',
          layout: {
            columns: 6,
            offset: 0,
          },
          model: 'field1',
          type: 'string',
          validation: {
            required: true,
          },
          defaultValue: 'Field 1 default value',
        },
        {
          columnClass: 'col-md-6 offset-md-0',
          description: 'Field 2 description',
          label: 'Field 2',
          layout: {
            columns: 6,
            offset: 0,
          },
          model: 'field2',
          type: 'textarea',
          validation: {
            required: true,
          },
          defaultValue: 'Field 2 default value',
        },
      ],
      [
        {
          columnClass: 'col-md-4 offset-md-0',
          description: 'Field 3 description',
          label: 'Field 3',
          layout: {
            columns: 4,
            offset: 0,
          },
          model: 'field3',
          type: 'boolean',
          validation: {
            required: true,
          },
          defaultValue: true,
        },
        {
          columnClass: 'col-md-4 offset-md-0',
          description: 'Field 4 description',
          label: 'Field 4',
          layout: {
            columns: 4,
            offset: 0,
          },
          model: 'field4',
          type: 'select',
          validation: {
            required: true,
          },
          options: [
            {
              text: 'Option 1',
              value: 'option1',
            },
            {
              text: 'Option 2',
              value: 'option2',
            },
          ],
          defaultValue: 'option1',
        },
        {
          columnClass: 'col-md-4 offset-md-0',
          description: 'Field 5 description',
          label: 'Field 5',
          layout: {
            columns: 4,
            offset: 0,
          },
          model: 'field5',
          type: 'multiselect',
          validation: {
            required: true,
          },
          options: [
            {
              text: 'Option 1',
              value: 'option1',
            },
            {
              text: 'Option 2',
              value: 'option2',
            },
            {
              text: 'Option 3',
              value: 'option3',
            },
          ],
          defaultValue: ['option1'],
        },
      ],
      [
        {
          columnClass: 'col-md-4 offset-md-0',
          description: 'Field 6 description',
          label: 'Field 6',
          layout: {
            columns: 4,
            offset: 0,
          },
          model: 'field6',
          type: 'date',
          validation: {
            required: true,
          },
          defaultValue: '2024-01-01',
        },
      ],
      [
        {
          columnClass: 'col-md-12 offset-md-0',
          description: 'Field 7 description',
          label: 'Field 7',
          layout: {
            columns: 12,
            offset: 0,
          },
          model: 'field7',
          type: 'string',
          validation: {
            required: true,
          },
        },
      ],
    ];
    const result = transformSchemaToFormGenerator(schema);
    expect(result).toEqual(expected);
  });
});
