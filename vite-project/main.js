import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import proj4 from 'proj4'

const DOMSelectors = {
    form: document.querySelector('.form'),
    location: document.querySelector('#location'),
    container: document.querySelector('.container')
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    renderer.setSize(sizes.width, sizes.height)
})

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)
camera.position.z = 22 
renderer.render(scene, camera)

const texture = new THREE.TextureLoader().load('earth.jpg')
const geometry = new THREE.SphereGeometry(5, 100, 100)
const material = new THREE.MeshStandardMaterial({
    map: texture
})
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

const pointLight = new THREE.AmbientLight(0xffffff, 3)
pointLight.position.set(0, 10, 10)
scene.add(pointLight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function animate() {
    requestAnimationFrame(animate)

    sphere.rotation.y += 0.003

    controls.update()

    renderer.render(scene, camera)
}

animate()

window.addEventListener('click', onClick)

function onClick(event) {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(sphere);

    if (intersects.length > 0) {
        const worldCoords = sphere.position.clone().applyMatrix4(sphere.matrixWorld);

        // Use a library like proj4 for accurate conversion
        const geographicCoords = proj4('<your_projection_from>', '<your_projection_to>', [worldCoords.x, worldCoords.y]);

        // The resulting geographicCoords array will contain latitude and longitude
        const latitude = geographicCoords[1];
        const longitude = geographicCoords[0];

        console.log('Latitude:', latitude, 'Longitude:', longitude);

        const api = `https://api.tomorrow.io/v4/weather/realtime?location=${latitude},${longitude}&apikey=iU0uqAKQxxH8mqAh1YJojL7oWqCDVPL1`

        // Update the form submit event listener outside the click event
        DOMSelectors.form.addEventListener('submit', function (event) {
            event.preventDefault()
            const a = DOMSelectors.location.value

            const api = `https://api.tomorrow.io/v4/weather/realtime?location=${a}&apikey=iU0uqAKQxxH8mqAh1YJojL7oWqCDVPL1`
            getData(api)
        })

        // Call getData with the new API inside the click event
        getData(api)
    }
}

// Move the getData function outside of the click event listener
async function getData(api) {
    try {
        console.log(api)
        const response = await fetch(api)
        const data = await response.json()
        console.log(data)
        DOMSelectors.container.insertAdjacentHTML('beforeend', `
            <div class="card">
                <h1>${data.location.name}</h1>
                <h2>${data.data.values.temperature}</h2>
            </div>`)
    } catch (error) {
        console.log(error)
    }
}