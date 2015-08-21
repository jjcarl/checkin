'use strict';

angular.module('checkin.version', [
  'checkin.version.interpolate-filter',
  'checkin.version.version-directive'
])

.value('version', '0.1');
