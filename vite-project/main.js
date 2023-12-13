const a  = 'nyc'

const URL = `https://api.tomorrow.io/v4/weather/realtime?location=${a}&apikey=iU0uqAKQxxH8mqAh1YJojL7oWqCDVPL1`
async function getData(URL) {
    try {
        const response = await fetch(URL)
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.log(error)
    }
}
getData(URL)