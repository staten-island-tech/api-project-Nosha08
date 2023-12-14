DOMSelectors = {
    form: document.querySelector('.form'),
    location: document.querySelector('#location'),
    container: document.querySelector('.container')
}

DOMSelectors.form.addEventListener('submit', function (event) {
    event.preventDefault()
    const a = DOMSelectors.location.value

    const api = `https://api.tomorrow.io/v4/weather/realtime?location=${a}&apikey=iU0uqAKQxxH8mqAh1YJojL7oWqCDVPL1`
    async function getData(api) {
        try {
            console.log(api)
            const response = await fetch(api)
            const data = await response.json()
            console.log(data)
            DOMSelectors.container.insertAdjacentHTML('beforeend',`
            <div class="card">
                <h1>${data.location.name}</h1>
                <h2>${data.data.values.temperature}</h2>
            </div>`)
        } catch (error) {
            console.log(error)
        }
    }
    getData(api)
})

