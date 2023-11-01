/**
 * Copyright (c) 2023 ForgeRock. All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

import dayjs from 'dayjs';

const utc = require('dayjs/plugin/utc');

dayjs.extend(utc);

/**
  * Sets array used by vue2-date-range-picker for hard-coded intervals
  *
  * @returns {DateRange[]} array of DateRange objects
  */
export default function dateRanges(startDateFormat, endDateFormat) {
  const formatStart = (dayjsDate) => dayjsDate.utc().format(startDateFormat);
  const formatEnd = (dayjsDate) => dayjsDate.utc().format(endDateFormat);

  // Today
  const startOfDay = formatStart(dayjs());
  const now = formatEnd(dayjs().add(1, 'day'));

  // Yesterday
  const yesterdayStart = formatStart(dayjs().subtract(1, 'day'));
  const yesterdayEnd = formatEnd(dayjs().subtract(1, 'day'));

  // Last 7 days
  const last7DaysStart = formatStart(dayjs().subtract(7, 'day'));

  // Last 30 days
  const last30DaysStart = formatStart(dayjs().subtract(30, 'day'));

  return {
    Today: [startOfDay, now],
    Yesterday: [yesterdayStart, yesterdayEnd],
    'Last 7 Days': [last7DaysStart, now],
    'Last 30 Days': [last30DaysStart, now],
  };
}