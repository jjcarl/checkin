angular.module('checkin.newLocationDirective', [])
.directive('gmap', function(){
    return {
        restrict: 'E',
        scope: {
            marker: '='
        },
        link: function(scope, element, attrs) {
            var marker;

            function initMap() {
                var map = new google.maps.Map(document.getElementById('gmap'), {
                    zoom: 12,
                    center: {lat: 40.233671, lng: -111.658673},
                    mapTypeId: google.maps.MapTypeId.HYBRID
                });
                var geocoder = new google.maps.Geocoder();

                document.getElementById('submit').addEventListener('click', function() {
                    geocodeAddress(geocoder, map);
                });

                google.maps.event.addListener(map, 'click', function(event){
                    addMarker(event.latLng, map);
                    console.log(event.latLng)
                    scope.marker.push({lat: event.latLng.J, lng: event.latLng.M});
                    scope.$apply();
                });

                var addMarker = function(location, map){
                    if (scope.marker.length <1){
                        var marker = new google.maps.Marker({
                            position: location,
                            map:map,
                            draggable: true
                        })
                    } else {
                        alert("Please only place one marker per location. Thank you.")
                    };
                }

            }

            function geocodeAddress(geocoder, resultsMap) {
                var address = document.getElementById('address').value;
                geocoder.geocode({'address': address}, function(results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        resultsMap.setCenter(results[0].geometry.location);
                        var point = results[0].geometry.location
                        scope.marker.push({lat: point.J, lng: point.M})
                        scope.$apply()
                        var marker = new google.maps.Marker({
                            map: resultsMap,
                            position: results[0].geometry.location
                        });
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
            }

            initMap();
        }
    }
})

// .directive('gmap', function(){
//     return {
//         restrict: 'E',
//         scope: {
//             marker: '='
//         },
//         link: function(scope, element, attrs) {
//             var marker;
//             var markerMap;

//             var drawMap = function() {
//                 var mapInfo = {
//                     zoom: 12,
//                     center: new google.maps.LatLng(40.233671, -111.658673),
//                     mapTypeId: google.maps.MapTypeId.SATELLITE
//                 };

//                 markerMap = new google.maps.Map(element[0], mapInfo);
                
                
                
                

//                 google.maps.event.addListener(markerMap, 'click', function(event){
//                     addMarker(event.latLng, markerMap)
//                     scope.marker.push({lat: event.latLng.H, lng: event.latLng.L})
//                     scope.$apply()
//                 });

//                 var addMarker = function(location, map){
//                     if (scope.marker.length <1){
//                         var marker = new google.maps.Marker({
//                             position: location,
//                             map:map,
//                             draggable: true
//                         })
//                     } else {
//                         alert("Please only place one marker per location. Thank you.")
//                     };

//                 }

//             }
//             drawMap();
//         }
//     }
// })