// Select all canvas elements from html
const canvas = document.querySelector('canvas')

// Returns an object that provides methods and properties for drawing
// and manipulating images and graphics on a canvas element
const c = canvas.getContext('2d')

// Set the width & height to fill the screen
canvas.width = innerWidth
canvas.height = innerHeight

const score = document.querySelector('#score')
const scoreBrd = document.querySelector('#scoreBrd')
const startGameBtm = document.querySelector('#startGameBtm')
const startGameBrd = document.querySelector('#startGameBrd')

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
    update () {
        // Update Projectile position by velocity
        this.draw()
        this.x += this.vel.x
        this.y += this.vel.y
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


/// player creation
let player = new Player(innerWidth / 2, innerHeight / 2, 'royalblue', 50)

/// Projectiles list
let DARTS = []
/// Enemies list
let TARGETS = []
///
let PARTICLES = []

//['#8f83d8', '#d69cbc', '#51074a', '#56bf52', '#437a37',
//'#b9cefb', '#660000', '#e7c459', '#371f30', '#fff49f',
//'#d89eff', '#fff49f', '#2d2c4e', '#ff8c8c', '#dc143c']

// RESTART GAME
function init()
{   
    // Select all canvas elements from html
    const canvas = document.querySelector('canvas')

    // Returns an object that provides methods and properties for drawing
    // and manipulating images and graphics on a canvas element
    const c = canvas.getContext('2d')

    // Set the width & height to fill the screen
    canvas.width = innerWidth
    canvas.height = innerHeight
    /// player creation
    player = new Player(innerWidth / 2, innerHeight / 2, 'royalblue', 50)
    /// Projectiles list
    DARTS = []
    /// Enemies list
    TARGETS = []
    /// Dart and Target collision affect
    PARTICLES = []
    // reset score
    SCORE = 0
    score.innerHTML = SCORE
    scoreBrd.innerHTML = SCORE
}

// Spawn Targets
function spawnTargets() {
    // make a call each 1500 millisecond
    setInterval(() => {
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
    }, 1400)
}


let animeID
let SCORE = 0

/// Animation GAME LOOP \\\
function animator() {
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

        // GAME OVER
        const dist = Math.hypot(player.x - target.x, player.y - target.y)
        if (dist - target.radius - player.radius < 1)
        {
            cancelAnimationFrame(animeID)
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
                for (let i = 0; i < target.radius * 2; i++)
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

                    // Green Sock Animation
                    gsap.to(target, {
                        radius: target.radius - 10
                    })
                    setTimeout(() => {
                        DARTS.splice(Dndx, 1)
                    }, 0)
                } else {

                    SCORE += 250
                    score.innerHTML = SCORE
                    // setTimeout waits until the next frame to perform changes
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
    })
}

/// OVERDRIVE MODE: WIn this mode, Projectiles are shot as long as the mouse click is down
// listen for mouse down
function Overdrive()
{
    let isMouseDown = false

    // Function to create a projectile
    function createProjectile(event) {
        const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };

        // Projectile creation
        DARTS.push(new Dart(
            canvas.width / 2,
            canvas.height / 2,
            'red',
            5,
            velocity
        ));
    }

    //const createProjectileThrottled = _.throttle(createProjectile, 100);

    // Listen for mouse down event
    addEventListener('mousedown', (event) => {
        isMouseDown = true;
        createProjectile(event);
    });
    
    // Listen for mouse move event
    addEventListener('mousemove', (event) => {
        createProjectile(event);
    });
    // Listen for mouse up event
    addEventListener('mouseup', () => {
        isMouseDown = false;
    });
}



/// START GAME \\\
startGameBtm.addEventListener('click', () => {
    startGameBrd.style.display = 'none'
    init()
    animator()
    spawnTargets()

    // Drive type
    Normal()
    //Overdrive()
})
