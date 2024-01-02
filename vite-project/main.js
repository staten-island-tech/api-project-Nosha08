import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import proj4 from 'proj4'
import ThreeGlobe from 'three-globe'

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

let rotation = 0

function animate() {
    requestAnimationFrame(animate)
    sphere.rotation.y += 0.0015
    rotation += 0.0015
    controls.update()
    renderer.render(scene, camera)
}

animate()

if ("geolocation" in navigator) {
    // Prompt user for permission to access their location
    navigator.geolocation.getCurrentPosition(
      // Success callback function
      (position) => {
        // Get the user's latitude and longitude coordinates
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
  
        // Do something with the location data, e.g. display on a map
        console.log(`Latitude: ${lat}, longitude: ${lng}`);
        a(lat, lng)
      },
      // Error callback function
      (error) => {
        // Handle errors, e.g. user denied location sharing permissions
        console.error("Error getting user location:", error);
      }
    );
  } else {
    // Geolocation is not supported by the browser
    console.error("Geolocation is not supported by this browser.");
  }

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let radius = 5

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        let point = intersects[i].point;
        let lat = THREE.MathUtils.radToDeg(Math.asin(point.y / radius));
        let lon = THREE.MathUtils.radToDeg(Math.atan2(point.z, point.x) + rotation);
        lon = ((lon + 180) % 360 - 180) * -1
        console.log(`Latitude: ${lat}, Longitude: ${lon}`);
        a(lat, lon)
    }
}

window.addEventListener('click', onMouseClick, false);

async function a(lat, lon) {
    const locAPI = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=ef328f1da2a74f7da516384ae28cf9fd`
    const response = await fetch(locAPI)
    const data = await response.json()
    const location = data.features[0].properties.formatted
    const api = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&apikey=iU0uqAKQxxH8mqAh1YJojL7oWqCDVPL1`
    getData(api, location)
}

async function getData(api, location) {
    try {
        console.log(api)
        const response = await fetch(api)
        const data = await response.json()
        console.log(data)
        DOMSelectors.container.innerHTML = ''
        DOMSelectors.container.insertAdjacentHTML('beforeend', `
            <div class="card">
                <h1>${location}</h1>
                <h2>${data.data.values.temperature}</h2>
            </div>`)
    } catch (error) {
        console.log(error)
    }
}