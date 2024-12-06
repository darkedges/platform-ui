/**
 * Copyright (c) 2023 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';

// eslint-disable-next-line import/prefer-default-export
export const useTDIFDocumentStore = defineStore('tdif', () => {
  const identityStrength = ref('');
  const tdifDocuments = ref({});

  function setProfile(profileData) {
    // store tdif  specific data locally
    identityStrength.value = profileData.identityStrength || '';
    tdifDocuments.value = profileData.tdifDocuments || {};
  }

  return {
    setProfile,
    identityStrength,
    tdifDocuments
  };
});
