
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


// ============================================================
// UKURAN LAYAR
// ============================================================

let width = window.innerWidth;
let height = window.innerHeight;

let dpr = Math.min(window.devicePixelRatio || 1, 2);

function resizeCanvas() {

    width = window.innerWidth;
    height = window.innerHeight;

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    center.x = width / 2;
    center.y = height / 2;

    createHeart();
    createWawa();

    if (currentText !== "") {
        createTextTargets(currentText);
    }
}


// ============================================================
// PENGATURAN
// ============================================================

const isMobile = window.innerWidth <= 600;

const PARTICLE_COUNT = isMobile ? 2200 : 4500;

const particles = [];

const center = {
    x: width / 2,
    y: height / 2
};


// ============================================================
// TIMELINE
// ============================================================

const TIME_HEY = 3;
const TIME_IYAA = 9;
const TIME_JANGAN = 16;
const TIME_HEART = 20;
const TIME_ROTATE = 23;


// ============================================================
// TARGET
// ============================================================

let textTargets = [];
let currentText = "";

let heartPoints = [];
let wawaPoints = [];


// ============================================================
// MEMBUAT PARTIKEL
// ============================================================

for (let i = 0; i < PARTICLE_COUNT; i++) {

    const angle =
        Math.random() * Math.PI * 2;

    const radius =
        Math.random() *
        Math.min(width, height) *
        0.48;

    particles.push({

        angle: angle,

        radius: radius,

        speed:
            0.0015 +
            Math.random() * 0.004,

        size:
            Math.random() *
            (isMobile ? 1.5 : 1.8) +
            0.4,

        alpha:
            Math.random() *
            0.75 +
            0.25,

        x: center.x,
        y: center.y,

        targetX: center.x,
        targetY: center.y
    });
}


// ============================================================
// MEMBUAT TARGET TEKS
// ============================================================

function createTextTargets(text) {

    currentText = text;

    const offscreen =
        document.createElement("canvas");

    offscreen.width = width;
    offscreen.height = height;

    const offCtx =
        offscreen.getContext("2d");

    offCtx.clearRect(
        0,
        0,
        width,
        height
    );


    let fontSize;


    if (isMobile) {

        fontSize =
            Math.min(
                width * 0.15,
                65
            );

    } else {

        fontSize =
            Math.min(
                width * 0.11,
                125
            );
    }


    if (text.length > 20) {

        fontSize =
            Math.min(
                width *
                (isMobile ? 0.075 : 0.065),
                isMobile ? 38 : 75
            );
    }


    offCtx.font =
        `bold ${fontSize}px Arial`;

    offCtx.textAlign =
        "center";

    offCtx.textBaseline =
        "middle";

    offCtx.fillStyle =
        "white";


    offCtx.fillText(
        text,
        width / 2,
        height / 2
    );


    const imageData =
        offCtx.getImageData(
            0,
            0,
            width,
            height
        );


    textTargets = [];

    const gap =
        isMobile ? 3 : 4;


    for (
        let y = 0;
        y < height;
        y += gap
    ) {

        for (
            let x = 0;
            x < width;
            x += gap
        ) {

            const index =
                (y * width + x) * 4;

            const alpha =
                imageData.data[
                    index + 3
                ];


            if (alpha > 150) {

                textTargets.push({
                    x: x,
                    y: y
                });
            }
        }
    }


    textTargets.sort(
        () => Math.random() - 0.5
    );


    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        const target =
            textTargets[
                i % textTargets.length
            ];


        particles[i].targetX =
            target.x;

        particles[i].targetY =
            target.y;
    }
}


// ============================================================
// GALAKSI
// ============================================================

function drawGalaxy(time) {

    for (
        const particle of particles
    ) {

        particle.angle +=
            particle.speed;


        const rotation =
            time * 0.00025;


        const angle =
            particle.angle +
            rotation;


        const x =
            center.x +
            Math.cos(angle) *
            particle.radius;


        const y =
            center.y +
            Math.sin(angle) *
            particle.radius *
            0.52;


        particle.x = x;
        particle.y = y;


        drawParticle(
            x,
            y,
            particle.size,
            particle.alpha
        );
    }
}


// ============================================================
// PARTIKEL MENUJU TEKS
// ============================================================

function moveToText(progress) {

    for (
        const particle of particles
    ) {

        particle.angle +=
            particle.speed * 0.35;


        const galaxyX =
            center.x +
            Math.cos(
                particle.angle
            ) *
            particle.radius;


        const galaxyY =
            center.y +
            Math.sin(
                particle.angle
            ) *
            particle.radius *
            0.52;


        particle.x +=
            (
                particle.targetX -
                particle.x
            ) *
            0.08;


        particle.y +=
            (
                particle.targetY -
                particle.y
            ) *
            0.08;


        const x =
            galaxyX *
            (1 - progress) +
            particle.x *
            progress;


        const y =
            galaxyY *
            (1 - progress) +
            particle.y *
            progress;


        drawParticle(
            x,
            y,
            particle.size,
            particle.alpha
        );
    }
}


// ============================================================
// TEKS STABIL
// ============================================================

function drawText() {

    for (
        const particle of particles
    ) {

        particle.x +=
            (
                particle.targetX -
                particle.x
            ) *
            0.12;


        particle.y +=
            (
                particle.targetY -
                particle.y
            ) *
            0.12;


        drawParticle(
            particle.x,
            particle.y,
            particle.size,
            particle.alpha
        );
    }
}


// ============================================================
// EFEK KOSMIK
// ============================================================

function cosmicSwirl(time) {

    for (
        const particle of particles
    ) {

        particle.angle +=
            particle.speed * 2.5;


        const wave =
            Math.sin(
                time * 0.008 +
                particle.radius * 0.02
            );


        const radius =
            particle.radius *
            (
                0.35 +
                0.18 * wave
            );


        const angle =
            particle.angle +
            time * 0.002;


        const x =
            center.x +
            Math.cos(angle) *
            radius;


        const y =
            center.y +
            Math.sin(angle) *
            radius *
            0.7;


        drawParticle(
            x,
            y,
            particle.size * 1.2,
            particle.alpha
        );
    }
}


// ============================================================
// MEMBUAT HATI
// ============================================================

function createHeart() {

    heartPoints = [];

    for (
        let i = 0;
        i < PARTICLE_COUNT;
        i++
    ) {

        const t =
            Math.random() *
            Math.PI *
            2;


        const scale =
            Math.sqrt(
                Math.random()
            );


        const x =
            16 *
            Math.pow(
                Math.sin(t),
                3
            );


        const y =
            -(
                13 *
                Math.cos(t) -
                5 *
                Math.cos(2 * t) -
                2 *
                Math.cos(3 * t) -
                Math.cos(4 * t)
            );


        heartPoints.push({

            x:
                x *
                scale *
                15,

            y:
                y *
                scale *
                15,

            z:
                (
                    Math.random() -
                    0.5
                ) *
                45
        });
    }
}


// ============================================================
// MEMBUAT WAWA
// ============================================================

function createWawa() {

    const offscreen =
        document.createElement("canvas");

    offscreen.width = width;
    offscreen.height = height;

    const offCtx =
        offscreen.getContext("2d");


    const fontSize =
        Math.min(
            width *
            (isMobile ? 0.13 : 0.08),
            isMobile ? 55 : 85
        );


    offCtx.font =
        `bold ${fontSize}px Arial`;

    offCtx.textAlign =
        "center";

    offCtx.textBaseline =
        "middle";

    offCtx.fillStyle =
        "white";


    offCtx.fillText(
        "wawa",
        width / 2,
        height / 2
    );


    const imageData =
        offCtx.getImageData(
            0,
            0,
            width,
            height
        );


    wawaPoints = [];

    const gap =
        isMobile ? 3 : 3;


    for (
        let y = 0;
        y < height;
        y += gap
    ) {

        for (
            let x = 0;
            x < width;
            x += gap
        ) {

            const index =
                (y * width + x) * 4;


            if (
                imageData.data[
                    index + 3
                ] > 150
            ) {

                wawaPoints.push({
                    x: x,
                    y: y
                });
            }
        }
    }


    wawaPoints.sort(
        () => Math.random() - 0.5
    );
}


// ============================================================
// MEMBENTUK HATI
// ============================================================

function drawHeart(progress) {

    const scale =
        Math.min(
            width,
            height
        ) /
        (isMobile ? 520 : 700);


    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        const particle =
            particles[i];


        const point =
            heartPoints[
                i %
                heartPoints.length
            ];


        const targetX =
            center.x +
            point.x *
            scale;


        const targetY =
            center.y +
            point.y *
            scale;


        particle.x +=
            (
                targetX -
                particle.x
            ) *
            0.06 *
            progress;


        particle.y +=
            (
                targetY -
                particle.y
            ) *
            0.06 *
            progress;


        drawParticle(
            particle.x,
            particle.y,
            particle.size,
            particle.alpha
        );
    }
}


// ============================================================
// HATI 3D
// ============================================================

function drawRotatingHeart(rotation) {

    const scale =
        Math.min(
            width,
            height
        ) /
        (isMobile ? 520 : 700);


    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        const particle =
            particles[i];


        const point =
            heartPoints[
                i %
                heartPoints.length
            ];


        const x =
            point.x *
            scale;


        const y =
            point.y *
            scale;


        const z =
            point.z *
            scale;


        const rotatedX =
            x *
            Math.cos(rotation) -
            z *
            Math.sin(rotation);


        const rotatedZ =
            x *
            Math.sin(rotation) +
            z *
            Math.cos(rotation);


        const perspective =
            1 +
            rotatedZ /
            900;


        const screenX =
            center.x +
            rotatedX *
            perspective;


        const screenY =
            center.y +
            y *
            perspective;


        drawParticle(
            screenX,
            screenY,
            particle.size *
            Math.max(
                0.4,
                perspective
            ),
            particle.alpha
        );
    }


    drawWawa(rotation);
}


// ============================================================
// WAWA DI DALAM HATI
// ============================================================

function drawWawa(rotation) {

    if (
        wawaPoints.length === 0
    ) {
        return;
    }


    const squeeze =
        Math.max(
            0.15,
            Math.abs(
                Math.cos(rotation)
            )
        );


    for (
        let i = 0;
        i < wawaPoints.length;
        i++
    ) {

        const point =
            wawaPoints[i];


        const x =
            center.x +
            (
                point.x -
                center.x
            ) *
            squeeze;


        const y =
            point.y;


        ctx.beginPath();


        ctx.arc(
            x,
            y,
            isMobile ? 1.2 : 1.3,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "rgba(255,255,255,0.95)";


        ctx.fill();
    }
}


// ============================================================
// PARTIKEL
// ============================================================

function drawParticle(
    x,
    y,
    size,
    alpha
) {

    ctx.beginPath();


    ctx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        `rgba(
            255,
            ${80 + Math.random() * 100},
            ${150 + Math.random() * 105},
            ${alpha}
        )`;


    ctx.fill();
}


// ============================================================
// ANIMASI UTAMA
// ============================================================

const startTime =
    performance.now();


function animate(time) {

    const elapsed =
        (
            time -
            startTime
        ) / 1000;


    ctx.fillStyle =
        "rgba(0,0,0,0.22)";


    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // 0–3 DETIK
    if (
        elapsed < TIME_HEY
    ) {

        drawGalaxy(time);
    }


    // 3–6 DETIK
    else if (
        elapsed < 6
    ) {

        if (
            currentText !==
            "Hey kamu"
        ) {

            createTextTargets(
                "Hey kamu"
            );
        }


        const progress =
            Math.min(
                (
                    elapsed -
                    3
                ) / 3,
                1
            );


        moveToText(
            progress
        );
    }


    // 6–7 DETIK
    else if (
        elapsed < 7
    ) {

        const pulse =
            1 +
            Math.sin(
                (
                    elapsed -
                    6
                ) *
                Math.PI *
                4
            ) *
            0.08;


        for (
            const particle of particles
        ) {

            const x =
                center.x +
                (
                    particle.targetX -
                    center.x
                ) *
                pulse;


            const y =
                center.y +
                (
                    particle.targetY -
                    center.y
                ) *
                pulse;


            drawParticle(
                x,
                y,
                particle.size *
                pulse,
                particle.alpha
            );
        }
    }


    // 7–9 DETIK
    else if (
        elapsed < TIME_IYAA
    ) {

        cosmicSwirl(time);
    }


    // 9–12 DETIK
    else if (
        elapsed < 12
    ) {

        if (
            currentText !==
            "iyaa kamuu"
        ) {

            createTextTargets(
                "iyaa kamuu"
            );
        }


        const progress =
            Math.min(
                (
                    elapsed -
                    9
                ) / 3,
                1
            );


        moveToText(
            progress
        );
    }


    // 12–16 DETIK
    else if (
        elapsed < TIME_JANGAN
    ) {

        if (
            currentText !==
            "iyaa kamuu"
        ) {

            createTextTargets(
                "iyaa kamuu"
            );
        }


        drawText();
    }


    // 16–20 DETIK
    else if (
        elapsed < TIME_HEART
    ) {

        if (
            currentText !==
            "jangann berpaling yaaa"
        ) {

            createTextTargets(
                "jangann berpaling yaaa"
            );
        }


        const progress =
            Math.min(
                (
                    elapsed -
                    16
                ) / 3,
                1
            );


        moveToText(
            progress
        );
    }


    // 20–23 DETIK
    else if (
        elapsed < TIME_ROTATE
    ) {

        const progress =
            Math.min(
                (
                    elapsed -
                    20
                ) / 3,
                1
            );


        drawHeart(
            progress
        );
    }


    // 23+ DETIK
    else {

        const rotation =
            (
                elapsed -
                23
            ) *
            1.2;


        drawRotatingHeart(
            rotation
        );
    }


    requestAnimationFrame(
        animate
    );
}


// ============================================================
// RESIZE HP / LAPTOP
// ============================================================

window.addEventListener(
    "resize",
    resizeCanvas
);


// ============================================================
// MULAI
// ============================================================

createTextTargets(
    "Hey kamu"
);

createHeart();

createWawa();


for (
    const particle of particles
) {

    particle.x =
        center.x +
        Math.cos(
            particle.angle
        ) *
        particle.radius;


    particle.y =
        center.y +
        Math.sin(
            particle.angle
        ) *
        particle.radius *
        0.52;
}


resizeCanvas();

requestAnimationFrame(
    animate
);