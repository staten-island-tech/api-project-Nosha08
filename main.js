function greet(name) {
    const greetPromise = new Promise(function (resolve, rejected) {
        resolve(`Hello ${name}`)
    })
    return greetPromise
}

const nuggies = greet('Nuggies')
nuggies.then((result) => {
    console.log(result)
})


//REST API
const URL = `https://api.quotable.io/random`

async function getData(URL) {
    try {
        const response = await fetch(URL)
        console.log(response)
        //take response from server and convert it to JSON
        const data = await response.json()
        console.log(data)
        document.querySelector('h1').textConent = data.content
        document.querySelector('h2').textConent = data.author
    } catch (error) {
        
    }
}

getData(URL)