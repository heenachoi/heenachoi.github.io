import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';

/*
  Heena Choi Portfolio — OpeningHours.studio Aesthetic
  - Minimalism, Spindly Flower Stems & Petal Edges
  - Fixed Header Overlap Issues
*/

document.addEventListener('DOMContentLoaded', () => {

    /* ─── 1. Custom Cursor ─── */
    const cursor = document.getElementById('custom-cursor');
    const hoverEls = document.querySelectorAll('a, button, .project-item, .cta-button, .gooey-target');

    let mx = 0, my = 0, cx = 0, cy = 0;
    if (window.matchMedia("(pointer: fine)").matches && cursor) {
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        (function loop() {
            cx += (mx - cx) * 0.15;
            cy += (my - cy) * 0.15;
            cursor.style.transform = `translate(${cx - 8}px, ${cy - 8}px)`;
            requestAnimationFrame(loop);
        })();
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    /* ─── 2. Real-time 3D ASCII Minimalist Skeletal Flower ─── */
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    // Removal of existing canvas to prevent overlap
    const existing = document.getElementById('ascii-canvas');
    if (existing) existing.remove();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // OpeningHours style: Pure black characters on white background
    const theme = { fg: '#000000', bg: '#FFFFFF' };

    // Space at end maps to white background (1.0 brightness)
    const effect = new AsciiEffect(renderer, " .:-=+*#%@ ", {
        invert: false,
        resolution: 0.22 // Enhanced resolution for clarity
    });
    effect.setSize(window.innerWidth, window.innerHeight);
    effect.domElement.style.color = theme.fg;
    effect.domElement.style.backgroundColor = theme.bg;
    effect.domElement.style.position = 'absolute';
    effect.domElement.style.top = '0';
    effect.domElement.style.left = '0';
    effect.domElement.style.zIndex = '0';
    effect.domElement.id = 'ascii-canvas';
    heroSection.appendChild(effect.domElement);

    // Multi-layered spindly geometry
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const petalGeo = new THREE.TorusKnotGeometry(2.5, 0.04, 256, 32, 2, 11);
    const stemGeo = new THREE.TorusKnotGeometry(2.8, 0.03, 200, 24, 3, 5);
    const detailGeo = new THREE.TorusKnotGeometry(1.8, 0.02, 160, 24, 7, 3);
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.1 });

    coreGroup.add(new THREE.Mesh(petalGeo, flowerMat));

    const stemMesh = new THREE.Mesh(stemGeo, flowerMat);
    stemMesh.rotation.set(Math.PI / 3, 0, Math.PI / 4);
    coreGroup.add(stemMesh);

    const detailMesh = new THREE.Mesh(detailGeo, flowerMat);
    detailMesh.rotation.set(0, Math.PI / 2, 0);
    coreGroup.add(detailMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.5);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        effect.setSize(window.innerWidth, window.innerHeight);
    });

    // Dynamic Micro-data logic
    const metadataEl = document.getElementById('nav-metadata');
    let targetRX = 0, targetRY = 0;
    let currentRX = 0, currentRY = 0;

    if (metadataEl) {
        setInterval(() => {
            const now = new Date();
            const seoulTime = now.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Seoul',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const rX = currentRX.toFixed(3);
            const rY = currentRY.toFixed(3);
            metadataEl.innerText = `SEOUL ${seoulTime} / CORE_ROT [${rX}, ${rY}]`;
        }, 100);
    }

    document.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRY = nx * 0.4;
        targetRX = -ny * 0.4;
    });

    const clock = new THREE.Clock();
    function render() {
        requestAnimationFrame(render);
        const time = clock.getElapsedTime();

        // Liquid smooth acceleration/deceleration
        currentRY += (targetRY - currentRY) * 0.05;
        currentRX += (targetRX - currentRX) * 0.05;

        coreGroup.rotation.y = currentRY;
        coreGroup.rotation.x = currentRX;
        coreGroup.rotation.z = time * 0.05; // Slower, more elegant rotation

        // Heartbeat pulse - more subtle
        const scale = 0.97 + Math.sin(time * 1.2) * 0.02;
        coreGroup.scale.setScalar(scale);

        effect.render(scene, camera);
    }
    render();
});

