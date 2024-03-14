import * as THREE from 'https://cdn.skypack.dev/three@0.133.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.133.0/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, renderer, model, character;
let rotationSpeed = 0.005; // Adjust the rotation speed here
let keysPressed = {};

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a directional light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1); // Set the light direction to face the model
    scene.add(light);

    // Load Blender model
    const loader = new GLTFLoader();
    loader.load('models/planet2.glb', function(gltf) {
        model = gltf.scene;
        console.log("Model loaded:", model); // Add this line
        model.scale.set(1, 1, 1); // Scale the model up by 1.5x

        // Set the position of the planet to the origin (0, 0, 0)
        model.position.set(0, 0, 0);

        scene.add(model);

        // Position the character on the surface of the model
        createCharacter();
    });

    // Ensure camera is positioned not inside the model
    camera.position.z = 20;

    // Event listeners for arrow key controls
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
}

function animate() {
    requestAnimationFrame(animate);

    // Reset the position of the planet to the origin
    if (model) {
        model.position.set(0, 0, 0);
    }

    // Calculate rotation based on arrow keys pressed
    let rotationX = 0;
    let rotationY = 0;

    if (keysPressed[37]) { // Left arrow
        rotationY += rotationSpeed;
    }
    if (keysPressed[39]) { // Right arrow
        rotationY -= rotationSpeed;
    }
    if (keysPressed[38]) { // Up arrow
        rotationX += rotationSpeed;
    }
    if (keysPressed[40]) { // Down arrow
        rotationX -= rotationSpeed;
    }

    // Rotate the model based on calculated rotation
    if (model) {
        model.rotation.y += rotationY;
        model.rotation.x += rotationX;

    }

    // Render the scene
    renderer.render(scene, camera);
}

// Event listeners for arrow key controls
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

function onKeyDown(event) {
    keysPressed[event.keyCode] = true;

    // Rotate the character instantly to match the rotation of the planet.
    // could also set facing to the direction character facing  to trigger different
    
    if (event.keyCode === 37) { // Left arrow
        character.rotation.y = - (Math.PI/2);
    } else if (event.keyCode === 39) { // Right arrow
        character.rotation.y = Math.PI/2;
    } else if (event.keyCode === 38) { // Up arrow
        character.rotation.y = Math.PI;
    } else if (event.keyCode === 40) { // Down arrow
        character.rotation.y = 0;
    }
    
}

function onKeyUp(event) {
    keysPressed[event.keyCode] = false;
}



function createCharacter() {
    // Load the character model with its animations
    const loader = new GLTFLoader();
    loader.load('models/Adventurer.glb', function(gltf) {
        character = gltf.scene;

        // Calculate the ray direction from the camera's perspective
        const raycaster = new THREE.Raycaster();
        const centerScreen = new THREE.Vector2(0, 0); // Center of the screen
        raycaster.setFromCamera(centerScreen, camera);

        // Check for intersections with the planet2 model
        const intersects = raycaster.intersectObject(model, true);

        if (intersects.length > 0) {
            // Get the position of the first intersection point
            const intersectionPoint = intersects[0].point;

            // Position the character at the intersection point
            character.position.copy(intersectionPoint);
            // Rotate the character 90 degrees around the X-axis
            character.rotation.x = Math.PI / 2;
            // Reset other rotations
            character.rotation.y = 0;
            character.rotation.z = 0;

            scene.add(character);
        } else {
            
            console.log(instersects.length)
        }

    });
}
