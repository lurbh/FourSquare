let directionLayer;

function LoadMap()
{
    const map = L.map('singaporeMap');
    map.setView([1.3526, 103.8352], 13);
    // create a tile layer
    const basemap = L.tileLayer('https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png', {
        detectRetina: true,
        maxZoom: 19,
        minZoom: 11,
        /** DO NOT REMOVE the OneMap attribution below **/
        attribution: '<img src="https://www.onemap.gov.sg/web-assets/images/logo/om_logo.png" style="height:20px;width:20px;"/>&nbsp;<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener noreferrer">OneMap</a>&nbsp;&copy;&nbsp;contributors&nbsp;&#124;&nbsp;<a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a>'
    });
    basemap.addTo(map);

    return map;
}

function GetCurrentCoordinates(map)
{
    // get the boundaries of the map
    let bounds = map.getBounds();
    let center = bounds.getCenter();

    return center;
}

async function SeachOnMap(map,searchGroup)
{
    const searchlistbox = document.querySelector("#seachresults");
    const mapbox = document.querySelector("#singaporeMap");
    mapbox.classList.remove("col-9");
    searchlistbox.classList.remove("col-3");
    if(searchlistbox.hasChildNodes())
        searchlistbox.removeChild(searchlistbox.lastElementChild);
    const serchParams = document.querySelector("#searchText").value;
    const currentCoordinates = GetCurrentCoordinates(map);
    const searchresults = await search(currentCoordinates.lat,currentCoordinates.lng,serchParams);
    DisplayResults(searchresults,searchGroup,map);
}

async function DisplayResults(searchresults,searchGroup,map)
{
    const searchlistbox = document.querySelector("#seachresults");
    const mapbox = document.querySelector("#singaporeMap");
    mapbox.classList.add("col-9");
    searchlistbox.classList.add("col-3");
    const searchholder = document.createElement("div");
    for(let location of searchresults.results)
    {
        // console.log(location);
        const lat = location.geocodes.main.latitude;
        const lng = location.geocodes.main.longitude;
        const marker = L.marker([lat, lng]);
        marker.bindPopup(function(){

            const divElement = document.createElement('div');
            divElement.innerHTML = `
                <h3>${location.name}</h3>
                <img src="#"/>
                <h4>${location.location.formatted_address}</h4>
                <button class="DirectionsButton">Get Directions</button>
            `;

            async function getPicture() {
                const photos = await GetPlacePhotos(location.fsq_id);
                const firstPhoto = photos[0];
                const photoUrl = firstPhoto.prefix + '150x150' + firstPhoto.suffix;
                divElement.querySelector("img").src = photoUrl;
            }

            getPicture();

            divElement.querySelector(".DirectionsButton").addEventListener("click", async function(){
                // alert(`lat: ${lat},lng: ${lng}`);
                getLocation();
                let destination = { 
                    lat : lat,
                    lng : lng
                };
                // console.log(USER_POSITION);
                let route = await GetDirections(USER_POSITION,destination, 'drive');
                // let test = await GetDirectionsPublicTransport(USER_POSITION,destination)
                
                if (directionLayer)
                    directionLayer.remove();
                directionLayer = L.Polyline.fromEncoded(route.route_geometry).addTo(map);
                // console.log(polyUtil.decode(route.route_geometry));
                // let coord = L.Polyline.fromEncoded(route.route_geometry).getLatLngs()
                // console.log(coord);
                // directionLayer = L.geoJson(route.routes[0].geometry, {
                //     // the onEachFeatue function is executed on each feature from the geoJson file
                //     // parameter 1: the feature object (from the geojson file)
                //     // parameter 2: the Leaflet visual representation (ie, a layer) of that feature
                //     onEachFeature:function(feature, layer) {
                //     }
                // }).addTo(map);
                ShowDirections(route)
                directionLayer.setStyle({
                    color:'red'
                })
            });


            // whatver element or HTML the function returns will be inside popup
            return divElement;
        });
        marker.addTo(searchGroup);
        
        const node = document.createElement("div");
        node.innerHTML = location.name;
        node.addEventListener("click", function () {
            map.flyTo([lat, lng], 16);
            marker.openPopup();
        });
        searchholder.appendChild(node);
    }
    searchlistbox.appendChild(searchholder);
}

function ShowDirections(route)
{
    const searchlistbox = document.querySelector("#seachresults");
    if(searchlistbox.hasChildNodes())
        searchlistbox.removeChild(searchlistbox.lastElementChild);
    console.log(route);
    const directionsholder = document.createElement("div");
    const routeholder = document.createElement("div");
    let text = `
    <div class="accordion" id="accordionExample">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    ${route.route_summary.start_point} to ${route.route_summary.end_point} (${route.subtitle})
                </button>
            </h2>
                <div id="collapseOne" class="c collapse show" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
    `;
    for( let i of route.route_instructions)
    {
        text += `${i[9]} for ${i[5]}\n\n` ;
    }
    text += `
                    </div>
            </div>
        </div>
    </div>
    `;
    console.log(text);
    routeholder.innerHTML = text;
    directionsholder.appendChild(routeholder);
    searchlistbox.appendChild(directionsholder);
    // for (let i = 0; i < route.length ; i++)
    // {

    // }
    //     const routeholder = document.createElement("div");
    //     routeholder.innerHTML = `
    //     <div class="accordion" id="accordionExample">
    //         <div class="accordion-item">
    //             <h2 class="accordion-header">
    //             <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
    //                 Accordion Item #1
    //             </button>
    //             </h2>
    //             <div id="collapseOne" class="c collapse show" data-bs-parent="#accordionExample">
    //             <div class="accordion-body">
    //                 <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
    //             </div>
    //         </div>
    //     </div>
    //     `;

    //     const accordianbody = document.createElement("div");
    //     // accordianbody.innerHTML


    //     // routeaccordian.appendChild(accordianheader);
    //     // routeaccordian.appendChild(accordianbody);
    //     // routeholder.appendChild(routeaccordian);
        // directionsholder.appendChild(routeholder);
    // }
    // searchlistbox.appendChild(directionsholder);
}
/*
<div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        Accordion Item #1
      </button>
    </h2>
    <div id="collapseOne" class="c collapse show" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  */