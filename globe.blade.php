<link rel="stylesheet" href="https://js.arcgis.com/4.12/esri/themes/light/main.css"/>
<link rel="stylesheet" href="/css/globe.css"/>
<script src="https://js.arcgis.com/4.12/"></script>
<div id="viewDiv"></div>

<script>
    require([
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/TileLayer",
        "esri/Basemap"
    ], function(Map, SceneView, TileLayer, Basemap) {

        const basemap = new Basemap({
            baseLayers: [
                new TileLayer({
                    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer"
                })
            ]
        });

        const map = new Map({
            basemap: basemap
        });

        const view = new SceneView({
            container: "viewDiv",
            map: map,
            alphaCompositingEnabled: true,
            qualityProfile: "high",
            camera: {
                position: [20, 22, 25000000],
            },
            environment: {
                background: {
                    type: "color",
                    color: [244, 244, 244, 0]
                },
                starsEnabled: false,
                atmosphereEnabled: false,
                lighting: {
                    directShadowsEnabled: false,
                }
            },
            constraints: {
                altitude: {
                    min: 1000000,
                    max: 25000000
                }
            }
        });
        view.ui.empty("top-left");
    }); 
</script>