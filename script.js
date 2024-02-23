// Select canvas elements from html
const canvas = document.querySelector('canvas')

/* Returns an object that provides methods and properties for drawing
 *   and manipulating images and graphics on a canvas element
 */
const c = canvas.getContext('2d')
// Set the width & height to fill the screen
canvas.width = innerWidth
canvas.height = innerHeight


//| QUERY Selection |\\
const score = document.querySelector('#score')
const scoreBrd = document.querySelector('#scoreBrd')
const startGameBtm = document.querySelector('#startGameBtm')
const startGameBrd = document.querySelector('#startGameBrd')

const musicControl = document.querySelector('#musicControl')
const soundControl = document.querySelector('#soundControl')
const gameControl = document.querySelector('#gameControl')


//|\\ CLASS declarations //|\\
/// Player class [User Base Character]
class Player {
    constructor(x, y, color, radius){
        // set player attributes
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
    }
    draw() {
        c.beginPath()
        // create the player object (circle)
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // draw player in color
        c.fillStyle = this.color
        c.fill()
    }
}

/// Dart class [Projectiles]
class Dart {
    constructor(x, y, color, radius, velocity){
        // set player attributes
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
        this.vel = velocity
    }
    draw() {
        c.beginPath()
        // create the player object (circle)
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, {x:this.vel.x, y:this.vel.y})
        // draw player in color
        c.fillStyle = this.color
        c.fill()
    }
    update () {
        // Update Projectile position by velocity
        // To add speed to Darts, multiply the velocity
        this.draw()
        this.x += this.vel.x * 7
        this.y += this.vel.y * 7
    }
}

/// Targets class [Enemies]
class Targets {
    constructor(x, y, color, radius, velocity){
        // set player attributes
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
        this.vel = velocity
    }
    draw() {
        c.beginPath()
        // create the player object (circle)
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, {x:this.vel.x, y:this.vel.y})
        // draw player in color
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        // Update Projectile position by velocity
        this.draw()
        this.x += this.vel.x
        this.y += this.vel.y
    }
}

// Super Targets [Boss Enemies]
class colossalTargets extends Targets {
    constructor(x, y, color, radius, velocity) {
        super(x, y, color, radius, velocity)
        this.colossal = true
    }

    update() {
        // Update Projectile position by velocity
        this.draw()
        this.x += this.vel.x / 2
        this.y += this.vel.y / 2
    }
}


/// Targets class [Enemies]
const friction = 0.99
class Particle {
    constructor(x, y, color, radius, velocity){
        // set player attributes
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
        this.vel = velocity
        this.opacity = 1
    }
    draw() {

        c.save()
        // set opacity
        c.globalAlpha = this.opacity
        c.beginPath()
        // create the player object (circle)
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, {x:this.vel.x, y:this.vel.y})
        // draw player in color
        c.fillStyle = this.color
        c.fill()

        c.restore()
    }
    update () {
        // Update Projectile position by velocity
        this.draw()
        this.vel.x *= friction
        this.vel.y *= friction
        this.x += this.vel.x
        this.y += this.vel.y
        this.opacity -= 0.01
    }
}


//\ AUDIO Settings /\\

// Sound player \\
function sounder(path, vol=1)
{
    if (soundOn)
    {
        const player = new Audio
        player.src = path
        player.volume = vol
        player.play()
    }
}

/// AUDIO player \\\
let music
let soundOn = true
let musicOn = true
function musiker()
{
    // Play random background music
    music = new Audio
    rm = Math.floor(Math.random() * 8.99)
    music.src = `music/m${rm}.mp3`
    music.loop = true
    music.volume = 0.9
    music.play()

    // Play or Pause music on music button click
    musicControl.addEventListener('click', () => {
        if (musicOn)
        {
            music.pause()
            musicControl.style.backgroundImage = 'url(ico/mmb.png)'
        } else {
            music.play()
            musicControl.style.backgroundImage = 'url(ico/mm.png)'
        }
        musicOn = !musicOn
    })

    // Play or Pause music on music button click
    soundControl.addEventListener('click', () => {
        if (soundOn)
        {
            soundControl.style.backgroundImage = 'url(ico/nnn.png)'
        } else {
            soundControl.style.backgroundImage = 'url(ico/nn.png)'
        }
        soundOn = !soundOn
    })
}


/// player creation
let player = new Player(innerWidth / 2, innerHeight / 2, 'royalblue', 50)

///
let GAME0N = false
/// Projectiles list
let DARTS = []
/// Enemies list
let TARGETS = []
/// Particles list
let PARTICLES = []

//['#8f83d8', '#d69cbc', '#51074a', '#56bf52', '#437a37',
//'#b9cefb', '#660000', '#e7c459', '#371f30', '#fff49f',
//'#d89eff', '#fff49f', '#2d2c4e', '#ff8c8c', '#dc143c']

/// RESTART GAME
function init()
{
    GAME0N = true
    c.clearRect(0, 0, canvas.width, canvas.height)

    /// player creation
    player = new Player(innerWidth / 2, innerHeight / 2, 'royalblue', 50)

    /// Projectiles list
    DARTS = []
    /// Enemies list
    TARGETS = []
    /// Dart and Target collision affect
    PARTICLES = []

    //\\ This line was added due to Canvas having replay performance issues
    if (SCORE > 0) location.reload()

    // reset score
    SCORE = 0
    score.innerHTML = SCORE
    scoreBrd.innerHTML = SCORE
}

/// SPAWN Targets
let timer = 0
function spawnTargets() {
    // make a call each 1500 millisecond
    setInterval(() => {
        if (!PAUSED && GAME0N)
        {
            //# Random Target size
            const radius = Math.random() * (50 - 15) + 15
            //# Random Target Spawn #\\
            if (Math.random() < 0.5) {
                // Out of screen Width, random height
                var x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
                var y = Math.random() * canvas.height
            } else {
                // Out of screen Height, random width
                var x = Math.random() * canvas.width
                var y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
            }
            /// Target creation
            // random Target color pick
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
                    TARGETS.push(new colossalTargets(x, y, 'white', radius, velocity))
                    timer = 0
                }
                else
                    timer++
            }

        }
    }, 1400)
}

/// Player Chameleon Mode
function col() {
    // Green Sock Animation
    let n = 0
    setInterval(() => {
        if (!PAUSED && GAME0N)
        {
            gsap.to(player, {
                color: `hsl(${n}, 55%, 55%)`
            })
            n += 2
        }
    }, 1000)
}

//-/ Animation GAME LOOP \-\\
let animeID
let SCORE = 0
function animator() {
    if (!PAUSED)
        animeID = requestAnimationFrame(animator)

    // Clear Frame
    c.fillStyle = 'rgba(0, 0 , 0 , .1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Draw player
    player.draw()

    // Draw Particles
    PARTICLES.forEach((particle, Pndx) => {
        // Particle disappear
        if (particle.opacity <= 0) {
            PARTICLES.splice(Pndx, 1)
        } else {
            particle.update()
        }
    })
    // Draw and update each dart in the dart list
    DARTS.forEach((dart, Dndx) => {
        dart.update()
        // Remove projectiles when out of bound (out the x and y axis)
        if (dart.x - dart.radius < 0 || dart.x - dart.radius > canvas.width
            || dart.y + dart.radius < 0 || dart.y - dart.radius > canvas.height)
        {
            // setTimeout waits until the next frame to perform changes
            setTimeout(() => {
                DARTS.splice(Dndx, 1)
            }, 0)
        }
    })
    // Draw and update each Targets in the Targets list
    TARGETS.forEach((target, Tndx) => {
        target.update()

        //| GAME OVER |\\
        const dist = Math.hypot(player.x - target.x, player.y - target.y)
        if (dist - target.radius - player.radius < 1)
        {
            music.pause()
            sounder('music/game.mp3')
            cancelAnimationFrame(animeID)
            startGameBrd.style.display = 'flex'
            scoreBrd.innerHTML = SCORE
            GAME0N = false

        }
        // Compare distances, check is objects touch
        DARTS.forEach((dart, Dndx) => {
            const dist = Math.hypot(dart.x - target.x, dart.y - target.y)

            // When Projectile touch Target
            if (dist - target.radius - dart.radius < 1)
            {
                // THE BIG BANG
                for (let i = 0; i < target.radius; i++)
                {
                    PARTICLES.push(
                        new Particle(dart.x, dart.y, target.color, Math.random() * 2,  {
                            x: (Math.random() - 0.5) * (Math.random() * 8),
                            y: (Math.random() - 0.5) * (Math.random() * 8)
                        })
                    )
                }

                // When Projectile touch Target (shrink of remove)
                if (target.radius - 10 > 10)
                {
                    SCORE += 100
                    score.innerHTML = SCORE
                    let volume = 0.01 * target.radius + 0.5

                    // Green Sock Animation
                    gsap.to(target, {
                        radius: target.radius - 10
                    })
                    setTimeout(() => {
                        DARTS.splice(Dndx, 1)
                    }, 0)

                    // Enemy damage sound affect
                    sounder('music/hit.mp3', 0.9 )

                } else {

                    SCORE += 250
                    score.innerHTML = SCORE

                    // Enemy destruction sound affect
                    TARGETS[Tndx].colossal ? sounder('music/bom.mp3') : sounder('music/pop.mp3')

                    // setTimeout waits until the next frame to perform changes
                    // Enemy explode sound affect
                    setTimeout(() => {
                        TARGETS.splice(Tndx, 1)
                        DARTS.splice(Dndx, 1)
                    }, 0)


                }


            }
        })
    })
}




/// InGame Click Management \\\

/// NORMAL MODE: In this mode, Projectiles are shot for each mouse click
// listen for mouse clicks
function Normal() {
    // listen for mouse clicks
    // event contains mouse click information
    addEventListener('click', (event) => {
        // Get the angle of the projectile
        if (!PAUSED && GAME0N)
        {
            const angle = Math.atan2(event.clientY - canvas.height / 2 , event.clientX - canvas.width / 2)
            const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        // Projectile creation (on click)
        DARTS.push(new Dart(
            canvas.width / 2,
            canvas.height / 2,
            'white',
            5,
            velocity
            ))

            sounder('music/shot.mp3', 0.6)
        }
    })
}

/// OVERDRIVE MODE: In this mode, Projectiles are shot as long as the mouse click is down
// listen for mouse down
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

        // Projectile creation
        DARTS.push(new Dart(
            canvas.width / 2,
            canvas.height / 2,
            'red',
            5,
            velocity
        ))
    }

    //const createProjectileThrottled = _.throttle(createProjectile, 100)

    // Listen for mouse down event
    addEventListener('mousedown', (event) => {
        isMouseDown = true
        createProjectile(event)
    })

    // Listen for mouse move event
    addEventListener('mousemove', (event) => {
        createProjectile(event)
    })
    // Listen for mouse up event
    addEventListener('mouseup', () => {
        isMouseDown = false
    })
}


// Game PAUSING ||<| \\
let PAUSED = false
function pausePlay() {
    // Toggle the PAUSED flag when the sound control button is clicked
    gameControl.addEventListener('click', () => {
        if (GAME0N)
        {
            PAUSED = !PAUSED
            if (PAUSED) {
                // If paused, cancel the animation frame
                cancelAnimationFrame(animeID)
                gameControl.style.backgroundImage = 'url(ico/playn.png)'
            } else {
                // If unpaused, resume animation
                animeID = requestAnimationFrame(animator)
                gameControl.style.backgroundImage = 'url(ico/pausen.png)'
            }
        }
    })
}

/// START GAME \\\
startGameBtm.addEventListener('click', () => {
    startGameBrd.style.display = 'none'
    init()
    animator()
    spawnTargets()

    sounder('music/play.mp3')


    // play background music
    setTimeout(() => {
        // Background Music
        musiker()
        pausePlay()
        col()
        // Drive type
        Normal()
        //Overdrive()
    }, 700)
})
