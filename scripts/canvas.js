// Falling balls behind the hero section (Matter.js)
(() => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || !window.Matter) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { Engine, Render, Runner, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter;

    const hero = canvas.parentElement;
    const styles = getComputedStyle(document.documentElement);
    const colors = ['--ball-1', '--ball-2', '--ball-3'].map((name) => styles.getPropertyValue(name).trim());

    // Matter's mouse reads an integer pixel ratio, so keep ours integer too
    const pixelRatio = Math.min(2, Math.max(1, Math.round(window.devicePixelRatio || 1)));

    const engine = Engine.create();
    const render = Render.create({
        canvas,
        engine,
        options: {
            width: hero.clientWidth,
            height: hero.clientHeight,
            pixelRatio,
            background: 'transparent',
            wireframes: false,
        },
    });

    // Invisible ground and side walls just outside the visible area
    const WALL = 100;
    let walls = [];

    function buildWalls(width, height) {
        Composite.remove(engine.world, walls);
        const options = { isStatic: true, render: { visible: false } };
        walls = [
            Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, options),
            Bodies.rectangle(-WALL / 2, height / 2 - height, WALL, height * 4, options),
            Bodies.rectangle(width + WALL / 2, height / 2 - height, WALL, height * 4, options),
        ];
        Composite.add(engine.world, walls);
    }

    // Balls start above the hero and rain down into it
    const width = render.options.width;
    const height = render.options.height;
    const ballCount = Math.min(50, Math.round(width / 25));
    const balls = [];

    for (let i = 0; i < ballCount; i++) {
        const radius = Math.random() * 20 + 10;
        balls.push(Bodies.circle(
            radius + Math.random() * (width - radius * 2),
            -Math.random() * height * 1.5 - radius,
            radius,
            {
                restitution: 0.8,
                friction: 0.1,
                render: { fillStyle: colors[i % colors.length] },
            },
        ));
    }

    buildWalls(width, height);
    Composite.add(engine.world, balls);

    // Drag balls with the mouse, without hijacking page scrolling
    const mouse = Mouse.create(canvas);
    for (const event of ['mousewheel', 'DOMMouseScroll', 'wheel']) {
        canvas.removeEventListener(event, mouse.mousewheel);
    }
    canvas.removeEventListener('touchstart', mouse.mousedown);
    canvas.removeEventListener('touchmove', mouse.mousemove);
    canvas.removeEventListener('touchend', mouse.mouseup);

    Composite.add(engine.world, MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
    }));
    render.mouse = mouse;

    // Keep the scene sized to the hero
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newWidth = hero.clientWidth;
            const newHeight = hero.clientHeight;
            render.options.width = newWidth;
            render.options.height = newHeight;
            Render.setPixelRatio(render, pixelRatio);
            buildWalls(newWidth, newHeight);
            for (const ball of balls) {
                if (ball.position.x > newWidth || ball.position.y > newHeight) {
                    Body.setPosition(ball, { x: Math.random() * newWidth, y: -50 });
                    Body.setVelocity(ball, { x: 0, y: 0 });
                }
            }
        }, 150);
    });

    Runner.run(Runner.create(), engine);
    Render.run(render);
})();
