// Select all canvas elements from html
const canvas = document.querySelector('canvas')

// Returns an object that provides methods and properties for drawing
// and manipulating images and graphics on a canvas element
const c = canvas.getContext('2d')

// Set the width & height to fill the screen
canvas.width = innerWidth
canvas.height = innerHeight

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
const player = new Player(innerWidth / 2, innerHeight / 2, 'royalblue', 50)


/// Projectiles list
const DARTS = []
/// Enemies list
const TARGETS = []
///
const PARTICLES = []

//['#8f83d8', '#d69cbc', '#51074a', '#56bf52', '#437a37',
//'#b9cefb', '#660000', '#e7c459', '#371f30', '#fff49f',
//'#d89eff', '#fff49f', '#2d2c4e', '#ff8c8c', '#dc143c']

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
    }, 1500)
}


let animeID
speed = 1
/// Animation loop
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

        const dist = Math.hypot(player.x - target.x, player.y - target.y)
        if (dist - target.radius - player.radius < 1)
        {
            cancelAnimationFrame(animeID)
            alert('Game Over')
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
                    // Green Sock Animation
                    gsap.to(target, {
                        radius: target.radius - 10
                    })
                    setTimeout(() => {
                        DARTS.splice(Dndx, 1)
                    }, 0)
                } else {
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
        'red',
        5,
        velocity
    ))
})



animator()
spawnTargets()
