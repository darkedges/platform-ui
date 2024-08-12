/**
 * Copyright (c) 2024 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

/**
 * return the type of the field for the form generator based on the type of the field in the form builder
 * @param {string} formBuilderType - the type of the field in the form builder
 * @returns {string} the type of the field for the form generator
 */
function getFormGeneratorType(formBuilderType) {
  const formBuilderToFormGeneratorTypes = {
    text: 'string',
    checkbox: 'boolean',
  };

  return formBuilderToFormGeneratorTypes[formBuilderType] || formBuilderType;
}

/**
 * return the column classes for the field based on the layout information
 * @param {Object} layout - the layout information of the field
 * @param {number} layout.columns - the number of columns the field occupies
 * @param {number} layout.offset - the number of columns the field is offset by
 * @returns {string} the column classes for the field
 */
function getColumnClasses(layout) {
  return `col-md-${layout.columns} offset-md-${layout.offset}`;
}

/**
 * Transforms a schema generated by the {@link FormEditor} component into a schema that can be used by the {@link FormGenerator} component.
 * This transformation ensures that the fields are organized into rows, with a maximum of 12 columns per row.
 * @param {Array} schema - The schema generated by the FormEditor component. Each element in the array represents a field with specific properties and layout information.
 * @param {boolean} readOnly - A boolean value that indicates whether the form is read-only.
 * @returns {Array} A transformed schema that is organized into rows for the FormGenerator component. Each row contains an array of field objects with their respective properties and layout information.
 *
 * @see FormEditor
 * @see FormGenerator
 */
// eslint-disable-next-line import/prefer-default-export
export function transformSchemaToFormGenerator(schema, readOnly) {
  return schema.reduce((schemaFormGenerator, schemaField) => {
    // Initialize the schemaFormGenerator with an empty row if it is empty
    if (!schemaFormGenerator.length) {
      schemaFormGenerator.push([]);
    }

    // Get the last row in the schemaFormGenerator
    let lastRow = schemaFormGenerator[schemaFormGenerator.length - 1];

    // Calculate the total columns count of the current row
    const columnsCount = lastRow.reduce((acc, field) => acc + field.layout.columns, 0);

    // If adding the current field exceeds 12 columns, start a new row
    if (columnsCount + schemaField.layout.columns + schemaField.layout.offset > 12) {
      lastRow = [];
      schemaFormGenerator.push(lastRow);
    }

    // Add the current field to the last row
    const field = {
      ...schemaField,
      disabled: readOnly,
      type: getFormGeneratorType(schemaField.type),
      columnClass: getColumnClasses(schemaField.layout),
    };
    // Set the default value to an empty array if the field is a multiselect and does not have a default value to avoid have an undefined value and make that the field is not shown in the form
    if (schemaField.type === 'multiselect' && !schemaField.defaultValue) {
      field.defaultValue = [];
    }
    lastRow.push(field);

    return schemaFormGenerator;
  }, []);
}
