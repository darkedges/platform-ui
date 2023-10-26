/**
 * Copyright (c) 2023 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import { generateIgaApi } from '../BaseApi';

const governanceBaseUrl = '/governance';
const governanceCertificationBaseUrl = `${governanceBaseUrl}/certification`;
const governanceCertificationAdminBaseUrl = `${governanceBaseUrl}/admin/certification`;

/**
 *
 * Certification Administration
 *
 */

/**
 * Gets all certification campaigns
 * @param {Object} params query parameters
 * @returns {Promise}
 */
export function getAdminCertificationItems(params = {}) {
  const defaultParams = {
    status: 'active',
    pageNumber: 0,
    pageSize: 10,
  };
  if (!params.queryString) {
    delete params.queryString;
  }
  return generateIgaApi().get('/governance/admin/certification', { params: { ...defaultParams, ...params } });
}

/**
 * Get certifications for a user
 * @param {Object} params query parameters
 * @returns {Promise}
 */
export function getCertificationItems(params = {}) {
  const defaultParams = {
    status: 'active',
    pageNumber: 0,
    pageSize: 10,
  };
  return generateIgaApi().get('governance/certification/items', { params: { ...defaultParams, ...params } });
}

/**
 * Launch a certification campaign
 * @param {String} campaignId id of campaign
 * @returns {Promise}
 */
export function activateCertification(campaignId) {
  return generateIgaApi().post(`/governance/certification/${campaignId}/activate`);
}

/**
 * cancel a certification campaign
 * @param {String} campaignId id of campaign
 * @returns {Promise}
 */
export function cancelCertification(campaignId) {
  return generateIgaApi().post(`/governance/certification/${campaignId}/cancel`);
}

/**
 * delete a certification campaign
 * @param {String} campaignId id of campaign
 * @returns {Promise}
 */
export function deleteCertification(campaignId) {
  return generateIgaApi().delete(`/governance/certification/${campaignId}`);
}

/**
 * update deadline of a certification campaign
 * @param {String} campaignId id of campaign
 * @param {String} newDeadline new deadline date
 * @returns {Promise}
 */
export function updateCertificationDeadline(campaignId, newDeadline) {
  return generateIgaApi().post(`/governance/certification/${campaignId}/update-deadline`, { newDeadline });
}

/**
 * Search for templates with names containing a string
 * @param {String} searchTerm search for templates that contain this string
 * @param {Object} params additional query parameters
 * @returns {Promise}
 */
export function searchCertificates(searchTerm, params) {
  const defaultParams = {
    pageSize: 10,
    pageNumber: 0,
    sortBy: 'name',
  };

  return generateIgaApi().post('/governance/certification/template/search', {
    targetFilter: {
      operator: 'CONTAINS',
      operand: {
        targetName: 'name',
        targetValue: searchTerm,
      },
    },
  }, { params: { ...defaultParams, ...params } });
}

/**
 * Get all template names up to a limit of 10,000
 * This is used for template name uniqueness validation
 * @returns {Promise}
 */
export function searchAllTemplateNames() {
  return generateIgaApi().get('/governance/certification/template?pageSize=10000&fields=name');
}

/**
 * Get details of a single certification campaign
 * @param {String} campaignId - id of the selected campaign
 * @returns {Promise}
 */
export function getCertificationDetails(campaignId) {
  const resourceUrl = `${governanceCertificationAdminBaseUrl}/${campaignId}`;
  return generateIgaApi().get(resourceUrl);
}

/**
 *
 * General Certification Actions
 *
 */

/**
 * Returns the list of certification task items for a campaign
 * @param {Object} params - Optional parameters to be appended as a query string
 * @param {String} campaignId - id of the selected campaign
 * @param {Object} payload - target filter for filtering items
 * @returns {Promise}
 */
export function getCertificationTasksListByCampaign(urlParams, campaignId, payload) {
  const queryParams = new URLSearchParams(urlParams).toString();
  const resourceUrl = `${governanceCertificationBaseUrl}/${campaignId}/items/search?${queryParams}`;
  return generateIgaApi().post(resourceUrl, payload);
}

/**
 * Returns in progress tasks
 * @param {String} campaignId - id of the selected campaign
 * @param {Boolean} isAdmin - is the user an admin
 * @returns {Promise}
 */
export function getInProgressTasksByCampaign(campaignId, isAdmin = false, taskStatus) {
  const queryParams = {
    status: 'in-progress',
    isAdmin,
    taskStatus,
  };
  const resourceUrl = `${governanceCertificationBaseUrl}/${campaignId}/items`;
  return generateIgaApi().get(resourceUrl, { params: queryParams });
}

/**
 * Gets the total, undecided, and decided counts (certify, revoke, etc)
 * of items in a campaign
 * @param {String} campaignId - id of the selected campaign
 * @param {String} actorId id of current actor
 * @param {Boolean} isAdmin - is the user an admin
 * @param {String} taskStatus - restrict counts to a specific task status
 * @returns {Promise}
 */
export function getCertificationCounts(campaignId, actorId, isAdmin, taskStatus) {
  const params = {
    getCount: true,
    isAdmin,
    taskStatus,
    ...(isAdmin ? { primaryReviewerId: actorId } : { actorId }),
  };

  const queryParams = new URLSearchParams(params).toString();
  const resourceUrl = `${governanceCertificationBaseUrl}/${campaignId}/items?${queryParams}`;
  return generateIgaApi().get(resourceUrl);
}

/**
 * sign off on all certification tasks that have decisions
 * @param {String} certId certification id
 * @param {String} actorId id of current actor
 * @returns {Promise}
 */
export function signOffCertificationTasks(certId, actorId) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/signoff`;
  return generateIgaApi().post(resourceUrl, {
    actorId,
    ids: [],
  });
}

/**
 * Forward all items in a certification for a single actor
 * @param {String} actorId id of actor attempting to forward
 * @param {String} certId certification id
 * @param {String} newActorId id of actor to forwawrd to
 * @param {String} comment comment to leave on forward
 * @returns {Promise}
 */
export function forwardCertification(actorId, certId, newActorId, comment) {
  const url = `${governanceCertificationBaseUrl}/${certId}/items/forward?selectAllActorId=${actorId}`;
  return generateIgaApi().post(url, { newActorId, comment, ids: [] });
}

/**
 * Get all users within a certification for an actor
 * This is used to allow users to filter cert items based on user
 * @param {String} certId certification id
 * @param {String} actorId id of current actor
 * @returns {Promise}
 */
export function getCertificationUserFilter(certId, actorId) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/filter/user?actorId=${actorId}`;
  return generateIgaApi().get(resourceUrl);
}

/**
 * Get all applications within a certification for an actor
 * This is used to allow users to filter cert items based on application
 * @param {String} certId certification id
 * @param {String} actorId id of current actor
 * @returns {Promise}
 */
export function getCertificationApplicationFilter(certId, actorId) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/filter/application?actorId=${actorId}`;
  return generateIgaApi().get(resourceUrl);
}

/**
 *
 * Single Certification Item Actions
 *
 */

/**
 * Certify a single item
 * @param {String} certId certification id
 * @param {String} itemId id of item to certify
 * @returns {Promise}
 */
export function certifyItem(certId, itemId) {
  const url = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/certify`;
  return generateIgaApi().post(url);
}

/**
 * Allow Exception for a single item
 * @param {String} certId certification id
 * @param {String} itemId id of item to allow exception for
 * @param {String} comment comment to leave on exception
 * @returns {Promise}
 */
export function exceptionItem(certId, itemId, comment = '') {
  const url = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/exception`;
  return generateIgaApi().post(url, { comment });
}

/**
 * Forward a single item
 * @param {String} certId certification id
 * @param {String} itemId id of item to forward
 * @param {String} comment comment to leave on forward
 * @param {String} newActorId id of actor to forward to
 * @returns {Promise}
 */
export function forwardItem(certId, itemId, comment = '', newActorId) {
  const url = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/forward`;
  return generateIgaApi().post(url, { comment, newActorId });
}

/**
 * Reassign a single item
 * @param {String} certId certification id
 * @param {String} itemId id of item to reassign
 * @param {String} newActorId id of actor to reassign to
 * @param {object} permissions - object with the permissions for the new actor
 * @returns {Promise}
 */
export function reassignItem(certId, itemId, newActorId, permissions) {
  const url = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/reassign`;
  return generateIgaApi().post(url, { newActorId, permissions });
}

/**
 * Reset decisions for a single item
 * @param {String} certId certification id
 * @param {String} itemId id of item to reset decisions on
 * @returns {Promise}
 */
export function resetItem(certId, itemId) {
  const url = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/reset`;
  return generateIgaApi().post(url);
}

/**
 * Revoke a single item
 * @param {String} certId certification id
 * @param {String} itemId id of item to revoke
 * @param {String} comment comment to leave on revoke
 * @returns {Promise}
 */
export function revokeItem(certId, itemId, comment = '') {
  const url = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/revoke`;
  return generateIgaApi().post(url, { comment });
}

/**
 * Save a comment for a single item
 * @param {String} certId certification id
 * @param {String} itemId id of item to revoke
 * @param {String} comment comment to add
 * @returns {Promise}
 */
export function saveComment(certId, itemId, comment) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/comment`;
  return generateIgaApi().post(resourceUrl, { comment });
}

/**
 * Update actors for a single item
 * @param {String} itemId id of item to update actors for
 * @param {Object} actors updated actors list
 * @returns {Promise}
 */
export function updateActors(itemId, actors) {
  const resourceUrl = `${governanceCertificationBaseUrl}/items/${itemId}/actors`;
  return generateIgaApi().put(resourceUrl, { actors });
}

/**
 *
 * Bulk Certification Item Actions
 *
 */

/**
 * certify multiple items
 * @param {object} certId certification id
 * @param {String} itemIds ids of items to certify
 * @returns {Promise}
 */
export function certifyItems(certId, itemIds) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/certify`;
  return generateIgaApi().post(resourceUrl, itemIds);
}

/**
 * reassign multiple items
 * @param {object} certId certification id
 * @param {String} itemIds ids of items to reassign
 * @returns {Promise}
 */
export function reassignCertificationTasks(certId, itemIds) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/reassign`;
  return generateIgaApi().post(resourceUrl, itemIds);
}

/**
 * revoke multiple items
 * @param {object} certId certification id
 * @param {String} itemIds ids of items to revoke
 * @returns {Promise}
 */
export function revokeItems(certId, itemIds) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/revoke`;
  return generateIgaApi().post(resourceUrl, itemIds);
}

/**
 * allow exception for multiple items
 * @param {object} certId certification id
 * @param {String} itemIds ids of items to allow exception for
 * @returns {Promise}
 */
export function exceptionItems(certId, itemIds) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/exception`;
  return generateIgaApi().post(resourceUrl, itemIds);
}

/**
 * forward all certification tasks
 * @param {object} certId certification id
 * @returns {Promise}
 */
export function forwardItems(certId, payload) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/forward`;
  return generateIgaApi().post(resourceUrl, payload);
}

/**
 * Certification Item Details
 */

/**
 * Obtains the entitlement details of a specific line item
 * @param {String} certId certification id
 * @param {String} itemId item id
 * @returns {Promise}
 */
export function getAccountDetails(certId, itemId) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/account`;
  return generateIgaApi().get(resourceUrl);
}

/**
 * Obtains the entitlement details of a specific line item
 * @param {String} certId certification id
 * @param {String} itemId item id
 * @returns {Promise}
 */
export function getEntitlementDetails(certId, itemId) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/entitlement`;
  return generateIgaApi().get(resourceUrl);
}

/**
 * Obtains the user details of a specific line item
 * @param {String} certId certification id
 * @param {String} itemId item id
 * @returns {Promise}
 */
export function getUserDetails(certId, itemId) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/user`;
  return generateIgaApi().get(resourceUrl);
}

/**
 * Obtains entitlements, accounts or roles details by user
 * @param {String} certId certification id
 * @param {String} itemId item id
 * @param {String} detailsType type of details to get
 * @returns {Promise}
 */
export function getUserDetailsByType(certId, itemId, detailsType) {
  const resourceUrl = `${governanceCertificationBaseUrl}/${certId}/items/${itemId}/user/${detailsType}`;
  return generateIgaApi().get(resourceUrl);
}
