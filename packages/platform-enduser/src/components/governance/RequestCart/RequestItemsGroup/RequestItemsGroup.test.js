/**
 * Copyright 2023 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */

import { mount } from '@vue/test-utils';
import { findByTestId } from '@forgerock/platform-shared/src/utils/testHelpers';
import i18n from '@/i18n';
import RequestItemsGroup from './index';

describe('RequestItemsGroup', () => {
  const requestCartItemsStub = [{
    itemType: 'entitlement',
    name: 'Application Architecture Director',
    description: 'Salesforce Permission Set',
    imgSrc: 'url/to/img',
  }];

  const requestCartItemsLongStub = [
    {
      itemType: 'entitlement',
      name: 'Application Architecture Director',
      description: 'Salesforce Permission Set',
      imgSrc: 'url/to/img',
    },
    {
      itemType: 'role',
      name: 'Application Architecture Director',
    },
    {
      itemType: 'application',
      name: 'ServiceNow',
      description: 'SNOW',
      imgSrc: 'url/to/img',
    },
    {
      itemType: 'application',
      name: 'Salesforce',
      imgSrc: 'url/to/img',
    },
  ];

  const stubProps = {
    i18n,
    propsData: {
      requestItems: requestCartItemsStub,
    },
  };

  const setup = (props) => (mount(RequestItemsGroup, {
    ...stubProps,
    ...props,
  }));

  describe('@Component Tests', () => {
    it('hides the "View More" button when there are 3 or less request items', () => {
      const wrapper = setup();
      const viewMoreButton = findByTestId(wrapper, 'view-more-button');
      expect(viewMoreButton.exists()).toBeFalsy();
    });

    it('shows the "View More" button when there are more than 3 request items', () => {
      const wrapper = setup();
      const viewMoreButtonWithLessThanThreeItems = findByTestId(wrapper, 'view-more-button');
      expect(viewMoreButtonWithLessThanThreeItems.exists()).toBeFalsy();

      wrapper.setProps({
        requestItems: requestCartItemsLongStub,
      });

      const viewMoreButtonWithMoreThanThreeItems = findByTestId(wrapper, 'view-more-button');
      expect(viewMoreButtonWithMoreThanThreeItems.exists()).toBeTruthy();
    });

    it('toggles the visibility of the remaining request items if the "View More" button is clicked', () => {
      const wrapper = setup({
        propsData: {
          requestItems: requestCartItemsLongStub,
        },
      });
      const viewMoreItemsContainer = findByTestId(wrapper, 'view-more-items');
      const viewMoreButton = findByTestId(wrapper, 'view-more-button');
      expect(viewMoreItemsContainer.isVisible()).toBe(false);
      viewMoreButton.trigger('click');
      expect(viewMoreItemsContainer.isVisible()).toBe(true);
      viewMoreButton.trigger('click');
      expect(viewMoreItemsContainer.isVisible()).toBe(false);
    });
  });
});