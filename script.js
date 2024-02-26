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
const save_btn = document.querySelector('#save-btn')
const alias = document.querySelector('.alias')

const power1 = document.querySelector('#power1')
const power2 = document.querySelector('#power2')
const power3 = document.querySelector('#power3')


//|\\ CLASS declarations //|\\
/// Player class [User Base Character]
class Player {
    constructor(x, y, color, radius){
        // set player attributes
        this.x = x
        this.y = y
        this.color = color
        this.radius = radius
        this.sfrRadius = 0
    }
    draw() {
        c.beginPath()
        // create the player object (circle)
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // draw player in color
        c.fillStyle = this.color
        c.fill()

        c.beginPath();
        // Outer circle
        c.arc(this.x, this.y, this.sfrRadius, 0, Math.PI * 2, false)
        c.lineWidth = 4
        c.strokeStyle = this.color
        c.stroke()
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
    update(div=1) {
        // Update Projectile position by velocity
        this.draw()
        this.x += this.vel.x / div
        this.y += this.vel.y / div
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
    music.src = `TuneBox/m${rm}.mp3`
    music.loop = true
    music.volume = 0.9
    music.play()
    musicOn = true
    musicControl.style.backgroundImage = 'url(VisualVault/mm.png)'

    // Play or Pause music on music button click
    musicControl.addEventListener('click', _music = () => {
        if (musicOn)
        {
            music.pause()
            musicControl.style.backgroundImage = 'var(--music-off-logo)'
        } else {
            music.play()
            musicControl.style.backgroundImage = 'url(VisualVault/mm.png)'
        }
        musicOn = !musicOn
    })

    // Play or Pause music on music button click
    soundControl.addEventListener('click', _sound = () => {
        if (soundOn)
        {
            soundControl.style.backgroundImage = 'var(--sound-off-logo)'
        } else {
            soundControl.style.backgroundImage = 'url(VisualVault/nn.png)'
        }
        soundOn = !soundOn
    })
}


/// player var
let player
/// player Username
let USERNAME = 'Player'
/// Is the Game On?
let GAME0N = true
/// player score
let SCORE = 0
/// Projectiles list
let DARTS = []
/// Enemies list
let TARGETS = []
/// Particles list
let PARTICLES = []
/// Power UPs Allow
let alwPower1 = true
let alwPower2 = false
let alwPower3 = false
/// intervals list
let intervalIDs = []
/// Event Listener function vars
let _music
let _sound
let _pauser
let _shooter
let _mousedown
let _mousemove
let _mouseup


/// RESTART GAME
function init()
{   
    // clear and set canvas size
    canvas.width = innerWidth
    canvas.height = innerHeight
    c.clearRect(0, 0, canvas.width, canvas.height)

    /// player creation
    GAME0N = true
    player = new Player(innerWidth / 2, innerHeight / 2, 'crimson', 40)

    /// Projectiles list
    DARTS = []
    /// Enemies list
    TARGETS = []
    /// Dart and Target collision affect
    PARTICLES = []
    /// Power UPs Allow
    alwPower1 = true
    alwPower2 = false
    alwPower3 = false
    activated2, activated3 = false
    power1.style.opacity = 1
    power2.style.opacity = 0.5
    power3.style.opacity = 0.5

    //\\ This line was added due to Canvas having replay performance issues
    //if (!GAME0N) location.reload()

    // Clear all setTimeout calls
    let timeoutID = setTimeout(() => {});
    while (timeoutID--) {
        clearTimeout(timeoutID);
    }

    // Clear all setInterval calls
    let intervalID = setInterval(() => {}, 0);
    while (intervalID--) {
        clearInterval(intervalID);
    }

    // Iterate over the array of interval IDs and clear each interval
    intervalIDs.forEach(intervalID => clearInterval(intervalID));
    // Clear the array
    intervalIDs = [];

    // reset score
    SCORE = 0
    score.innerHTML = SCORE
    scoreBrd.innerHTML = SCORE
}

/// SPAWN Targets
let timer = 0
let spawnTargetsID
let activated2, activated3 = false
function spawnTargets() {
    // SetInterval; make a call each 1500 millisecond
    spawnTargetsID = setInterval(() => {
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
            } else if (SCORE >= 2000 && !activated2) {
                // Power UP 1 & 2 release
                alwPower2 = true
                activated2 = true
                gsap.to(power2, { opacity: 1, duration: .5 });
                console.log('on1');
            } else if (SCORE >= 4000 && !activated3) {
                alwPower3 = true
                activated3 = true
                gsap.to(power3, { opacity: 1, duration: .5 });
                console.log('on2');
            }
        }
    }, 1200)
    // save interval id for later clear
    intervalIDs.push(spawnTargetsID)
}

/// Chameleon MODE; Make player change colors like a chameleon
function chameleon() {
    let n = 0
    // go trough the color wheel
    const id = setInterval(() => {
        if (!PAUSED && GAME0N)
        {
            // Green Sock Animation
            gsap.to(player, {
                color: `hsl(${n}, 58%, 55%)`
            })
            n += 2
        }
    }, 1000)
    // save interval id
    intervalIDs.push(id)

    // set up player sphere
    gsap.to(player, { sfrRadius: 100 })

}


//-/ Animation GAME LOOP \-\\
let animeID
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
        // Particle clear
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
        const dist = Math.hypot(player.x - target.x, player.y - target.y)

        //\ SPHERE Activation; slow down when in range /\\
        if (dist - target.radius - player.sfrRadius < 1)
            target.update(3)
        else
            target.update()

        //| GAME OVER |\\
        if (dist - target.radius - player.radius < 1)
        {
            GAME0N = false
            music.pause()
            sounder('TuneBox/game.mp3')

            // Pause The Animation loop
            cancelAnimationFrame(animeID)
            // Kill all working Event Listeners
            removeEventListener('click', _shooter)
            removeEventListener('mousedown', _mousedown)
            removeEventListener('mousemove', _mousemove)
            removeEventListener('mouseup', _mouseup)
            musicControl.removeEventListener('click', _music)
            soundControl.removeEventListener('click', _sound)
            gameControl.removeEventListener('click', _pauser)
            // display the Game Board
            startGameBrd.style.display = 'flex'
            scoreBrd.innerHTML = SCORE

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
                    sounder('TuneBox/hit.mp3', 0.9 )

                } else {

                    SCORE += 250
                    score.innerHTML = SCORE

                    // Enemy destruction sound affect
                    TARGETS[Tndx].colossal ? sounder('TuneBox/bom.mp3') : sounder('TuneBox/pop.mp3')

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
let dSize = 5
function Normal() {
    // listen for mouse clicks
    // event contains mouse click information
    addEventListener('click', _shooter = (event) => {
        // Get the angle of the projectile
        if (!PAUSED)
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
                dSize,
                velocity
            ))

            sounder('TuneBox/shot.mp3', 0.6)
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
            player.color,
            5,
            velocity
        ))
    }
    //const createProjectileThrottled = _.throttle(createProjectile, 100)
    // Listen for mouse down event
    addEventListener('mousedown', _mousedown = (event) => {
        isMouseDown = true
        createProjectile(event)
    })
    // Listen for mouse move event
    addEventListener('mousemove', _mousemove = (event) => {
        createProjectile(event)
    })
    // Listen for mouse up event
    addEventListener('mouseup', _mouseup = () => {
        isMouseDown = false
    })
}


// Game PAUSING ||<| \\
let PAUSED = false
function pausePlay() {
    // Toggle the PAUSED flag when the sound control button is clicked
    gameControl.addEventListener('click', _pauser = () => {
        if (GAME0N)
        {
            PAUSED = !PAUSED
            if (PAUSED) {
                // If paused, cancel the animation frame
                cancelAnimationFrame(animeID)
                gameControl.style.backgroundImage = 'url(VisualVault/playn.png)'
            } else {
                // If unpaused, resume animation
                animeID = requestAnimationFrame(animator)
                gameControl.style.backgroundImage = 'url(VisualVault/pausen.png)'
            }
        }
    })
}


///\ LOAD GAME /\\\
let count = 0;
inner.addEventListener('click', loader = () => {
    // remove Event Listener (one click is needed)
    inner.removeEventListener('click', loader)

    /* Process board smooth appearance */
    percentage.textContent = '0%'
    setTimeout(() => {
        gsap.to(p1, { opacity: 0.5, duration: 1 });
        gsap.to(p2, { opacity: 0.5, duration: 2 });
        gsap.to(p3, { opacity: 0.5, duration: 3 });
    }, 1000)

    setTimeout(() => {
        /* Percent Loader */
        const id = setInterval(() => {
            if (GAME0N) {
                if (count == 99) {
                    // load to 100% and animate load screen out
                    setTimeout(() => {
                        percentage.textContent = '100%'
                        outer.classList.remove('active-loader')
                        outer.classList.add('active-loader2')
                        layer3.style.left = '-100%'
                        layer2.style.left = '-100%'
                        layer1.style.left = '-100%'
                    }, 1000)

                    // clear load screen and Interval
                    setTimeout(() => {
                        layer3.style.display = 'none'
                        layer2.style.display = 'none'
                        layer1.style.display = 'none'
                        clearInterval(id)
                    }, 3000)

                }
                else {
                    count++
                    percentage.textContent = count + '%'
                    outer.classList.add('active-loader')
                }
            }
        }, 5) // < Loading speed

         /* Process appear one by one */
        const ls = [p1, p2, p3];
        let i = 1;
        gsap.to(p1, { opacity: 1, scale: '1.5', duration: 0.5 });
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


function setAlias() {
    let input = document.querySelector('#text-box').value;
    if (input.length > 0) {
        USERNAME = input
        pass()
    }
}

function pass() {
    alias.innerHTML = USERNAME
    layer6.style.left = '100%'
    layer5.style.left = '100%'
    layer4.style.left = '100%'

    setTimeout(() => {
        layer6.style.display = 'none'
        layer5.style.display = 'none'
        layer4.style.display = 'none'
    }, 3000)
}


function power_I() {
    if (alwPower1) 
    {
        // Pause Target creation
        clearInterval(spawnTargetsID)

        gsap.to(player, {sfrRadius: 800, duration: 3, ease: "power1.inOut"});
        setTimeout(() => {
            // Resume Target attacks
            spawnTargets()
            gsap.to(player, {sfrRadius: 100, duration: 3, ease: "power1.inOut"});
        }, 20000)


        gsap.to(power1, { opacity: 0.5, duration: 0.5 });
        alwPower1 = false
    }

    setTimeout(() => {
        gsap.to(power1, { opacity: 1, duration: 0.5 });
        alwPower1 = true
    }, 100000)
} 

function power_II() {
    if (alwPower2) 
    {
        removeEventListener('click', _shooter)
        Overdrive()

        setTimeout(() => {
            removeEventListener('mousedown', _mousedown)
            removeEventListener('mousemove', _mousemove)
            removeEventListener('mouseup', _mouseup)
            Normal()
        }, 20000)

        gsap.to(power2, { opacity: 0.5, duration: 0.5 });
        alwPower2 = false
    }

    setTimeout(() => {
        gsap.to(power2, { opacity: 1, duration: 0.5 });
        alwPower2 = true
    }, 100000)
} 

function power_III() {
    if (alwPower3) 
    {
        gsap.to(player, {sfrRadius: 1200, duration: 1, ease: "power1.inOut"});
        TARGETS = [];
        setTimeout(() => {
            gsap.to(player, {sfrRadius: 100, duration: 2, ease: "power1.inOut"});
        }, 2500);

        gsap.to(power3, { opacity: 0.5, duration: 0.5 });
        alwPower3 = false
    }

    setTimeout(() => {
        gsap.to(power3, { opacity: 1, duration: 0.5 });
        alwPower3 = true
    }, 100000)

}


/// START GAME \\\
startGameBtm.addEventListener('click', () => {
    startGameBrd.style.display = 'none'
    init()
    animator()
    chameleon()
    spawnTargets()

    sounder('TuneBox/play.mp3')


    // play background music
    setTimeout(() => {
        // Background Music
        musiker()
        pausePlay()

        // Drive type \\
        Normal()
        //Overdrive()
    }, 700)
})
