// Select canvas element from HTML
const canvas = document.querySelector('canvas')

// Returns an object providing methods for drawing and manipulating graphics on canvas
const c = canvas.getContext('2d')

// Set canvas dimensions to fill the screen
canvas.width = innerWidth
canvas.height = innerHeight

// Load the image
const backgroundImage = new Image();
backgroundImage.src = 'VisualVault/bg.png'; // Replace with your image path

// Draw the image onto the canvas once it's loaded
backgroundImage.onload = function() {
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Query Selections for UI elements \\
const htmlCanvas = document.getElementsByTagName("canvas")[0];
const score = document.querySelector('#scorenum')
const scoreBrd = document.querySelector('#scoreBrd')
const startGameBtm = document.querySelector('#startGameBtn')
const startGameBrd = document.querySelector('#startGameBrd')
const musicControl = document.querySelector('#musicControl')
const soundControl = document.querySelector('#soundControl')
const gameControl = document.querySelector('#gameControl')
const layer1 = document.querySelector('.layer1')
const layer2 = document.querySelector('.layer2')
const layer3 = document.querySelector('.layer3')
const outer = document.querySelector('.outer')
const inner = document.querySelector('.inner')
const percentage = document.querySelector('span')
const processing = document.querySelector('.processing')
const p1 = document.querySelector('.p1')
const p2 = document.querySelector('.p2')
const p3 = document.querySelector('.p3')
const layer4 = document.querySelector('.layer4')
const layer5 = document.querySelector('.layer5')
const layer6 = document.querySelector('.layer6')
const alias = document.querySelector('.alias')
const save_btn = document.querySelector('#save-btn')
const main = document.querySelector('.main')
const power1 = document.querySelector('#power1')
const power2 = document.querySelector('#power2')
const power3 = document.querySelector('#power3')
const guid = document.querySelector('.guid')


// Class declarations \\
// Player class represents the user's base character
class Player {
    constructor(x, y, color, radius){
        // Initialize player attributes
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
        this.sfrRadius = 50 // Sphere radius for chameleon mode

        // Load the GIF
        this.gif = new Image();
        this.gif.src = 'VisualVault/earth.gif'
    }

    // Method to draw the player on canvas
    draw() {
        // Draw player circle
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.shadowBlur = 70
        c.shadowColor = this.color
        c.fill()
        
        // Draw the GIF inside the player circle if it's loaded
        if (this.gif.complete) {
            c.drawImage(this.gif, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        }
        
        // Draw outer circle for chameleon mode
        c.beginPath()
        c.arc(this.x, this.y, this.sfrRadius, 0, Math.PI * 2, false)
        c.lineWidth = 4
        c.strokeStyle = this.color
        c.stroke()
        c.shadowBlur = 0
    }
}

// Dart class represents projectiles
class Dart {
    constructor(x, y, color, radius, velocity){
        // Initialize dart attributes
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
        this.vel = velocity // Velocity of the dart
    }

    // Method to draw the dart on canvas
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    // Method to update the dart's position
    update () {
        this.draw()
        // Update projectile position by velocity
        this.x += this.vel.x * 7
        this.y += this.vel.y * 7
    }
}

// Targets class represents enemies
class Targets {
    constructor(x, y, color, radius, velocity){
        // Initialize target attributes
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
        this.vel = velocity // Velocity of the target
    }

    // Method to draw the target on canvas
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    // Method to update the target's position
    update(div=1) {
        this.draw()
        // Update target position by velocity
        this.x += this.vel.x / div
        this.y += this.vel.y / div
    }
}

// Super Targets class represents boss enemies
class colossalTargets extends Targets {
    constructor(x, y, color, radius, velocity) {
        super(x, y, color, radius, velocity)
        this.colossal = true // Indicate if the target is colossal
    }

    // Override update method to adjust movement for colossal targets
    update() {
        this.draw()
        this.x += this.vel.x / 2 // Adjust x velocity for colossal targets
        this.y += this.vel.y / 2 // Adjust y velocity for colossal targets
    }
}

// Particle class represents visual effects
class Particle {
    constructor(x, y, color, radius, velocity){
        // Initialize particle attributes
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
        this.vel = velocity // Velocity of the particle
        this.opacity = 1 // Opacity of the particle
        this.friction = 0.99
    }

    // Method to draw the particle on canvas
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    // Method to update the particle's position and opacity
    update () {
        this.draw()
        // Update particle position by velocity
        this.vel.x *= this.friction
        this.vel.y *= this.friction
        this.x += this.vel.x
        this.y += this.vel.y
        // Decrease opacity over time
        this.opacity -= 0.01
    }
}


// Global variables \\

// Player object
let player
// Player username
let USERNAME = 'Player'
// Flag to indicate if the game is on
let GAME0N = true
// Player score
let SCORE = 0
// List to store projectiles
let DARTS = []
// List to store targets
let TARGETS = []
// List to store particles for visual effects
let PARTICLES = []
// Flags to control power-up availability
let alwPower1 = true
let alwPower2 = false
let alwPower3 = false
// Event listener function variables
let _board
let _music
let _sound
let _pauser
let _shooter
let _mousedown
let _mousemove
let _mouseup


// INITIALIZE GAME \\
function init()
{
    // Clear canvas and set dimensions
    canvas.width = innerWidth
    canvas.height = innerHeight
    c.clearRect(0, 0, canvas.width, canvas.height)

    // Create player object
    GAME0N = true
    player = new Player(innerWidth / 2, innerHeight / 2, 'white', 40)

    // Initialize lists
    DARTS = []
    TARGETS = []
    PARTICLES = []

    // Reset power-up availability
    alwPower1 = true
    // Create the pop in and out animation
    gsap.to(power1, {scale: 1.3, duration: 0.5, delay: 2, yoyo: true, repeat: 5, ease: "power1.inOut"})

    alwPower2 = false
    alwPower3 = false
    activated2 = false
    activated3 = false
    power1.style.opacity = 1
    power2.style.opacity = 0.5
    power3.style.opacity = 0.5

    // Clear all timeouts
    let timeoutID = setTimeout(() => {});
    while (timeoutID--) {
        clearTimeout(timeoutID);
    }
    // Clear all intervals
    let intervalID = setInterval(() => {}, 0);
    while (intervalID--) {
        clearInterval(intervalID);
    }

    // Reset score
    SCORE = 0
    score.innerHTML = SCORE
    scoreBrd.innerHTML = SCORE
}


/// GAME CONTROLS \\\
// Audio player function to play sounds
function sounder(path, vol=1)
{
    if (soundOn)
    {
        const player = new Audio(path)
        player.volume = vol
        player.play()
    }
}

// Variables to control background music
let music
let soundOn = true
let musicOn = true

// Function to play background music and control sound settings
function musiker()
{
    // Play random background music
    music = new Audio
    rm = Math.floor(Math.random() * 8.99)
    music.src = `TuneBox/m${rm}.mp3`
    music.loop = true
    music.volume = 0.9
    music.play()
    musicOn = true
    musicControl.style.opacity = 1

    // Toggle background music on music control button click
    musicControl.addEventListener('click', _music = () => {
        if (musicOn)
        {
            music.pause()
            musicControl.style.opacity = 0.7
        } else {
            music.play()
            musicControl.style.opacity = 1
        }
        musicOn = !musicOn
    })

    // Toggle sound on sound control button click
    soundControl.addEventListener('click', _sound = () => {
        if (soundOn)
        {
            soundControl.style.opacity = 0.7
        } else {
            soundControl.style.opacity = 1
        }
        soundOn = !soundOn
    })
}

// Game PAUSING ||<| \\
let PAUSED = false
function pausePlay() {
    // Toggle the PAUSED flag when the game control button is clicked
    gameControl.addEventListener('click', _pauser = () => {
        if (GAME0N)
        {
            PAUSED = !PAUSED
            if (PAUSED) {
                // If paused, cancel the animation frame and change button icon
                cancelAnimationFrame(animeID)
                gameControl.style.backgroundImage = 'url(VisualVault/play.png)'
            } else {
                // If unpaused, resume animation and change button icon
                animeID = requestAnimationFrame(animator)
                gameControl.style.backgroundImage = 'url(VisualVault/pause.png)'
            }
        }
    })
}


//| GAME MODES |\\
/// Chameleon MODE; Make player change colors like a chameleon
function chameleon() {
    // let n = 0
    // // Iterate through the color wheel
    // const id = setInterval(() => {
    //     if (!PAUSED && GAME0N)
    //     {
    //         // Green Sock Animation to change player color
    //         gsap.to(player, {
    //             color: `hsl(${n}, 58%, 55%)`
    //         })
    //         n += 2
    //     }
    // }, 1000)

    // Set up player SPHERE animation
    gsap.to(player, { sfrRadius: 100, duration: 0.7, ease: "player.in"})
}

/// NORMAL MODE: In this mode, Projectiles are shot for each mouse click
// Listen for mouse clicks
function Normal() {
    // Event listener for mouse clicks
    addEventListener('click', _shooter = (event) => {
        // Get the angle of the projectile
        if (!PAUSED && GAME0N)
        {
            const angle = Math.atan2(event.clientY - canvas.height / 2 , event.clientX - canvas.width / 2)
            const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            }
            // Create Projectile on click
            DARTS.push(new Dart(
                canvas.width / 2,
                canvas.height / 2,
                'white',
                5,
                velocity
            ))

            htmlCanvas.style.cursor = "url('VisualVault/_aim.png') 25 25, auto";
            setTimeout(() => {
                htmlCanvas.style.cursor = "url('VisualVault/aim.png') 30 30, auto";
            }, 70); // Adjust delay as needed

            // Play shooting sound effect
            sounder('TuneBox/shot.mp3', 0.6)
        }
    })
}

/// OVERDRIVE MODE: In this mode, Projectiles are shot as long as the mouse click is down
// Listen for mouse down
function Overdrive()
{
    let isMouseDown = false

    // Function to create a projectile
    function createProjectile(event) {
        const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        // Create Projectile
        DARTS.push(new Dart(
            canvas.width / 2,
            canvas.height / 2,
            player.color,
            5,
            velocity
        ))
    }

    // cursor animation
    htmlCanvas.style.cursor = "url('VisualVault/autoAim.png') 30 30, auto";

    // Event listener for mouse down
    addEventListener('mousedown', _mousedown = (event) => {
        isMouseDown = true
        createProjectile(event)
    })
    // Event listener for mouse move
    addEventListener('mousemove', _mousemove = (event) => {
        createProjectile(event)
    })
    // Event listener for mouse up
    addEventListener('mouseup', _mouseup = () => {
        isMouseDown = false
    })
}


//\ Game POWER UPs /\\
function power_I() {
    if (alwPower1 && GAME0N && !PAUSED)
    {
        // Play power up sound
        sounder('TuneBox/ultra-field.mp3', 0.9)
        // Pause Target creation
        clearInterval(spawnTargetsID)

        // Scale player size for power-up duration
        gsap.to(player, {sfrRadius: 800, duration: 5, ease: "power1.inOut"});
        setTimeout(() => {
            // Resume Target attacks and revert player size
            spawnTargets()
            gsap.to(player, {sfrRadius: 100, duration: 3, ease: "power1.inOut"});
        }, 20000)

        // Diminish power-up button opacity and set cooldown
        gsap.to(power1, { opacity: 0.5, duration: 0.5 });
        alwPower1 = false
    }

    setTimeout(() => {
        // Reset power-up button opacity and cooldown
        gsap.to(power1, { opacity: 1, duration: 0.5 });
        alwPower1 = true
        sounder('TuneBox/play.mp3')
        // Create the pop in and out animation
        gsap.to(power1, {scale: 1.3, duration: 0.5, yoyo: true, repeat: 5, ease: "power1.inOut"});
    }, 180000) // 3min cooldown time
}

function power_II() {
    if (alwPower2 && GAME0N && !PAUSED)
    {
        // Play power up sound
        sounder('TuneBox/giga-shot.mp3', 0.9)
        // Switch to overdrive mode for a duration
        removeEventListener('click', _shooter)
        Overdrive()

        setTimeout(() => {
            // Revert back to normal mode after power-up duration
            removeEventListener('mousedown', _mousedown)
            removeEventListener('mousemove', _mousemove)
            removeEventListener('mouseup', _mouseup)
            // Return cursor to Normal aim
            htmlCanvas.style.cursor = "url('VisualVault/aim.png') 30 30, auto"
            Normal()
        }, 20000) // 3min cooldown time

        // Diminish power-up button opacity and set cooldown
        gsap.to(power2, { opacity: 0.5, duration: 0.5 });
        alwPower2 = false
    }

    setTimeout(() => {
        // Reset power-up button opacity and cooldown
        gsap.to(power2, { opacity: 1, duration: 0.5 });
        alwPower2 = true
        sounder('TuneBox/play.mp3')
        // Create the pop in and out animation
        gsap.to(power2, {scale: 1.3, duration: 0.5, yoyo: true, repeat: 5, ease: "power2.inOut"});
    }, 180000) // 3min cooldown time
}

function power_III() {
    if (alwPower3 && GAME0N && !PAUSED)
    {
        // Play power up sound
        sounder('TuneBox/doomswave.mp3')

        // Enlarge player size for a duration and clear targets
        gsap.to(player, {sfrRadius: 1200, duration: 1, ease: "power3.inOut"});
        TARGETS = [];
        setTimeout(() => {
            // Revert player size after power-up duration
            gsap.to(player, {sfrRadius: 100, duration: 2, ease: "power3.inOut"});
        }, 2500);

        // Diminish power-up button opacity and set cooldown
        gsap.to(power3, { opacity: 0.5, duration: 0.5 });
        alwPower3 = false
    }

    setTimeout(() => {
        // Reset power-up button opacity and cooldown
        gsap.to(power3, { opacity: 1, duration: 0.5 });
        alwPower3 = true
        sounder('TuneBox/play.mp3')
        // Create the pop in and out animation
        gsap.to(power3, {scale: 1.3, duration: 0.5, yoyo: true, repeat: 5, ease: "power3.inOut"});
    }, 180000)
}


/// SPAWN Targets \\\
let timer = 0
let spawnTargetsID
let activated2, activated3 = false
function spawnTargets() {
    // SetInterval; spawn targets at intervals
    spawnTargetsID = setInterval(() => {
        if (!PAUSED && GAME0N)
        {
            // Randomize target size and spawn location
            const radius = Math.random() * (50 - 15) + 15
            if (Math.random() < 0.5) {
                // Spawn targets randomly on the width axis
                var x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
                var y = Math.random() * canvas.height
            } else {
                // Spawn targets randomly on the height axis
                var x = Math.random() * canvas.width
                var y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
            }
            /// Target creation
            // Randomize target color and velocity
            const color = `hsl(${Math.random() * 360}, 50%, 50%)`
            const angle = Math.atan2(canvas.height / 2 - y , canvas.width / 2 - x)
            const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            }
            TARGETS.push(new Targets(x, y, color, radius, velocity))

            //~ Unleash The COLOSSAL Target ~\\
            if (SCORE > 50000)
            {
                if (timer >= 40)
                {
                    let radius = 100
                    let x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
                    let y = Math.random() * canvas.height
                    const angle = Math.atan2(canvas.height / 2 - y , canvas.width / 2 - x)
                    const velocity = {
                        x: Math.cos(angle),
                        y: Math.sin(angle)
                    }
                    // Create colossal target after a certain score threshold
                    TARGETS.push(new colossalTargets(x, y, 'white', radius, velocity))
                    timer = 0
                }
                else
                    timer++
            }
            // Activate power-ups based on score thresholds
            if (SCORE >= 20000 && !activated2) {
                alwPower2 = true
                activated2 = true
                sounder('TuneBox/play.mp3')
                gsap.to(power2, { opacity: 1, duration: .5 })
                // Create the pop in and out animation
                gsap.to(power2, {scale: 1.3, duration: 0.5, yoyo: true, repeat: 5, ease: "power2.inOut"})
            }
            if (SCORE >= 45000 && !activated3) {
                alwPower3 = true
                activated3 = true
                sounder('TuneBox/play.mp3')
                gsap.to(power3, { opacity: 1, duration: .5 })
                // Create the pop in and out animation
                gsap.to(power3, {scale: 1.3, duration: 0.5, yoyo: true, repeat: 5, ease: "power3.inOut"})
            }
        }
    }, 1200)
}

//-/ Animation GAME LOOP \-\\
let animeID
function animator() {
    if (!PAUSED)
        animeID = requestAnimationFrame(animator)

    // Clear frame
    // Draw background image
    if (backgroundImage.complete) {
        c.globalAlpha = 0.1; // Lower the opacity
        c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        c.globalAlpha = 1; // Reset the opacity
    }

    // Clear frame
    c.fillStyle = 'rgba(0, 0 , 0 , .01)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    PARTICLES.forEach((particle, Pndx) => {
        if (particle.opacity <= 0) {
            PARTICLES.splice(Pndx, 1)
        } else {
            particle.update()
        }
    })

    // Update and draw darts
    for (let Dndx = DARTS.length - 1; Dndx >= 0; Dndx--) {
        let dart = DARTS[Dndx];
        dart.update()
        // Remove projectiles when out of bounds
        if (dart.x - dart.radius < 0 || dart.x - dart.radius > canvas.width
            || dart.y + dart.radius < 0 || dart.y - dart.radius > canvas.height)
        {
            DARTS.splice(Dndx, 1)
        }
    }

    // Draw player
    player.draw()

    // Update and draw targets
    for (let Tndx = TARGETS.length - 1; Tndx >= 0; Tndx--) {
        let target = TARGETS[Tndx];
        const dist = Math.hypot(player.x - target.x, player.y - target.y)

        // Slow down targets when player is in range
        if (dist - target.radius - player.sfrRadius < 1)
            target.update(3)
        else
            target.update()

        // Check for game over condition: Target reach player
        if (dist - target.radius - player.radius < 1)
            GameOver()

        // Check for collision between darts and targets
        for (let Dndx = DARTS.length - 1; Dndx >= 0; Dndx--) {
            let dart = DARTS[Dndx];
            const dist = Math.hypot(dart.x - target.x, dart.y - target.y)

            if (dist - target.radius - dart.radius < 1)
            {
                // Create particles when dart hits target
                for (let i = 0; i < target.radius; i++)
                {
                    PARTICLES.push(
                        new Particle(dart.x, dart.y, target.color, Math.random() * 2,  {
                            x: (Math.random() - 0.5) * (Math.random() * 8),
                            y: (Math.random() - 0.5) * (Math.random() * 8)
                        })
                    )
                }

                // Adjust score and play sound effects
                if (target.radius - 10 > 10)
                {
                    SCORE += 100
                    score.innerHTML = SCORE
                    // Score pop out & sound effect
                    gsap.to(score, {scale: 1, duration: 0.1})
                    gsap.to(score, {scale: 1.3, duration: 0.1})
                    gsap.to(score, {scale: 1, duration: 0.1, delay: 0.1})

                    gsap.to(target, {
                        radius: target.radius - 10
                    })
                    DARTS.splice(Dndx, 1)

                    sounder('TuneBox/hit.mp3', 0.9 )

                } else {

                    SCORE += 250
                    score.innerHTML = SCORE
                    // Score pop out & sound effect
                    gsap.to(score, {scale: 1, duration: 0.1})
                    gsap.to(score, {scale: 1.5, duration: 0.1})
                    gsap.to(score, {scale: 1, duration: 0.1, delay: 0.1})

                    target.colossal ? sounder('TuneBox/bom.mp3') : sounder('TuneBox/pop.mp3')

                    TARGETS.splice(Tndx, 1)
                    DARTS.splice(Dndx, 1)
                    break
                }
            }
        }
    }
}

//< GAME OVER >\\
function GameOver() {
    GAME0N = false

    music.pause()
    sounder('TuneBox/game.mp3')
    // Cancel Game loop
    cancelAnimationFrame(animeID)

    // Player reached
    gsap.to(player, {color: player.color, onUpdate: () => player.draw()});

    /// Player explode effect
    // create particles
    PARTICLES = []
    for (let i = 0; i < 150; i++) {
        let particle = new Particle(player.x, player.y, 'white', Math.random() * 5,
            {
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8)
            }
        );
        particle.friction = 1.01
        PARTICLES.push(particle)
    }
    // scatter particles
    function animateParticles() {
        requestAnimationFrame(animateParticles);
        PARTICLES.forEach((particle, index) => {
            if (particle.opacity > 0) {
                particle.update();
            } else {
                PARTICLES.splice(index, 1);
            }
        });
    }
    animateParticles()

    // Pause the animation loop and remove event listeners
    removeEventListener('click', _shooter)
    removeEventListener('mouseup', _mouseup)
    removeEventListener('mousedown', _mousedown)
    removeEventListener('mousemove', _mousemove)
    musicControl.removeEventListener('click', _music)
    soundControl.removeEventListener('click', _sound)
    gameControl.removeEventListener('click', _pauser)

    // Display game board
    setTimeout(() => {
        startGameBrd.style.display = 'flex'
        startGameBtm.addEventListener('click', _board)
        scoreBrd.innerHTML = SCORE
    }, 4200)
}


// Get USER ALIAS \\
function setAlias() {
    // Get user input alias and set it
    let inputElement = document.querySelector('#text-box');
    let input = inputElement.value;
    if (input.length > 0) {
        inputElement.setCustomValidity('');
        USERNAME = input;
        pass();
    } else {
        inputElement.setCustomValidity('Please enter a username');
        inputElement.reportValidity();
    }
}
function pass() {
    // Display user alias and hide alias input after 3 seconds
    if (layer3.style.display == 'none')
    {
        let inputElement = document.querySelector('#text-box');
        inputElement.setCustomValidity('');
        alias.innerHTML = USERNAME
        layer6.style.transform = 'translateX(100%)'
        layer5.style.transform = 'translateX(100%)'
        layer4.style.transform = 'translateX(100%)'

        setTimeout(() => {
            layer6.style.display = 'none'
            layer5.style.display = 'none'
            layer4.style.display = 'none'
        }, 1170)
    }
}


///\ LOAD GAME /\\\
let count = 0;
// Event listener for loading the game
inner.addEventListener('click', loader = () => {
    // Remove event listener to ensure only one click is processed
    inner.removeEventListener('click', loader)

    /* Process board smooth appearance */
    percentage.textContent = '0%'

    // Smooth appearance animation of loading elements
    gsap.to(p1, { opacity: 0.5, duration: 1 });
    gsap.to(p2, { opacity: 0.5, duration: 2 });
    gsap.to(p3, { opacity: 0.5, duration: 3 });

    // Start loading animation and transition when loading
    setTimeout(() => {
        /* Percent Loader */
        const id = setInterval(() => {
            if (GAME0N) {
                if (count == 99) {
                    // Load reaches 100%, animate out the loading screen
                    setTimeout(() => {
                        percentage.textContent = '100%'
                        outer.classList.remove('active-loader')
                        outer.classList.add('active-loader2')
                        layer3.style.left = '-100%'
                        layer2.style.left = '-100%'
                        layer1.style.left = '-100%'
                    }, 1000)

                    // Hide loading elements and clear interval
                    setTimeout(() => {
                        layer3.style.display = 'none'
                        layer2.style.display = 'none'
                        layer1.style.display = 'none'
                        clearInterval(id)
                    }, 2500)

                }
                else {
                    count++
                    percentage.textContent = count + '%'
                    outer.classList.add('active-loader')
                }
            }
        }, 75) // Loading speed

         /* Process appear one by one */
        const ls = [p1, p2, p3];
        let i = 1;
        gsap.to(p1, { opacity: 1, scale: '1.5', duration: 0.5 });

        // Sequential animation for loading elements
        const _id = setInterval(() => {
            if (i < ls.length) {
                gsap.to(ls[i], { opacity: 1, scale: '1.5', duration: 0.5 });
                gsap.to(ls[i - 1], { opacity: 0.5, scale: '1', duration: 0.5 });
                i++;
            } else {
                clearInterval(_id);
            }
        }, 2500);
    }, 2000)
})


/// START GAME \\\
// Event listener for starting the game
// Display start game board after animation out
startGameBtm.addEventListener('click', _board = () => {
    // Hide start game board remove event listener
    startGameBrd.style.display = 'none'
    startGameBtm.removeEventListener('click', _board)

    // Main Game Menu Display
    if (innerWidth > 550)
        gsap.to(main, { top: '20px', duration: 1, ease: "main.inOut"})
    else
        gsap.to(main, { top: '90%', duration: 1, ease: "main.inOut"})

    // Game GUID In Out
    if (SCORE == 0) {
        gsap.to(guid, {left: '25px', duration: 1, ease: "guid.in"})
        gsap.to(guid, {left: '-320px', duration: 0.5, delay: 7})
    }

    // Initialize game components and start animations
    init()
    animator()
    chameleon()
    spawnTargets()

    // Play start game sound
    sounder('TuneBox/play.mp3')

    // Play background music and set up game controls
    setTimeout(() => {
        // Background Music
        musiker()
        pausePlay()

        // Drive type \\
        Normal()
        //Overdrive()
    }, 700)
})
