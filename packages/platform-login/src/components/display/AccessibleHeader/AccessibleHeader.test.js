/**
 * Copyright (c) 2023 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { mount } from '@vue/test-utils';
import { findByTestId } from '@forgerock/platform-shared/src/utils/testHelpers';
import i18n from '@/i18n';
import AccessibleHeader from './index';

global.document = jest.fn();

describe('AccessibleHeader', () => {
  function setup(props) {
    return mount(AccessibleHeader, {
      attachTo: document.body,
      global: {
        plugins: [i18n],
      },
      props: {
        customHtml: '<p>stub custom html</p>',
        mainContentId: 'content',
        ...props,
      },
    });
  }
  it('renders custom html', () => {
    const wrapper = setup();

    expect(wrapper.text()).toContain('stub custom html');
  });

  describe('renders correct skip link', () => {
    it('by default', async () => {
      const wrapper = setup({ mainContentId: 'header-skip-link' });
      expect(wrapper.vm.skipContentDestination).toBe(document.getElementById(wrapper.vm.mainContentId));
    });
  });

  describe('when main content id is not provided', () => {
    it('should not render skip link', () => {
      const wrapper = setup({ mainContentId: '' });

      const skipLink = findByTestId(wrapper, 'link-skip-to-main-content');
      expect(skipLink.exists()).toBeFalsy();
    });
  });
});
