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


const player = new Player(innerWidth / 2, innerHeight / 2, 'royalblue', 50)


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
}


animator()
