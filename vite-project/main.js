DOMSelectors = {
    form: document.querySelector('.form'),
    container: document.querySelector('.container')
}

const a = DOMSelectors.form.value

const URL = `https://api.tomorrow.io/v4/weather/realtime?location=${a}&apikey=iU0uqAKQxxH8mqAh1YJojL7oWqCDVPL1`
async function getData(URL) {
    try {
        const response = await fetch(URL)
        const data = await response.json()
        console.log(data)
        DOMSelectors.container.insertAdjacentHTML('afterbegin',`
        <div class="card">
            <h1>${data.location.name}</h1>
            <h2>${data.data.temperature}</h2>
        </div>`)
    } catch (error) {
        console.log(error)
    }
}
getData(URL)