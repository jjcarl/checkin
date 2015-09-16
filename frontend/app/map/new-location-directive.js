angular.module('checkin.newLocationDirective', [])
.directive('gmap', function(){
    return {
        restrict: 'E',
        scope: {
            marker: '='
        },
        link: function(scope, element, attrs) {
            var marker;
            var markerMap;

            var drawMap = function() {
                var mapInfo = {
                    zoom: 12,
                    center: new google.maps.LatLng(40.233671, -111.658673),
                    mapTypeId: google.maps.MapTypeId.SATELLITE
                };

                markerMap = new google.maps.Map(element[0], mapInfo);
                
                
                
                

                google.maps.event.addListener(markerMap, 'click', function(event){
                    addMarker(event.latLng, markerMap)
                    scope.marker.push({lat: event.latLng.H, lng: event.latLng.L})
                    scope.$apply()
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
            drawMap();
        }
    }
})