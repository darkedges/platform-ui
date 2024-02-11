/**
 * Copyright (c) 2023-2024 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { mount } from '@vue/test-utils';
import {
  findByText,
  findByTestId,
  findByRole,
} from '@forgerock/platform-shared/src/utils/testHelpers';
import { setupTestPinia } from '@forgerock/platform-shared/src/utils/testPiniaHelpers';
import i18n from '@/i18n';
import ReportTemplateHeader from './ReportTemplateHeader';

describe('Report Template Header component', () => {
  function setup(props) {
    setupTestPinia();
    return mount(ReportTemplateHeader, {
      global: {
        plugins: [i18n],
      },
      props: {
        ...props,
      },
    });
  }

  let wrapper;

  describe('@component', () => {
    beforeEach(async () => {
      wrapper = setup();
    });

    it('ensures that the save button is disabled on load', () => {
      const saveButton = findByText(wrapper, 'button', 'Save');
      expect(saveButton.attributes('disabled')).toBeDefined();
    });

    it('emits "save" when the save button is clicked', async () => {
      wrapper = setup({ disableSave: false });
      const saveButton = findByText(wrapper, 'button', 'Save');
      await saveButton.trigger('click');
      expect(wrapper.emitted().save[0]).toBeTruthy();
    });

    it('emits "duplicate" when the duplicate option is selected from the ellipse menu', async () => {
      const actionsMenu = findByRole(wrapper, 'menu');
      const duplicateOption = findByText(actionsMenu, 'a', 'control_point_duplicateDuplicate');

      await duplicateOption.trigger('click');
      expect(wrapper.emitted().duplicate[0]).toBeTruthy();
    });

    it('emits "delete" when the duplicate option is selected from the ellipse menu', async () => {
      const actionsMenu = findByRole(wrapper, 'menu');
      const deleteOption = findByText(actionsMenu, 'a', 'deleteDelete');

      await deleteOption.trigger('click');
      expect(wrapper.emitted().delete[0]).toBeTruthy();
    });

    it('does not show the report badge if the "reportState" prop has no value', () => {
      const badgeElement = findByTestId(wrapper, 'report-badge');
      expect(badgeElement.exists()).toBe(false);
    });

    it('sets the report badge to "Draft" if the "reportState" prop has a value of "draft"', () => {
      wrapper = setup({ reportState: 'draft' });
      const badgeElement = findByTestId(wrapper, 'report-badge');
      expect(badgeElement.text()).toBe('Draft');
    });

    it('sets the report badge to "Published" if the "reportState" prop has a value of "published"', () => {
      wrapper = setup({ reportState: 'published' });
      const badgeElement = findByTestId(wrapper, 'report-badge');
      expect(badgeElement.text()).toBe('Published');
    });
  });
});
