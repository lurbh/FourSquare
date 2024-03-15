document.addEventListener("DOMContentLoaded", function () { 
    const map = LoadMap();
    const searchGroup = L.markerClusterGroup();
    searchGroup.addTo(map);

    const searchBtn = document.querySelector("#searchBtn");
    searchBtn.addEventListener("click", async function(){
        getLocation();
        searchGroup.clearLayers();
        SeachOnMap(map,searchGroup);
    });

    document.querySelector("#toggleSearchBtn").addEventListener("click", function(){
        
        const searchContainer = document.querySelector("#search-container");
        const style = window.getComputedStyle(searchContainer);
        // if the search container is already visible, we'll hide it
        if (style.display != "none") {
            searchContainer.style.display = "none";
        } else {
              // otherwise, show it
              searchContainer.style.display = 'block';
              
        }

      
    })
});

