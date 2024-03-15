const API_BASE_URL="https://api.foursquare.com/v3";
const API_KEY="fsq3FTFh5ALSJ1Hco4wYczyKad5TGFp6LOPPd5nsET3SQ1I="
const headers = {
    Accept: "application/json",
    Authorization: API_KEY
}
let USER_POSITION;

async function search(lat, lng, searchTerms) 
{
    const response = await axios.get(`${API_BASE_URL}/places/search`, 
    {
        params: 
        {
           query: encodeURI(searchTerms), //encodeURI function to convert special characters to their encoded eqv so that query will be wellformed
           ll: lat + "," + lng,
           // categories:"13033",  // enable use of categories
           sort:"DISTANCE",
           radius: 8000,
           limit: 50

        },
        headers: headers
        
    });
    return response.data;
}

async function GetPlacePhotos(fsq_id)
{
    console.log(fsq_id);
    const response = await axios.get(`${API_BASE_URL}/places/${fsq_id}/photos`, 
    {
        headers: headers
    });
    return response.data;
}

function getLocation() 
{
    if (navigator.geolocation) 
      return navigator.geolocation.getCurrentPosition(showPosition);
    else 
      return "Geolocation is not supported by this browser.";
}

function showPosition(position)
{
    USER_POSITION = {
      lat : position.coords.latitude,
      lng :  position.coords.longitude
    };
}

// search(1.3526, 103.8352 ,"pizza")