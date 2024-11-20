let t = 0; // Time factor used to control animation speed based on frame count
let td = 0.1; // Potential time increment variable (currently unused)
let ts = 0; // Speed and intensity factor for star movement

let rx = 0; // Rotation variable for potential x-axis rotation (currently unused)
let ry = 0; // Rotation variable for potential y-axis rotation (currently unused)
let rz = 0; // Rotation variable for potential z-axis rotation (currently unused)
let rh = 0; // Placeholder variable, could represent rotation height (unused)

let sx = []; // Array to store x-coordinates of 1500 stars for background
let sy = []; // Array to store y-coordinates of 1500 stars for background
let sz = []; // Array to store z-coordinates of 1500 stars for background

let starsx = []; // Array for initial x-positions of stars in structures
let starsy = []; // Array for initial y-positions of stars in structures
let starsz = []; // Array for initial z-positions of stars in structures

let starsxx = []; // Array for target x-coordinates, guiding movement
let starsyy = []; // Array for target y-coordinates, guiding movement
let starszz = []; // Array for target z-coordinates, guiding movement

let starsxd = []; // Array to track x-difference between current and target positions
let starsyd = []; // Array to track y-difference between current and target positions
let starszd = []; // Array to track z-difference between current and target positions

let sound; // Sound object to hold and control audio file
let analyzer; // Amplitude analyzer to measure the sound’s volume
let amplitude; // Stores amplitude level for visual effects (unused)

function preload() {
    // Preloads the sound file before the sketch runs to prevent loading delays
    sound = loadSound('tkn.mp3'); // Load the sound file 'nota.mp3'
}

function setup() {
    // Initializes canvas and settings once at the beginning
    createCanvas(windowWidth, windowHeight, WEBGL); // Creates a 3D canvas with window dimensions

    analyzer = new p5.Amplitude(); // Sets up amplitude analysis on the sound
    analyzer.setInput(sound); // Links analyzer to sound input

    // Initialize stars for structures and background with random positions
    for (let i = 0; i < 500; i++) {
        starsx[i] = random(windowWidth / 2) - windowWidth / 4;
        starsy[i] = random(windowHeight / 2) - windowHeight / 4;
        starsz[i] = random(-500); // Random z-depth for 3D effect
    }
    for (let i = 0; i < 500; i++) {
        starsxx[i] = random(windowWidth / 2) - windowWidth / 4;
        starsyy[i] = random(windowHeight / 2) - windowHeight / 4;
        starszz[i] = random(-500); // Different target positions for movement effect
    }
    for (let i = 0; i < 1500; i++) {
        sx[i] = random(windowWidth / 2) - windowWidth / 4;
        sy[i] = random(windowHeight / 2) - windowHeight / 4;
        sz[i] = random(-500); // Star background with 3D depth effect
    }

    noCursor(); // Hides the cursor for a clean visual experience
}

function draw() {
    // Main animation loop; redraws frame by frame
    t = frameCount * 0.001; // Controls rotation speed
    ts -= 0.005; // Decreases ts over time for gradual motion slowdown
    if (ts < 0) ts = 0; // Prevents ts from going below 0

    background(0); // Sets background to black

    let volume = analyzer.getLevel(); // Fetches current volume level (amplitude)

    // If volume is above a threshold, call update function to refresh star targets
    if (volume > 0.06 + ts) update();

    // Sets camera for slight zooming effect based on time
    camera(0, 0, 200 + sin(t * 10) * 40, 0, 0, 0, 0, 1, 0);
    rotateZ(t); // Rotates around z-axis based on time

    // Draws the star background
    for (let i = 0; i < 1500; i++) {
        stroke(255 * sin(starsx[i] * 3), 155, 190); // Star color varies by position
        strokeWeight(sin(starsx[i]) * 2 + 2); // Star size changes with position
        point(sx[i] * 5, sy[i] * 5, sz[i] * 2 - 500); // Places star in 3D space
    }

    strokeWeight(8);
    noFill();

    // Draws shapes formed by stars in 3D using TRIANGLE_STRIP
    for (let j = 0; j < 24; j += 6) { // Loop through star sets
        for (let k = 1; k < 44; k += 11.9) { // Controls star connection distance
            stroke(755 / k * 10, 255 / k * 5, 255 + starsz[j] / k * 10); // Color effect
            strokeWeight(4);
            beginShape(TRIANGLE_STRIP);
            for (let i = j; i < j + 6; i++) {
                vertex(starsx[i] + sin(ts * 100) * ts + k,
                       starsy[i] + sin(ts * 100) * ts,
                       starsz[i] * 2 - k); // Places vertices in 3D space
            }
            endShape(CLOSE); // Completes shape connection
        }
    }

    starsupdate(); // Update star positions
}

function starsupdate() {
    // Adjusts the star positions over time to create smooth movement
    for (let i = 0; i < 500; i++) {
        starsxx[i] += sin(t * i * 0.02) * 0.1; // Adds small sine-based movement in x
        starsyy[i] += cos(t * i * 0.2) * 0.1; // Adds small cosine-based movement in y
    }

    // Moves stars towards target positions, based on the ts value
    for (let i = 0; i < 500; i++) {
        starsxd[i] = (starsxx[i] - starsx[i]);
        starsx[i] += starsxd[i] * ts;

        starsyd[i] = (starsyy[i] - starsy[i]);
        starsy[i] += starsyd[i] * ts;

        starszd[i] = (starszz[i] - starsz[i]);
        starsz[i] += starszd[i] * ts;
    }
}

function update() {
    // Randomly changes target positions of stars to create a responsive effect
    for (let i = 0; i < 500; i++) {
        starsxx[i] += random(-450) + 225;
        starsyy[i] += random(-450) + 225;
        starszz[i] += random(-450) + 225;
    }

    // Keeps stars within defined canvas boundaries for smoother transitions
    for (let i = 0; i < 500; i++) {
        if (abs(starsxx[i]) > windowWidth / 2) starsxx[i] = 0;
        if (abs(starsyy[i]) > windowWidth / 2) starsyy[i] = 0;
        if (starszz[i] > 0) starszz[i] = -500;
    }

    ts = 0.25; // Resets ts to ensure ongoing movement
}

// Controls playback with the spacebar
function keyPressed() {
    if (key === ' ') { // Checks if the spacebar is pressed
        if (sound.isPlaying()) {
            sound.pause(); // Pauses sound if currently playing
        } else {
            sound.play(); // Plays sound if currently paused
        }
    }
}

