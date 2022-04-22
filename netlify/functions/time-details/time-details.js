// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
// body: "{\"abbreviation\":\"EDT\",\"country_code\":\"US\",\"day_of_week\":5,\"day_of_year\":112,\"region_name\":\"Florida\",\"time_zone\":\"America/New_York\",\"utc_datetime\":\"2022-04-22T13:16:38.810997+00:00\",\"week_number\":16}"
const fetch = (...args) => import('node-fetch')
  .then(({default: fetch}) => fetch(...args));

const {GEO_API_KEY} = process.env

const handler = async () => {
  try {
    let geoIP = await fetch(`https://api.freegeoip.app/json/?apikey=${GEO_API_KEY}`)
    const {country_code, region_name, time_zone} = await geoIP.json();
    const worldTime = await fetch(`http://worldtimeapi.org/api/timezone/${time_zone}`)
    const data = await worldTime.json();
    const {abbreviation, day_of_week, day_of_year, week_number, utc_datetime} = data;
    return {
      statusCode: 200,
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        abbreviation,
        country_code,
        day_of_week,
        day_of_year,
        region_name,
        time_zone,
        utc_datetime,
        week_number
      }),
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Unable to fetch time details'}),
    }
  }
}

module.exports = {handler}
