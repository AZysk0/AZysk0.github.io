class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.initialX = x; // Store initial position for resetting
        this.initialY = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.baseSize = size; // Store base size for scaling
        this.maxSize = 10; // Maximum size when interacting with mouse
        this.mouseDistanceThreshold = 50; // Distance threshold for mouse interaction
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update(canvas, ctx, mouseX, mouseY) {
        // Interaction with mouse coordinates
        let distanceX = mouseX - this.x;
        let distanceY = mouseY - this.y;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < this.mouseDistanceThreshold) {
            // Attract particles towards the mouse
            // this.size = Math.min(this.maxSize, this.baseSize + (this.maxSize - this.baseSize) * (1 - distance / this.mouseDistanceThreshold));
            this.directionX = distanceX * 0.005;
            this.directionY = distanceY * 0.005;
        } else {
            // Return particles to their original size and move randomly
            // this.size = this.baseSize;
            // this.directionX = (Math.random() * 0.4) - 0.2;
            // this.directionY = (Math.random() * 0.4) - 0.2;
        }

        // Boundary check to keep particles within canvas
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }

        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw(ctx);
    }

    resetPosition() {
        // Reset particle position
        // this.x = this.initialX;
        // this.y = this.initialY;
    }
}

// Main script
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < 1; i++) {
            let size = (Math.random() * 10) + 1;
            let x = (Math.random() * (canvas.width - size * 2)) + size;
            let y = (Math.random() * (canvas.height - size * 2)) + size;
            let directionX = (Math.random() * 0.2) - 0.1;
            let directionY = (Math.random() * 0.2) - 0.1;
            let color = '#000000';
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate(mouseX, mouseY) {
        requestAnimationFrame(() => animate(mouseX, mouseY)); // Recursive call for animation loop
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update(canvas, ctx, mouseX, mouseY); // Pass canvas and ctx to update method
        }
    }

    // Mouse move event listener to update mouse coordinates
    canvas.addEventListener('mousemove', (event) => {
        animate(event.clientX, event.clientY); // Update particles based on mouse position
    });

    // Resize event listener to update canvas dimensions
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles(); // Reinitialize particles on resize
    });

    // Initialize default animation
    if (particlesArray.length === 0) {
        initParticles();
    }
    animate();
});
