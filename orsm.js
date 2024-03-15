const OSRM__ROUTE_BASE_API = "http://router.project-osrm.org/route/v1/driving/"
const ORSM_BACK_API = "?alternatives=true&steps=true&geometries=geojson&overview=full&annotations=true";

// async function GetDirections(from,to)
// {
//     console.log(from,to);
//     let coordinates = `${from.lng.toFixed(6)},${from.lat.toFixed(6)};${to.lng.toFixed(6)},${to.lat.toFixed(6)}`;
//     console.log(`${OSRM__ROUTE_BASE_API}${coordinates}${ORSM_BACK_API}`);
//     let response = await axios.get(`${OSRM__ROUTE_BASE_API}${coordinates}${ORSM_BACK_API}`);
//     console.log(response.data);
//     return response.data;
// }

