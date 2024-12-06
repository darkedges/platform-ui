<!-- Copyright (c) 2024 ForgeRock. All rights reserved.

This software may be modified and distributed under the terms
of the MIT license. See the LICENSE file for details. -->
<template>
  <div>
    <BCard no-body>
      <BCardHeader class="p-4">
        <h2 class="h4">
          {{ title }}
        </h2>
        <p class="m-0">
          {{ subtitle }}
        </p>
      </BCardHeader>
      <BCardBody class="border-bottom">
        <BRow>
          <BCol md="5">
            <h3 class="h5">
              Identity Strength
            </h3>
          </BCol>
          <BCol class="text-right text-nowrap" md="2">
            <b>{{ identityStrength }}</b>
          </BCol>
        </BRow>
      </BCardBody>
      <BCardBody class="border-bottom">
        <!-- <BCollapse> -->
        <BRow>
          <BCol md="5">
            <h3 class="h5">
              Documents
            </h3>
          </BCol>
          <BCol class="text-right text-nowrap" md="2">
            <BFormGroup class="w-100" :label="title" label-sr-only>
              <template v-for="(field, index) in formFields" :key="index">
                <div @keydown.enter="saveForm()">
                  <FrField v-model="field.value" class="personal-info-field" :label="field.title" :name="field.name"
                    :type="field.format ? field.format : field.type" :validation="field.validation"
                    :testid="`edit-tdif-document-${index}`" :disabled="!field.userEditable"
                    v-if="field.type === 'string' || field.type === 'number' || field.type === 'boolean'" />
                </div>
              </template>
            </BFormGroup>
          </BCol>
        </BRow>
        <BRow>
          <BCol>
            <BButtonToolbar class="justify-content-end px-4 py-3">
              <BButton variant="primary" :disabled="isInternalUser || !meta.valid" @click="saveForm()"
                data-testid="btn-edit-personal-info-save">
                {{ $t('common.save') }}
              </BButton>
            </BButtonToolbar>
          </BCol>
        </BRow>
        <!-- </BCollapse> -->
      </BCardBody>
    </BCard>
  </div>
</template>

<script>

import FrField from '@forgerock/platform-shared/src/components/Field';
import i18n from '@forgerock/platform-shared/src/i18n';
import NotificationMixin from '@forgerock/platform-shared/src/mixins/NotificationMixin';
import ResourceMixin from '@forgerock/platform-shared/src/mixins/ResourceMixin';
import RestMixin from '@forgerock/platform-shared/src/mixins/RestMixin';
import { useTDIFDocumentStore } from '@forgerock/platform-shared/src/stores/tdif';
import { useUserStore } from '@forgerock/platform-shared/src/stores/user';
import {
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BRow
} from 'bootstrap-vue';
import {
  cloneDeep,
  each,
  map,
  reject
} from 'lodash';
import { mapState } from 'pinia';
import { useForm } from 'vee-validate';
export default {
  name: 'EditTD',
  mixins: [
    RestMixin,
    ResourceMixin,
    NotificationMixin
  ],
  components: {
    BCard,
    BCardBody,
    BCardHeader,
    BCol,
    BRow,
    FrField,
  },
  computed: {
    ...mapState(useUserStore, ['name', 'givenName', 'managedResource', 'userId',]),
    ...mapState(useTDIFDocumentStore, ['identityStrength', 'tdifDocuments']),
    hasChanged() {
      alert('here')
    }
  },
  props: {
    /**
     * Schema data for profile
     */
    schema: {
      type: Object,
      required: true,
    },
    /**
     * Profile data
     */
    profile: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formFields: [],
      originalFormFields: [],
      title: i18n.global.t('pages.profile.tdifDocuments.title'),
      subtitle: i18n.global.t('pages.profile.tdifDocuments.subtitle'),
    };
  },
  setup() {
    const veeValidateInstance = useForm();
    const { meta } = veeValidateInstance;
    return { meta, veeValidateInstance };
  },
  mounted() {
    const formFields = this.getTDIFDocuments();
    this.formFields = formFields;
    this.originalFormFields = cloneDeep(formFields);
  },
  methods: {
    getTDIFDocuments() {
      const { order, properties, required } = this.schema;
      const documentsProperties = properties['tdifDocuments'].properties
      const documentsOrder = properties['tdifDocuments'].order;
      const documentsRequired = properties['tdifDocuments'].required;
      const formFields = map(documentsOrder, (name) => ({
        name,
        title: `${documentsProperties[name].title} ${required.includes(name) ? '' : this.$t('common.optional')}`.trim(),
        value: this.tdifDocuments[name] || false,
        type: documentsProperties[name].type,
        description: documentsProperties[name].description,
        items: documentsProperties[name].items,
        format: documentsProperties[name].format,
        validation: documentsRequired.includes(name) ? 'required' : '',
        userEditable: documentsProperties[name].userEditable,
      }));
      return formFields;
    },
    async saveForm() {
      if (this.meta.valid) {
        const idmInstance = this.getRequestService();
        const policyFields = {};
        const origPolicyFields = {};

        each(this.formFields, (field) => {
          policyFields[field.name] = field.value;
        });
        each(this.originalFormFields, (field) => {
          origPolicyFields[field.name] = field.value;
        });
        const p = cloneDeep(this.profile);
        p.tdifDocuments = policyFields

        idmInstance.post(`policy/${this.managedResource}/${this.userId}?_action=validateObject`, p).then((policyResult) => {
          // reject any failedPolicyRequirements on properties that don't exist in this.formFields
          policyResult.data.failedPolicyRequirements = reject(policyResult.data.failedPolicyRequirements, (policy) => !map(this.formFields, 'name').includes(policy.property));

          if (policyResult.data.failedPolicyRequirements.length === 0) {
            this.$emit('updateProfile', this.generateUpdatePatch([{ name: "tdifDocuments", value: origPolicyFields }], [{ name: "tdifDocuments", value: policyFields }]));
          } else {
            const generatedErrors = this.findPolicyError({
              data: {
                detail: {
                  failedPolicyRequirements: policyResult.data.failedPolicyRequirements,
                },
              },
            }, this.formFields);

            if (generatedErrors.length > 0) {
              each(generatedErrors, (generatedError) => {
                if (generatedError.exists) {
                  setFieldError(generatedError.field, generatedError.msg, this.veeValidateInstance);
                }
              });
            } else {
              this.showErrorMessage('error', this.$t('pages.profile.failedProfileSave'));
            }
          }
        });
      }
    },
  }
}
</script>
