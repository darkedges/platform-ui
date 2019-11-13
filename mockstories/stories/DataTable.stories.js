/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
import { storiesOf } from '@storybook/vue';
import DataTable from '../mocks/components/DataTable.vue';

storiesOf('Components-Mock|Data Table', module)
    .add('Data Table', () => ({
        components: { 'fr-datatable': DataTable },
        template: '<fr-datatable></fr-datatable>'
    }));
