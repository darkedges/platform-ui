/**
 * Copyright (c) 2024 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { flushPromises, mount } from '@vue/test-utils';
import * as CommonsApi from '@forgerock/platform-shared/src/api/governance/CommonsApi';
import useBvModal from '@forgerock/platform-shared/src/composables/bvModal';
import * as ViolationApi from '@forgerock/platform-shared/src/api/governance/ViolationApi';
import * as Notification from '@forgerock/platform-shared/src/utils/notification';
import ViolationList from './ViolationList';
import i18n from '@/i18n';

jest.mock('@forgerock/platform-shared/src/composables/bvModal');
CommonsApi.getResource = jest.fn().mockReturnValue(Promise.resolve({
  data: {
    result: [{ givenName: 'firstName', sn: 'lastName', id: 'userId' }],
  },
}));

describe('ViolationList', () => {
  const defaultProps = {
    policyRuleOptions: ['ruleOne'],
    isAdmin: true,
  };
  function mountComponent(props = {}) {
    const bvModalOptions = { show: jest.fn(), hide: jest.fn() };
    useBvModal.mockReturnValue({ bvModal: { value: bvModalOptions, ...bvModalOptions } });
    const wrapper = mount(ViolationList, {
      global: {
        plugins: [i18n],
      },
      props: {
        ...defaultProps,
        ...props,
      },
    });
    return wrapper;
  }

  it('shows violations in a list with correct columns', async () => {
    const wrapper = mountComponent();
    await flushPromises();
    const table = wrapper.findComponent('.table-responsive');
    const columns = table.findAll('[role=columnheader]');

    expect(columns.length).toBe(4);
    expect(columns[0].text()).toBe('User (Click to sort ascending)');
    expect(columns[1].text()).toBe('Rule (Click to sort ascending)');
    expect(columns[2].text()).toBe('Created (Click to sort ascending)');
  });

  it('add fixed with of 120px to actions column when is admin', async () => {
    const wrapper = mountComponent();
    await flushPromises();
    const table = wrapper.findComponent('.table-responsive');
    const columns = table.findAll('[role=columnheader]');
    expect(columns[3].classes()).toContain('w-120px');
  });

  it('not to add fixed with to actions column when is not admin', async () => {
    const wrapper = mountComponent({ isAdmin: false });
    await flushPromises();
    const table = wrapper.findComponent('.table-responsive');
    const columns = table.findAll('[role=columnheader]');
    expect(columns[3].classes()).not.toContain('w-120px');
  });

  it('emits handle-search when filter is changed', async () => {
    const wrapper = mountComponent();
    await flushPromises();
    const filter = wrapper.findComponent('[role=toolbar]');
    filter.vm.$emit('input', {
      status: 'testStatus',
      rule: 'testRule',
      user: 'testUser',
      startDate: '',
      endDate: '',
      searchValue: 'searchValue',
    });
    await flushPromises();

    expect(wrapper.emitted('handle-search')[2][1].operand).toEqual([
      {
        operator: 'EQUALS',
        operand: {
          targetName: 'decision.status',
          targetValue: 'testStatus',
        },
      },
      {
        operator: 'EQUALS',
        operand: { targetName: 'policyRule.id', targetValue: 'testRule' },
      },
      {
        operator: 'EQUALS',
        operand: { targetName: 'user.id', targetValue: 'testUser' },
      },
      {
        operator: 'OR',
        operand: [
          {
            operator: 'CONTAINS',
            operand: { targetName: 'user.userName', targetValue: 'searchValue' },
          },
          {
            operator: 'CONTAINS',
            operand: { targetName: 'user.givenName', targetValue: 'searchValue' },
          },
          {
            operator: 'CONTAINS',
            operand: { targetName: 'user.sn', targetValue: 'searchValue' },
          },
          {
            operator: 'CONTAINS',
            operand: { targetName: 'policyRule.name', targetValue: 'searchValue' },
          },
        ],
      },
    ]);
  });

  it('emits handle-search when sort-changed event is triggered', async () => {
    const wrapper = mountComponent();
    await flushPromises();
    const table = wrapper.findComponent('.table-responsive');
    table.vm.$emit('sort-changed', { sortDesc: true, sortBy: 'name' });
    expect(wrapper.emitted('handle-search')[1][0]).toEqual({
      fields: 'id,user,policyRule,decision',
      pageSize: 10,
      pagedResultsOffset: 0,
      sortDir: 'desc',
      sortKeys: 'decision.startDate',
    });
  });

  it('should show allow and revoke buttons when is not admin', async () => {
    const wrapper = mountComponent({
      isAdmin: false,
      tableRows: [
        {
          decision: {
            status: 'in-progress',
            startDate: '2024-05-13T23:12:21+00:00',
            phases: [
              {
                name: 'testPhase',
              },
            ],
          },
          policyRule: {
            name: 'NoCustomerSupport',
          },
          user: {
            cn: 'Opal Millions',
            givenName: 'Opal',
            id: '4f268edd-fa51-412a-8168-1443b4ad8198',
            mail: 'Opal@IGATestQA.onmicrosoft.com',
            sn: 'Millions',
            userName: 'Opal@IGATestQA.onmicrosoft.com',
          },
          id: '002bd665-3946-465c-b444-de470fa04254',
        },
      ],
    });
    await flushPromises();
    const table = wrapper.findComponent('.table-responsive');
    const rows = table.findAll('[role="row"]');
    const row = rows[1];
    const buttons = row.findAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].text()).toBe('checkAllow');
    expect(buttons[1].text()).toBe('blockRevoke');
  });

  it('should show view details item on actions list when is not admin', async () => {
    const wrapper = mountComponent({
      isAdmin: false,
      tableRows: [
        {
          decision: {
            status: 'in-progress',
            startDate: '2024-05-13T23:12:21+00:00',
            phases: [
              {
                name: 'testPhase',
              },
            ],
          },
          policyRule: {
            name: 'NoCustomerSupport',
          },
          user: {
            cn: 'Opal Millions',
            givenName: 'Opal',
            id: '4f268edd-fa51-412a-8168-1443b4ad8198',
            mail: 'Opal@IGATestQA.onmicrosoft.com',
            sn: 'Millions',
            userName: 'Opal@IGATestQA.onmicrosoft.com',
          },
          id: '002bd665-3946-465c-b444-de470fa04254',
        },
      ],
    });
    await flushPromises();
    const table = wrapper.findComponent('.table-responsive');
    const rows = table.findAll('[role="row"]');
    const row = rows[1];
    const items = row.findAll('[role="menuitem"]');

    expect(items.length).toBe(2);
    expect(items[1].text()).toBe('list_altView Details');
  });

  it('emits viewViolationDetails event when a row is clicked', async () => {
    const wrapper = mountComponent({
      isAdmin: false,
      tableRows: [
        {
          decision: {
            status: 'in-progress',
            startDate: '2024-05-13T23:12:21+00:00',
            phases: [
              {
                name: 'testPhase',
              },
            ],
          },
          policyRule: {
            name: 'NoCustomerSupport',
          },
          user: {
            cn: 'Opal Millions',
            givenName: 'Opal',
            id: '4f268edd-fa51-412a-8168-1443b4ad8198',
            mail: 'Opal@IGATestQA.onmicrosoft.com',
            sn: 'Millions',
            userName: 'Opal@IGATestQA.onmicrosoft.com',
          },
          id: '002bd665-3946-465c-b444-de470fa04254',
        },
      ],
    });
    await flushPromises();
    const table = wrapper.findComponent('.table-responsive');
    const rows = table.findAll('[role="row"]');
    const row = rows[1];
    await row.trigger('click');

    expect(wrapper.emitted('viewViolationDetails')[0][0].id).toBe('002bd665-3946-465c-b444-de470fa04254');
  });

  it('emits viewViolationDetails event when view details button is clicked', async () => {
    const wrapper = mountComponent({
      isAdmin: false,
      tableRows: [
        {
          decision: {
            status: 'in-progress',
            startDate: '2024-05-13T23:12:21+00:00',
            phases: [
              {
                name: 'testPhase',
              },
            ],
          },
          policyRule: {
            name: 'NoCustomerSupport',
          },
          user: {
            cn: 'Opal Millions',
            givenName: 'Opal',
            id: '4f268edd-fa51-412a-8168-1443b4ad8198',
            mail: 'Opal@IGATestQA.onmicrosoft.com',
            sn: 'Millions',
            userName: 'Opal@IGATestQA.onmicrosoft.com',
          },
          id: '002bd665-3946-465c-b444-de470fa04254',
        },
      ],
    });
    await flushPromises();
    const table = wrapper.findComponent('.table-responsive');
    const rows = table.findAll('[role="row"]');
    const row = rows[1];
    const dropDownItems = row.findAll('.dropdown-item');
    await dropDownItems[1].trigger('click');

    expect(wrapper.emitted('viewViolationDetails')[0][0].id).toBe('002bd665-3946-465c-b444-de470fa04254');
  });

  it('should open the allow exception modal when the allow button for a violation on the list is clicked', async () => {
    const wrapper = mountComponent({
      isAdmin: false,
      tableRows: [
        {
          decision: {
            status: 'in-progress',
            startDate: '2024-05-13T23:12:21+00:00',
            phases: [
              {
                name: 'testPhase',
              },
            ],
          },
          policyRule: {
            name: 'NoCustomerSupport',
          },
          user: {
            cn: 'Opal Millions',
            givenName: 'Opal',
            id: '4f268edd-fa51-412a-8168-1443b4ad8198',
            mail: 'Opal@IGATestQA.onmicrosoft.com',
            sn: 'Millions',
            userName: 'Opal@IGATestQA.onmicrosoft.com',
          },
          id: '002bd665-3946-465c-b444-de470fa04254',
        },
      ],
    });
    await flushPromises();
    const table = wrapper.findComponent('.table-responsive');
    const rows = table.findAll('[role="row"]');
    const row = rows[1];
    const buttons = row.findAll('button');
    await buttons[0].trigger('click');

    expect(wrapper.vm.selectedViolation).toEqual({
      created: '2024-05-13T23:12:21+00:00',
      id: '002bd665-3946-465c-b444-de470fa04254',
      phaseId: 'testPhase',
      policyRule: {
        name: 'NoCustomerSupport',
      },
      rawData: {
        decision: {
          phases: [
            {
              name: 'testPhase',
            },
          ],
          startDate: '2024-05-13T23:12:21+00:00',
          status: 'in-progress',
        },
        id: '002bd665-3946-465c-b444-de470fa04254',
        policyRule: {
          name: 'NoCustomerSupport',
        },
        user: {
          cn: 'Opal Millions',
          givenName: 'Opal',
          id: '4f268edd-fa51-412a-8168-1443b4ad8198',
          mail: 'Opal@IGATestQA.onmicrosoft.com',
          sn: 'Millions',
          userName: 'Opal@IGATestQA.onmicrosoft.com',
        },
      },
      user: {
        cn: 'Opal Millions',
        givenName: 'Opal',
        id: '4f268edd-fa51-412a-8168-1443b4ad8198',
        mail: 'Opal@IGATestQA.onmicrosoft.com',
        sn: 'Millions',
        userName: 'Opal@IGATestQA.onmicrosoft.com',
      },
    });
    expect(wrapper.vm.bvModal.show).toHaveBeenCalledWith('ExceptionModal');
  });

  it('should extend exception when the exception modal emits action event', async () => {
    ViolationApi.allowException = jest.fn().mockReturnValue(Promise.resolve());
    const displayNotificationSpy = jest.spyOn(Notification, 'displayNotification').mockImplementation(() => {});

    const wrapper = mountComponent({
      isAdmin: false,
      tableRows: [],
    });
    await flushPromises();

    const exceptionModal = wrapper.findComponent({ name: 'ExceptionModal' });
    exceptionModal.vm.$emit('action', {
      violationId: '002bd665-3946-465c-b444-de470fa04254',
      phaseId: 'testPhase',
      payload: 'test',
    });
    await flushPromises();

    expect(ViolationApi.allowException).toHaveBeenCalledWith('002bd665-3946-465c-b444-de470fa04254', 'testPhase', 'test');
    expect(displayNotificationSpy).toHaveBeenCalledWith('success', 'Exception successfully allowed');
    expect(wrapper.emitted('handle-search')).toBeTruthy();
  });

  it('should show error message when the exception modal emits action event and the api call fails', async () => {
    const error = new Error('ERROR');
    ViolationApi.allowException = jest.fn().mockImplementation(() => Promise.reject(error));
    const showErrorMessageSpy = jest.spyOn(Notification, 'showErrorMessage').mockImplementation(() => {});

    const wrapper = mountComponent({
      isAdmin: false,
      tableRows: [],
    });
    await flushPromises();

    const exceptionModal = wrapper.findComponent({ name: 'ExceptionModal' });
    exceptionModal.vm.$emit('action', {
      violationId: '002bd665-3946-465c-b444-de470fa04254',
      phaseId: 'testPhase',
      payload: 'test',
    });
    await flushPromises();

    expect(ViolationApi.allowException).toHaveBeenCalledWith('002bd665-3946-465c-b444-de470fa04254', 'testPhase', 'test');
    expect(showErrorMessageSpy).toHaveBeenCalledWith(error, 'There was an error allowing the exception');
  });

  it('should emit viewViolationDetails event when the exception modal emits view-violation-details', async () => {
    const wrapper = mountComponent({
      isAdmin: false,
      tableRows: [],
    });
    await flushPromises();

    const exceptionModal = wrapper.findComponent({ name: 'ExceptionModal' });
    exceptionModal.vm.$emit('view-violation-details', {
      id: '002bd665-3946-465c-b444-de470fa04254',
    });
    await flushPromises();

    expect(wrapper.emitted('viewViolationDetails')).toBeTruthy();
  });

  it('should rearrange columns based on event from column organizer', async () => {
    const wrapper = mountComponent({
      isTesting: true,
      tableRows: [],
    });
    await flushPromises();

    const activeColumns = [
      {
        key: 'policyRule',
        category: 'rule',
        label: i18n.global.t('governance.violations.rule'),
        show: true,
        sortable: true,
      },
      {
        key: 'user',
        category: 'user',
        label: i18n.global.t('common.user.user'),
        show: true,
        sortable: true,
      },
      {
        key: 'created',
        category: 'violation',
        class: 'w-150px',
        label: i18n.global.t('common.created'),
        show: false,
        sortable: true,
      },
      {
        key: 'actions',
        label: '',
        show: true,
      },
    ];

    const columnOrganizer = wrapper.findComponent('#ColumnOrganizerModal___BV_modal_outer_');
    columnOrganizer.vm.$emit('update-columns', { activeColumns });

    await flushPromises();
    const tableHeadings = wrapper.find('[role=table]').findAll('[role=columnheader]');
    expect(tableHeadings.at(0).text()).toBe('Rule (Click to sort ascending)');
    expect(tableHeadings.at(1).text()).toBe('User (Click to sort ascending)');
  });
});