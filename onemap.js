const ONEMAP_URL = "https://www.onemap.gov.sg";
const ROUTING_API = "/api/public/routingsvc/route";
const ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2ZjUzZWM1MzYxYzQ2MThlMzFjNDM5MmQ4Y2FkNTQwYiIsImlzcyI6Imh0dHA6Ly9pbnRlcm5hbC1hbGItb20tcHJkZXppdC1pdC0xMjIzNjk4OTkyLmFwLXNvdXRoZWFzdC0xLmVsYi5hbWF6b25hd3MuY29tL2FwaS92Mi91c2VyL3Nlc3Npb24iLCJpYXQiOjE3MDg5Mzg2OTcsImV4cCI6MTcwOTE5Nzg5NywibmJmIjoxNzA4OTM4Njk3LCJqdGkiOiJUVVU0NzdRZ1RSSldCV0IwIiwidXNlcl9pZCI6MjYwMiwiZm9yZXZlciI6ZmFsc2V9.xdZlgD0SSZfE1CHRO5HC8OJDr7JsFxIhpTyNQtxwCaw";
const header = {
    Authorization : `Bearer ${ACCESS_TOKEN}`
}

async function GetDirections(from,to,routetype)
{
    // console.log(from,to);
    // let coordinates = `${from.lng.toFixed(6)},${from.lat.toFixed(6)};${to.lng.toFixed(6)},${to.lat.toFixed(6)}`;
    // console.log(`${ONEMAP_URL}${ROUTING_API}`);
    let response = await axios.get(`${ONEMAP_URL}${ROUTING_API}`,{
        params: 
        {
           start : `${from.lat},${from.lng}`,
           end : `${to.lat},${to.lng}`,
           routeType : routetype
        }, 
        headers: header
    });
    // console.log(response.data);
    return response.data;
}

async function GetDirectionsPublicTransport(from,to)
{
    console.log(from,to);
    let datetime = new Date();
    let date = `${datetime.getMonth()}-${datetime.getDate()}-${datetime.getFullYear()}`;
    let time = `${datetime.getHours()}${datetime.getMinutes()}00`;
    console.log(date);
    // let coordinates = `${from.lng.toFixed(6)},${from.lat.toFixed(6)};${to.lng.toFixed(6)},${to.lat.toFixed(6)}`;
    // console.log(`${ONEMAP_URL}${ROUTING_API}`);
    let response = await axios.get(`${ONEMAP_URL}${ROUTING_API}`, {
        params: 
        {
           start : `${from.lat},${from.lng}`,
           end : `${to.lat},${to.lng}`,
           routeType : 'pt',
           date : date,
           time : time,
           mode : "TRANSIT",
           maxWalkDistance : 1000,
           numItineraries : 3
        }, 
        headers: header
    });
    console.log(response.data);
    return response.data;
}