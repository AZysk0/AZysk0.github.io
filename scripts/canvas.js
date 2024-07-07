// Initialize Matter.js
const { Engine, Render, World, Bodies } = Matter;

// Create an engine
const engine = Engine.create();

// Create a renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight * 2,
        background: '#f0f0f0', // Background color
        wireframes: false // Disable wireframes for better visualization
    }
});

// Create bodies (particles)
const particleCount = 50;
const particles = [];

for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 20 + 10; // Random radius between 10 and 30
    const x = Math.random() * render.options.width;
    const y = Math.random() * render.options.height * 0.5; // Start particles above the screen

    const particle = Bodies.circle(x, y, radius, {
        friction: 0.5, // Friction to simulate air resistance
        restitution: 0.8, // Bounciness (elasticity)
        density: 0.1, // Density of the material
    });

    particles.push(particle);
}

// Add all particles to the world
World.add(engine.world, particles);

// Add ground
const ground = Bodies.rectangle(0, render.options.height, render.options.width * 2, render.options.height + 100, {
    isStatic: true, // Make it a static body (not affected by forces)
});
World.add(engine.world, ground);

// Create mouse constraint
const mouse = Matter.Mouse.create(render.canvas);
const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

// Add mouse constraint to the world
World.add(engine.world, mouseConstraint);


// Run the engine
// Engine.run(engine);
Matter.Runner.run(engine)

// Run the renderer
Render.run(render);

// Function to update particle position when grabbed by mouse
function updateParticlePosition(particle, mouseX, mouseY) {
    Body.setPosition(particle, { x: mouseX, y: mouseY });
}

// Event listener to update particle position when mouse is moved
document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Check if mouse constraint is active (a particle is grabbed)
    if (mouseConstraint.constraint.body) {
        const grabbedParticle = mouseConstraint.constraint.body;
        updateParticlePosition(grabbedParticle, mouseX, mouseY);
    }
});
