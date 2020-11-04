/* eslint-disable no-shadow */
/**
 * @license
 * Copyright (c) 2020 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { mount } from '@vue/test-utils';
import DeviceProfileCallback from '@/components/callbacks/DeviceProfileCallback';
import i18n from '@/i18n';

describe('DeviceProfileCallback', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(DeviceProfileCallback, {
      i18n,
      propsData: {
        callback: {
          getMessage: () => 'Message',
          isLocationRequired: () => true,
          isMetadataRequired: () => true,
          setProfile: jest.fn(),
        },
      },
    });
  });

  it('Loads DeviceProfileCallback component', () => {
    expect(wrapper.name()).toEqual('DeviceProfileCallback');
  });

  it('Sets profile data and emits "next-step"', async () => {
    expect(wrapper.vm.$data.message).toBe('Message');
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$props.callback.setProfile).toHaveBeenCalledWith(expect.objectContaining({
      identifier: expect.any(String),
    }));
    expect(wrapper.emitted()['next-step'].pop()).toBeTruthy();
  });
});
