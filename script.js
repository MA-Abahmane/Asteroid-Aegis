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
        // draw the player (circle)
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


const player = new Player(innerWidth / 2, innerHeight / 2, 'royalblue', 50)

const DARTS = []


let animeID
speed = 1
function animator() {
    // animation loop
    animeID = requestAnimationFrame(animator)
    // Clear Frame
    c.fillStyle = 'rgba(0, 0 , 0 , .1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    // Draw player
    player.draw()

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
