// Smooth scroll
function scrollToSection(){ 
    document.getElementById('gallery').scrollIntoView({behavior:'smooth', block:'start'}); 
}

// ----------------------------------------------------
// CANVAS: Animacja śniegu, domek i drzewka
// ----------------------------------------------------
const canvas = document.getElementById('snow');
const ctx = canvas.getContext && canvas.getContext('2d');
let cw = 0, ch = 0, flakes = [], snowInterval;
let angle = 0;

function drawTree(x, groundY, scale = 1) {
    const height = 90 * scale;
    const trunkH = height * 0.22;
    const trunkW = height * 0.10;
    const trunkY = groundY - trunkH;

    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; 
    ctx.beginPath();
    ctx.ellipse(x, groundY, trunkW * 3, trunkW * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.fillRect(x - trunkW / 2, trunkY, trunkW, trunkH);

    for (let i = 0; i < 3; i++) {
        const top = trunkY - (i + 1) * (height * 0.23);
        const bottom = trunkY - i * (height * 0.23);
        const half = (35 - i * 7) * scale;

        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x - half, bottom);
        ctx.lineTo(x + half, bottom);
        ctx.closePath();
        ctx.fill();
    }
}

function drawHouse(x, groundY) {
    const size = 120;
    const houseH = size * 0.55;
    const houseW = size * 0.75;
    const houseTop = groundY - houseH;

    ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
    ctx.beginPath();
    ctx.ellipse(x, groundY, houseW * 0.6, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.fillRect(x - houseW / 2, houseTop, houseW, houseH);

    // dach
    ctx.beginPath();
    ctx.moveTo(x - houseW / 2 - 10, houseTop + 2);
    ctx.lineTo(x, houseTop - size * 0.35);
    ctx.lineTo(x + houseW / 2 + 10, houseTop + 2);
    ctx.closePath();
    ctx.fill();

    // komin i dym
    const chimneyX = x + houseW * 0.2;
    const chimneyY = houseTop - 30;
    ctx.fillRect(chimneyX, chimneyY, 18, 30);
    
    // dym
    ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
    ctx.beginPath();
    ctx.arc(chimneyX + 9, chimneyY - 15, 8, 0, Math.PI * 2);
    ctx.arc(chimneyX + 5, chimneyY - 25, 10, 0, Math.PI * 2);
    ctx.fill();

    // okna i drzwi (ciepłe żółte światło)
    ctx.fillStyle = "#ffdd99";
    ctx.shadowColor = "#ffdd99";
    ctx.shadowBlur = 8;
    
    // Okno lewe
    ctx.fillRect(x - 28, houseTop + 14, 20, 20);
    // Okno prawe
    ctx.fillRect(x + 7, houseTop + 14, 20, 20);
    
    ctx.fillStyle = "#6b3e26";
    ctx.shadowBlur = 0;
    ctx.fillRect(x - 12, houseTop + 40, 24, 25);

    ctx.shadowBlur = 0;
}

function drawBackground() {
    const w = canvas.width;
    const h = canvas.height;
    const groundY = h * 0.75;

    // podłoże (teren)
    ctx.fillStyle = "#fff"; 
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.bezierCurveTo(w * 0.20, groundY - 60, w * 0.70, groundY + 30, w, groundY - 20);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // drzewa
    drawTree(w * 0.12, groundY, 1.1);
    drawTree(w * 0.25, groundY, 0.9);
    drawTree(w * 0.38, groundY, 1.2);

    // domek
    drawHouse(w * 0.75, groundY);
}

function resizeCanvas() { 
    cw = canvas.width = canvas.offsetWidth; 
    ch = canvas.height = canvas.offsetHeight; 
    flakes = []; 
    for(let i=0;i<Math.round(cw/5);i++){ 
        flakes.push({
            x:Math.random()*cw,
            y:Math.random()*ch,
            r:Math.random()*1.5+0.5,
            d:Math.random()*1.2+0.5,
            t:Math.random()*100
        }); 
    } 
}

function drawSnow() { 
    ctx.clearRect(0, 0, cw, ch); 
    drawBackground(); 
    
    ctx.fillStyle = '#FFFFFF'; 
    ctx.beginPath(); 
    
    angle += 0.005;

    flakes.forEach(f => {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); 
        
        f.y += f.d + f.r / 2; 
        f.x += Math.sin(angle + f.t) * 0.8;
        
        if (f.y > ch + f.r) {
            f.y = -f.r;
            f.x = Math.random() * cw;
            f.t = Math.random() * 100;
        } 
    }); 
    ctx.fill(); 
    requestAnimationFrame(drawSnow); 
}

// ----------------------------------------------------
// LOGIKA GALERII (REUSABLE)
// ----------------------------------------------------
function initGallery(galleryId) {
    const container = document.getElementById(galleryId);
    if (!container) return; // Jeśli sekcja nie istnieje, nie rób nic

    const slides = container.querySelectorAll('.mySlides');
    const prev = container.querySelector('.prev');
    const next = container.querySelector('.next');
    let slideIndex = 1;

    function showSlides(n) {
        if (slides.length === 0) return;
        
        if (n > slides.length) slideIndex = 1;
        if (n < 1) slideIndex = slides.length;

        // Ukryj wszystkie slajdy w TEJ konkretnej galerii
        slides.forEach(s => s.style.display = 'none');
        
        // Pokaż wybrany slajd (flex, aby działało centrowanie)
        slides[slideIndex - 1].style.display = 'flex';
    }

    // Obsługa kliknięć
    if (prev) prev.addEventListener('click', () => showSlides(slideIndex -= 1));
    if (next) next.addEventListener('click', () => showSlides(slideIndex += 1));

    // Pokaż pierwszy slajd na starcie
    showSlides(slideIndex);
}

// ----------------------------------------------------
// START PO ZAŁADOWANIU STRONY
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // --- Inicjalizacja Canvas ---
    if (canvas) {
        resizeCanvas();
        drawSnow();
        window.addEventListener('resize', resizeCanvas); 
    }

    // --- Sticky header ---
    const header = document.querySelector('.sticky-header');
    if (header) {
        window.addEventListener('scroll', () => { 
            if (window.scrollY > 40) header.classList.add('scrolled'); 
            else header.classList.remove('scrolled'); 
        });
    }

    // --- URUCHOMIENIE OBU GALERII NIEZALEŻNIE ---
    initGallery('gallery');      // Pierwsza galeria
    initGallery('galleryInsta'); // Druga galeria (Insta)

});