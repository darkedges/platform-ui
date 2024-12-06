# Copyright (c) 2020-2023 ForgeRock. All rights reserved.
#
# This software may be modified and distributed under the terms
# of the MIT license. See the LICENSE file for details.

FROM gcr.io/forgerock-io/nginx-unprivileged-headers-more:7.5.0-f163a4d208f95a42f3ca82d0a306812dcb3b74f9
COPY --chown=nginx packages/platform-enduser/dist /usr/share/nginx/html

COPY --chmod=0755 --chown=nginx variable_replacement.sh /variable_replacement.sh
COPY --chmod=0755 --chown=nginx entrypoint.sh /entrypoint.sh

CMD ["/entrypoint.sh"]
