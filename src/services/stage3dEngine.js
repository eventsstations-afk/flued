/**
 * CHRISTMAS FEUD â€” REAL-TIME THREE.JS PBR 3D TELEVISION GAME-SHOW STAGE
 * Redesigned for an All-Christmas Broadcast Television Aesthetic:
 *  - Deep Emerald Green, Burgundy Red, Dark Navy Midnight Sky, Champagne Gold, Warm Ivory
 *  - Huge 3D Extruded "Christmas FEUD" Marquee Sign with 3D Santa Hat & Holly Garland
 *  - Velvet Burgundy Studio Theater Curtains, Illuminated Golden Arches, Snowy Winter Cottages
 *  - Detailed 3D Christmas Trees, Ornaments, Gift Boxes with Bows, Wreaths, Stockings,
 *    Swaying Golden Bells, Candy Canes, Snowflakes, Controlled Volumetric Spotlights,
 *    3D Confetti Burst, and Giant Rotating 3D Golden Championship Trophy
 *  - Adaptive 4K/8K DPI + Mobile Optimization + Graceful 2D Canvas Fallback
 */

import * as THREE from 'three';

const PALETTE = {
  burgundy: 0x5c0c18,
  crimson: 0x981322,
  emerald: 0x074b34,
  forest: 0x0c3325,
  navy: 0x0b1629,
  champagne: 0xe8c067,
  metallicGold: 0xc2953c,
  ivory: 0xfaf5eb
};

function createCandyStripeTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#FAF5EB';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#981322';
  for (let i = -256; i < 512; i += 44) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 20, 0);
    ctx.lineTo(i + 276, 256);
    ctx.lineTo(i + 256, 256);
    ctx.closePath();
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createSnowflakeTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.translate(64, 64);
  const grad = ctx.createRadialGradient(0, 0, 4, 0, 0, 58);
  grad.addColorStop(0, 'rgba(250,245,235,1)');
  grad.addColorStop(0.45, 'rgba(220,235,255,0.72)');
  grad.addColorStop(1, 'rgba(220,235,255,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -46);
    ctx.moveTo(0, -24);
    ctx.lineTo(-11, -34);
    ctx.moveTo(0, -24);
    ctx.lineTo(11, -34);
    ctx.stroke();
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createChristmasFeudSignTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const ctx = c.getContext('2d');

  // Deep Navy-to-Burgundy TV Broadcast Marquee Plaque
  const bg = ctx.createRadialGradient(512, 230, 30, 512, 256, 520);
  bg.addColorStop(0, '#781020');
  bg.addColorStop(0.55, '#3D0914');
  bg.addColorStop(1, '#0C172B');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 512);

  // Restrained studio spotlight rays
  ctx.save();
  ctx.translate(512, 240);
  for (let i = 0; i < 20; i++) {
    ctx.rotate((Math.PI * 2) / 20);
    ctx.fillStyle = 'rgba(232, 192, 103, 0.05)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-20, -520);
    ctx.lineTo(20, -520);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Elegant Emerald & Champagne Gold Broadcast Frame
  ctx.strokeStyle = '#E8C067';
  ctx.lineWidth = 10;
  ctx.strokeRect(22, 22, 980, 468);
  ctx.strokeStyle = '#074B34';
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, 952, 440);

  // "Christmas" in warm ivory broadcast script/serif
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'italic 700 122px Georgia, "Times New Roman", serif';
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#2B060D';
  ctx.strokeText('Christmas', 512, 138);

  const ivoryGrad = ctx.createLinearGradient(0, 76, 0, 194);
  ivoryGrad.addColorStop(0, '#FFFFFF');
  ivoryGrad.addColorStop(0.6, '#FAF2DF');
  ivoryGrad.addColorStop(1, '#DEC080');
  ctx.fillStyle = ivoryGrad;
  ctx.fillText('Christmas', 512, 134);

  // Extruded Metallic Champagne-Gold "FEUD"
  ctx.font = '900 184px Impact, "Arial Black", sans-serif';
  for (let d = 14; d >= 1; d--) {
    ctx.fillStyle = d > 7 ? '#1E050A' : '#6A101B';
    ctx.fillText('FEUD', 512 + d * 0.55, 308 + d * 1.15);
  }
  ctx.lineWidth = 11;
  ctx.strokeStyle = '#4B0A13';
  ctx.strokeText('FEUD', 512, 308);

  const goldGrad = ctx.createLinearGradient(0, 215, 0, 392);
  goldGrad.addColorStop(0, '#FFF6CE');
  goldGrad.addColorStop(0.38, '#E8C067');
  goldGrad.addColorStop(0.65, '#BE9038');
  goldGrad.addColorStop(0.88, '#F6DA8E');
  goldGrad.addColorStop(1, '#7D5818');
  ctx.fillStyle = goldGrad;
  ctx.fillText('FEUD', 512, 308);

  // Deep Emerald Ribbon Pill: THE ULTIMATE CHRISTMAS GAME SHOW
  ctx.fillStyle = '#074B34';
  ctx.beginPath();
  ctx.roundRect(172, 404, 680, 58, 29);
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#E8C067';
  ctx.stroke();

  ctx.font = '800 26px "Segoe UI", Arial, sans-serif';
  ctx.fillStyle = '#FAF5EB';
  ctx.fillText('THE ULTIMATE CHRISTMAS GAME SHOW', 512, 434);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createStageFloorTexture() {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 1024;
  const ctx = c.getContext('2d');
  const cx = 512;
  const cy = 512;
  const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 512);
  grad.addColorStop(0, '#6B131E');
  grad.addColorStop(0.45, '#460A13');
  grad.addColorStop(0.75, '#29070D');
  grad.addColorStop(1, '#160407');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  [145, 250, 355, 455].forEach((r, idx) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = idx % 2 === 0 ? 'rgba(244,203,108,0.44)' : 'rgba(194,149,60,0.22)';
    ctx.lineWidth = idx === 2 ? 9 : 4;
    ctx.stroke();
  });

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function createStudioEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x360710);

  const panels = [
    { pos: [0, 9, 2], size: [12, 4], color: 0xfff0cc },
    { pos: [-10, 4, 4], size: [6, 8], color: 0xf4c75e },
    { pos: [10, 4, 4], size: [6, 8], color: 0xf4c75e },
    { pos: [-8, 2, -8], size: [8, 8], color: 0x0c734c },
    { pos: [8, 2, -8], size: [8, 8], color: 0xb21526 },
    { pos: [0, -6, 0], size: [16, 16], color: 0x3b0710 }
  ];
  panels.forEach((p) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(p.size[0], p.size[1]),
      new THREE.MeshBasicMaterial({ color: p.color, side: THREE.DoubleSide })
    );
    mesh.position.set(...p.pos);
    mesh.lookAt(0, 0, 0);
    envScene.add(mesh);
  });

  const rt = pmrem.fromScene(envScene, 0.04);
  pmrem.dispose();
  return rt.texture;
}

export class ChristmasStage3D {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.mode = 'home';
    this.quality = options.initialQuality && ['ultra', 'balanced', 'lite'].includes(options.initialQuality)
      ? options.initialQuality
      : this.detectInitialQuality();
    this.usingFallback = false;
    this.running = true;
    this.clock = null;
    this.animId = null;
    this._onResizeBound = () => this.onResize();
    this._onPointerMoveBound = (e) => {
      this.pointerX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      this.pointerY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    this.flashRed = 0;
    this.flashGold = 0;
    this.confettiActive = 0;
    this.pointerX = 0;
    this.pointerY = 0;

    this.camTargetPos = new THREE.Vector3(0, 3.4, 14.0);
    this.camTargetLook = new THREE.Vector3(0, 2.9, 0);
    this.currentLook = new THREE.Vector3(0, 2.9, 0);

    this.marqueeBulbs = [];
    this.spotCones = [];
    this.bells = [];
    this.snowSystem = null;
    this.stardustSystem = null;
    this.confettiMesh = null;
    this.confettiData = [];
    this.heroSignGroup = null;
    this.villageShowcaseGroup = null;
    this.trophyGroup = null;
    this.treeLights = [];

    this.init();
  }

  detectInitialQuality() {
    const saved = localStorage.getItem('cff_quality');
    if (saved && ['ultra', 'balanced', 'lite'].includes(saved)) return saved;
    return window.innerWidth < 768 ? 'balanced' : 'ultra';
  }

  setQuality(q) {
    if (!['ultra', 'balanced', 'lite'].includes(q)) return;
    this.quality = q;
    localStorage.setItem('cff_quality', q);
    if (q === 'lite') {
      this.teardownWebGL();
      this.initFallback2D();
    } else if (this.usingFallback) {
      this.usingFallback = false;
      this.initWebGL();
    } else if (this.renderer) {
      this.applyRendererQuality();
    }
  }

  init() {
    window.addEventListener('resize', this._onResizeBound);
    window.addEventListener('pointermove', this._onPointerMoveBound, { passive: true });

    if (this.quality === 'lite') this.initFallback2D();
    else this.initWebGL();
  }

  destroy() {
    this.running = false;
    this.usingFallback = false;
    window.removeEventListener('resize', this._onResizeBound);
    window.removeEventListener('pointermove', this._onPointerMoveBound);
    this.teardownWebGL();
  }

  teardownWebGL() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer) {
      try { this.renderer.dispose(); } catch (_) {}
      this.renderer = null;
    }
  }

  applyRendererQuality() {
    if (!this.renderer) return;
    const isMobile = window.innerWidth < 768;
    const maxDpr = this.quality === 'ultra' ? (isMobile ? 1.5 : 2.0) : 1.25;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    this.renderer.shadowMap.enabled = this.quality === 'ultra' && !isMobile;
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  initWebGL() {
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: this.quality === 'ultra',
        powerPreference: 'high-performance',
        alpha: false
      });
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.12;
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.applyRendererQuality();

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x24050b);
      this.scene.fog = new THREE.FogExp2(0x2b060d, 0.019);
      this.scene.environment = createStudioEnvironment(this.renderer);

      this.camera = new THREE.PerspectiveCamera(44, window.innerWidth / Math.max(1, window.innerHeight), 0.1, 120);
      this.camera.position.copy(this.camTargetPos);
      this.camera.lookAt(this.camTargetLook);

      this.clock = new THREE.Clock();
      this.buildMaterials();
      this.buildLighting();
      this.buildStudioArchitecture();
      this.buildHeroTreesAndGifts();
      this.buildWreathsStockingsBellsGarlands();
      this.buildWinterVillageShowcase();
      this.buildExtruded3DSign();
      this.buildGoldenTrophy();
      this.buildSnowAndParticles();
      this.buildConfettiSystem();

      this.setMode(this.mode);
      this.animateWebGL();
    } catch (err) {
      console.warn('[scene3d] WebGL unavailable, switching to 2D Canvas fallback:', err.message);
      this.initFallback2D();
    }
  }

  buildMaterials() {
    const candyTex = createCandyStripeTexture();
    this.mats = {
      gold: new THREE.MeshStandardMaterial({ color: PALETTE.champagne, metalness: 0.88, roughness: 0.2 }),
      deepGold: new THREE.MeshStandardMaterial({ color: PALETTE.metallicGold, metalness: 0.82, roughness: 0.3 }),
      redLacquer: new THREE.MeshPhysicalMaterial({
        color: PALETTE.crimson, metalness: 0.22, roughness: 0.22, clearcoat: 0.88, clearcoatRoughness: 0.14
      }),
      burgundyVelvet: new THREE.MeshStandardMaterial({ color: PALETTE.burgundy, metalness: 0.06, roughness: 0.8 }),
      navyPanel: new THREE.MeshStandardMaterial({ color: 0x11223d, metalness: 0.2, roughness: 0.45 }),
      emerald: new THREE.MeshStandardMaterial({ color: PALETTE.emerald, metalness: 0.18, roughness: 0.42 }),
      pine: new THREE.MeshStandardMaterial({ color: 0x0a442d, roughness: 0.78, metalness: 0.05 }),
      snow: new THREE.MeshStandardMaterial({ color: PALETTE.ivory, roughness: 0.5, metalness: 0.04 }),
      glassRed: new THREE.MeshPhysicalMaterial({ color: 0xb81424, metalness: 0.32, roughness: 0.1, clearcoat: 1.0 }),
      glassEmerald: new THREE.MeshPhysicalMaterial({ color: 0x0b724c, metalness: 0.32, roughness: 0.1, clearcoat: 1.0 }),
      glassGold: new THREE.MeshPhysicalMaterial({ color: 0xecd078, metalness: 0.84, roughness: 0.14, clearcoat: 0.9 }),
      cottageWood: new THREE.MeshStandardMaterial({ color: 0x6b3e24, roughness: 0.84, metalness: 0.04 }),
      warmGlow: new THREE.MeshStandardMaterial({ color: 0xffe49e, emissive: 0xffb845, emissiveIntensity: 1.7 }),
      candyCane: new THREE.MeshPhysicalMaterial({ map: candyTex, roughness: 0.2, clearcoat: 0.8 })
    };
  }

  buildLighting() {
    this.ambient = new THREE.AmbientLight(0xeef2ff, 0.52);
    this.scene.add(this.ambient);

    const hemi = new THREE.HemisphereLight(0xf6e6c8, 0x0c1a30, 0.65);
    this.scene.add(hemi);

    this.keyLight = new THREE.SpotLight(0xffe7ba, 80, 44, Math.PI / 4, 0.6, 1.3);
    this.keyLight.position.set(0, 14, 11);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(this.keyLight);

    this.redSpot = new THREE.SpotLight(0xc91a2c, 65, 40, Math.PI / 5, 0.65, 1.2);
    this.redSpot.position.set(-10, 12, 5);
    this.scene.add(this.redSpot);

    this.greenSpot = new THREE.SpotLight(0x0b8c5c, 65, 40, Math.PI / 5, 0.65, 1.2);
    this.greenSpot.position.set(10, 12, 5);
    this.scene.add(this.greenSpot);

    this.warmBack = new THREE.PointLight(0xe8c067, 26, 26);
    this.warmBack.position.set(0, 5.5, -5.5);
    this.scene.add(this.warmBack);

    // Controlled volumetric studio beams (refined opacity so UI stays clear)
    const coneGeo = new THREE.ConeGeometry(3.0, 16, 28, 1, true);
    coneGeo.translate(0, -8, 0);
    const beams = [
      { pos: [-7.2, 12.6, -2.5], color: 0xe8c067, rotZ: -0.26, opacity: 0.065, phase: 0 },
      { pos: [7.2, 12.6, -2.5], color: 0xe8c067, rotZ: 0.26, opacity: 0.065, phase: 1.5 },
      { pos: [-10.8, 12, 1], color: 0xb01628, rotZ: -0.4, opacity: 0.055, phase: 2.3 },
      { pos: [10.8, 12, 1], color: 0x0b7a52, rotZ: 0.4, opacity: 0.055, phase: 3.7 }
    ];
    beams.forEach((cfg) => {
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(coneGeo, mat);
      mesh.position.set(...cfg.pos);
      mesh.rotation.z = cfg.rotZ;
      mesh.userData = { baseRotZ: cfg.rotZ, phase: cfg.phase, baseOpacity: cfg.opacity, mat };
      this.scene.add(mesh);
      this.spotCones.push(mesh);
    });
  }

  buildStudioArchitecture() {
    const floorTex = createStageFloorTexture();
    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(18.5, 19, 0.6, 64),
      new THREE.MeshPhysicalMaterial({
        map: floorTex, roughness: 0.18, metalness: 0.22, clearcoat: 0.85, clearcoatRoughness: 0.15
      })
    );
    floor.position.set(0, -0.3, 0);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Velvet Burgundy Theater Curtains framing left & right broadcast edges
    [-13.4, 13.4].forEach((cx, sideIdx) => {
      for (let i = 0; i < 4; i++) {
        const pleat = new THREE.Mesh(
          new THREE.CylinderGeometry(0.75, 0.92, 13, 14),
          this.mats.burgundyVelvet
        );
        pleat.position.set(cx + (sideIdx === 0 ? i * 0.72 : -i * 0.72), 6.2, -4.5 + i * 0.35);
        this.scene.add(pleat);
      }
    });

    // Raised centerpiece TV stage plinth
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(5.6, 6.2, 0.36, 48), this.mats.navyPanel);
    plinth.position.set(0, 0.18, -1.8);
    this.scene.add(plinth);
    const plinthRim = new THREE.Mesh(new THREE.TorusGeometry(5.65, 0.09, 12, 64), this.mats.gold);
    plinthRim.rotation.x = Math.PI / 2;
    plinthRim.position.set(0, 0.36, -1.8);
    this.scene.add(plinthRim);

    // 3 Grand Illuminated Golden Studio Arches opening to snowy midnight navy sky
    [-7.8, 0, 7.8].forEach((x, idx) => {
      const group = new THREE.Group();
      group.position.set(x, 0, idx === 1 ? -8.6 : -7.6);
      group.rotation.y = idx === 0 ? 0.24 : idx === 2 ? -0.24 : 0;

      const winH = idx === 1 ? 8.2 : 7.0;
      const winW = idx === 1 ? 6.8 : 5.2;
      const pane = new THREE.Mesh(
        new THREE.PlaneGeometry(winW, winH),
        new THREE.MeshBasicMaterial({ color: 0x0b1c36 })
      );
      pane.position.set(0, winH / 2 + 0.4, -0.25);
      group.add(pane);

      const glow = new THREE.Mesh(
        new THREE.CircleGeometry(winW * 0.44, 32),
        new THREE.MeshBasicMaterial({
          color: 0x2c63a6, transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending
        })
      );
      glow.position.set(0, winH * 0.58, -0.2);
      group.add(glow);

      const pillarGeo = new THREE.BoxGeometry(0.62, winH, 0.68);
      const leftP = new THREE.Mesh(pillarGeo, this.mats.burgundyVelvet);
      leftP.position.set(-winW / 2 - 0.3, winH / 2, 0);
      const rightP = new THREE.Mesh(pillarGeo, this.mats.burgundyVelvet);
      rightP.position.set(winW / 2 + 0.3, winH / 2, 0);
      group.add(leftP, rightP);

      const trimGeo = new THREE.BoxGeometry(0.12, winH + 0.2, 0.74);
      const trimL = new THREE.Mesh(trimGeo, this.mats.gold);
      trimL.position.set(-winW / 2, winH / 2, 0.04);
      const trimR = new THREE.Mesh(trimGeo, this.mats.gold);
      trimR.position.set(winW / 2, winH / 2, 0.04);
      group.add(trimL, trimR);

      const archRad = winW / 2 + 0.15;
      const archMesh = new THREE.Mesh(
        new THREE.TorusGeometry(archRad, 0.22, 14, 40, Math.PI),
        this.mats.gold
      );
      archMesh.position.set(0, winH, 0);
      group.add(archMesh);

      const bulbCount = idx === 1 ? 19 : 13;
      for (let b = 0; b < bulbCount; b++) {
        const angle = (b / (bulbCount - 1)) * Math.PI;
        const bulbMat = new THREE.MeshStandardMaterial({
          color: 0xfff5d8, emissive: 0xf4c75e, emissiveIntensity: 1.35, roughness: 0.2
        });
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), bulbMat);
        bulb.position.set(Math.cos(angle) * archRad, winH + Math.sin(angle) * archRad, 0.25);
        bulb.userData = { bulbIndex: this.marqueeBulbs.length, mat: bulbMat };
        group.add(bulb);
        this.marqueeBulbs.push(bulb);
      }

      this.scene.add(group);
    });
  }

  createChristmasTree(scale = 1) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.34, 1.0, 12),
      new THREE.MeshStandardMaterial({ color: 0x4b2916, roughness: 0.9 })
    );
    trunk.position.y = 0.5;
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 0.32, 20), this.mats.burgundyVelvet);
    stand.position.y = 0.16;
    group.add(trunk, stand);

    const tiers = [
      { r: 2.05, h: 2.1, y: 1.9 },
      { r: 1.68, h: 1.9, y: 3.1 },
      { r: 1.32, h: 1.7, y: 4.25 },
      { r: 0.96, h: 1.45, y: 5.25 },
      { r: 0.58, h: 1.15, y: 6.1 }
    ];
    tiers.forEach((t, ti) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(t.r, t.h, 16), this.mats.pine);
      cone.position.y = t.y;
      cone.castShadow = true;
      group.add(cone);

      const count = 10 - ti;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + ti * 0.55;
        const rad = t.r * 0.86;
        const oy = t.y - t.h * 0.34 + (i % 2) * 0.25;
        const ornMat = i % 3 === 0 ? this.mats.glassRed : i % 3 === 1 ? this.mats.glassGold : this.mats.glassEmerald;
        const orn = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), ornMat);
        orn.position.set(Math.cos(a) * rad, oy, Math.sin(a) * rad);
        group.add(orn);

        const la = a + Math.PI / count;
        const lMat = new THREE.MeshStandardMaterial({
          color: 0xfff8e7, emissive: i % 2 === 0 ? 0xffd166 : 0xff6b70, emissiveIntensity: 1.5
        });
        const lMesh = new THREE.Mesh(new THREE.SphereGeometry(0.062, 8, 8), lMat);
        lMesh.position.set(Math.cos(la) * (rad * 0.92), oy + 0.18, Math.sin(la) * (rad * 0.92));
        lMesh.userData = { phase: ti * 1.4 + i * 0.8, mat: lMat };
        group.add(lMesh);
        this.treeLights.push(lMesh);
      }
    });

    const starShape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 0.5 : 0.21;
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      if (i === 0) starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    starShape.closePath();
    const star = new THREE.Mesh(
      new THREE.ExtrudeGeometry(starShape, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03 }),
      new THREE.MeshStandardMaterial({
        color: 0xffe48f, emissive: 0xe8c067, emissiveIntensity: 0.85, metalness: 0.9, roughness: 0.12
      })
    );
    star.position.set(0, 6.95, -0.07);
    group.add(star);

    group.scale.setScalar(scale);
    return group;
  }

  createGiftBox(w, h, d, boxMat, ribbonMat) {
    const g = new THREE.Group();
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), boxMat);
    box.position.y = h / 2;
    const r1 = new THREE.Mesh(new THREE.BoxGeometry(w + 0.04, h + 0.04, d * 0.18), ribbonMat);
    r1.position.y = h / 2;
    const r2 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.18, h + 0.04, d + 0.04), ribbonMat);
    r2.position.y = h / 2;
    const bowL = new THREE.Mesh(new THREE.TorusGeometry(w * 0.18, w * 0.045, 8, 18), ribbonMat);
    bowL.position.set(-w * 0.16, h + w * 0.11, 0);
    bowL.rotation.z = 0.45;
    const bowR = new THREE.Mesh(new THREE.TorusGeometry(w * 0.18, w * 0.045, 8, 18), ribbonMat);
    bowR.position.set(w * 0.16, h + w * 0.11, 0);
    bowR.rotation.z = -0.45;
    g.add(box, r1, r2, bowL, bowR);
    return g;
  }

  buildHeroTreesAndGifts() {
    [
      { x: -8.8, z: -2.2, s: 1.15 },
      { x: 8.8, z: -2.2, s: 1.15 },
      { x: -11.4, z: -5.8, s: 0.92 },
      { x: 11.4, z: -5.8, s: 0.92 }
    ].forEach((tp) => {
      const tree = this.createChristmasTree(tp.s);
      tree.position.set(tp.x, 0, tp.z);
      this.scene.add(tree);
    });

    [
      { x: -7.1, z: -0.6, w: 1.1, h: 0.95, d: 1.1, bm: this.mats.redLacquer, rm: this.mats.gold, ry: 0.3 },
      { x: -8.4, z: 0.2, w: 0.88, h: 0.72, d: 0.88, bm: this.mats.emerald, rm: this.mats.gold, ry: -0.4 },
      { x: -6.3, z: -1.8, w: 0.74, h: 1.1, d: 0.74, bm: this.mats.gold, rm: this.mats.redLacquer, ry: 0.5 },
      { x: 7.1, z: -0.6, w: 1.1, h: 0.95, d: 1.1, bm: this.mats.emerald, rm: this.mats.gold, ry: -0.35 },
      { x: 8.4, z: 0.2, w: 0.88, h: 0.74, d: 0.88, bm: this.mats.redLacquer, rm: this.mats.gold, ry: 0.45 },
      { x: 6.3, z: -1.8, w: 0.74, h: 1.05, d: 0.74, bm: this.mats.gold, rm: this.mats.emerald, ry: -0.5 }
    ].forEach((g) => {
      const box = this.createGiftBox(g.w, g.h, g.d, g.bm, g.rm);
      box.position.set(g.x, 0, g.z);
      box.rotation.y = g.ry;
      this.scene.add(box);
    });

    // Glowing Red Christmas Lanterns flanking left & right foreground (matching approved studio reference!)
    [-9.4, 9.4].forEach((lx) => {
      const lantern = new THREE.Group();
      lantern.position.set(lx, 0, 1.45);
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.16, 0.76), this.mats.redLacquer);
      base.position.y = 0.08;
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.85, 16), this.mats.warmGlow);
      core.position.y = 0.58;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.56, 0.48, 4), this.mats.redLacquer);
      cap.rotation.y = Math.PI / 4;
      cap.position.y = 1.24;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.03, 8, 16), this.mats.gold);
      ring.position.y = 1.54;
      const glowLight = new THREE.PointLight(0xffb84d, 10, 6);
      glowLight.position.y = 0.65;
      lantern.add(base, core, cap, ring, glowLight);
      this.scene.add(lantern);
    });
  }

  createWreath() {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.25, 14, 36), this.mats.pine));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 10, 10),
        i % 2 === 0 ? this.mats.glassRed : this.mats.glassGold
      );
      orb.position.set(Math.cos(a) * 1.04, Math.sin(a) * 1.04, 0.22);
      g.add(orb);
    }
    const bowL = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.075, 10, 18), this.mats.redLacquer);
    bowL.position.set(-0.24, 1.14, 0.25);
    bowL.rotation.z = 0.4;
    const bowR = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.075, 10, 18), this.mats.redLacquer);
    bowR.position.set(0.24, 1.14, 0.25);
    bowR.rotation.z = -0.4;
    g.add(bowL, bowR);
    return g;
  }

  createBell() {
    const g = new THREE.Group();
    const pts = [
      new THREE.Vector2(0.02, 0.55),
      new THREE.Vector2(0.18, 0.48),
      new THREE.Vector2(0.24, 0.28),
      new THREE.Vector2(0.32, 0.08),
      new THREE.Vector2(0.42, 0.0),
      new THREE.Vector2(0.35, 0.0)
    ];
    const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 24), this.mats.gold);
    body.position.y = -0.55;
    const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), this.mats.deepGold);
    clapper.position.y = -0.56;
    const bow = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 10), this.mats.redLacquer);
    bow.position.y = 0.02;
    g.add(body, clapper, bow);
    return g;
  }

  createStocking() {
    const g = new THREE.Group();
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.23, 0.92, 16), this.mats.redLacquer);
    leg.position.y = -0.46;
    const foot = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.34, 8, 16), this.mats.redLacquer);
    foot.rotation.z = Math.PI / 2;
    foot.position.set(0.23, -0.92, 0);
    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.29, 0.25, 18), this.mats.snow);
    cuff.position.y = -0.02;
    g.add(leg, foot, cuff);
    return g;
  }

  createHollyCluster(scale = 1) {
    const g = new THREE.Group();
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(0.25, 0.12, 0.42, 0.04);
    leafShape.quadraticCurveTo(0.3, 0.22, 0.48, 0.35);
    leafShape.quadraticCurveTo(0.22, 0.36, 0, 0.56);
    leafShape.quadraticCurveTo(-0.22, 0.36, -0.48, 0.35);
    leafShape.quadraticCurveTo(-0.3, 0.22, -0.42, 0.04);
    leafShape.quadraticCurveTo(-0.25, 0.12, 0, 0);
    const leafGeo = new THREE.ExtrudeGeometry(leafShape, { depth: 0.04, bevelEnabled: false });

    for (let i = 0; i < 3; i++) {
      const leaf = new THREE.Mesh(leafGeo, this.mats.emerald);
      leaf.rotation.z = (i - 1) * 1.15;
      g.add(leaf);
    }
    [[0, 0.06, 0.09], [-0.09, -0.04, 0.09], [0.09, -0.04, 0.09]].forEach((bp) => {
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 10), this.mats.glassRed);
      berry.position.set(...bp);
      g.add(berry);
    });
    g.scale.setScalar(scale);
    return g;
  }

  buildWreathsStockingsBellsGarlands() {
    const wLeft = this.createWreath();
    wLeft.position.set(-4.6, 5.2, -7.2);
    const wRight = this.createWreath();
    wRight.position.set(4.6, 5.2, -7.2);
    this.scene.add(wLeft, wRight);

    [
      [-4.6, 5.2, -6.9],
      [4.6, 5.2, -6.9],
      [-7.8, 7.2, -6.8],
      [7.8, 7.2, -6.8]
    ].forEach((pos, idx) => {
      const bell = this.createBell();
      bell.position.set(...pos);
      bell.userData = { phase: idx * 1.1 };
      this.scene.add(bell);
      this.bells.push(bell);
    });

    [-6.1, -3.5, 3.5, 6.1].forEach((sx, idx) => {
      const stock = this.createStocking();
      stock.position.set(sx, 3.3, -6.9);
      stock.rotation.z = idx % 2 === 0 ? 0.08 : -0.08;
      this.scene.add(stock);
    });

    const garlandPts = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      const x = -11.5 + t * 23;
      const sag = Math.sin(t * Math.PI * 3) * 0.52;
      garlandPts.push(new THREE.Vector3(x, 7.9 - Math.abs(sag), -3.8));
    }
    const garlandCurve = new THREE.CatmullRomCurve3(garlandPts);
    this.scene.add(new THREE.Mesh(new THREE.TubeGeometry(garlandCurve, 64, 0.25, 10, false), this.mats.pine));

    for (let i = 1; i < 12; i++) {
      const p = garlandCurve.getPoint(i / 12);
      const holly = this.createHollyCluster(0.75);
      holly.position.set(p.x, p.y - 0.1, p.z + 0.25);
      this.scene.add(holly);
      if (i % 2 === 0) {
        const orb = new THREE.Mesh(
          new THREE.SphereGeometry(0.17, 12, 12),
          i % 4 === 0 ? this.mats.glassGold : this.mats.glassRed
        );
        orb.position.set(p.x, p.y - 0.35, p.z + 0.12);
        this.scene.add(orb);
      }
    }
  }

  createSnowyCottage(scale = 1) {
    const g = new THREE.Group();
    const walls = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.35, 1.45), this.mats.cottageWood);
    walls.position.y = 0.675;
    const roofL = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.16, 1.65), this.mats.snow);
    roofL.position.set(-0.52, 1.68, 0);
    roofL.rotation.z = 0.65;
    const roofR = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.16, 1.65), this.mats.snow);
    roofR.position.set(0.52, 1.68, 0);
    roofR.rotation.z = -0.65;
    const chim = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.72, 0.28), this.mats.burgundyVelvet);
    chim.position.set(0.45, 2.0, -0.2);

    const door = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.62, 0.08), this.mats.warmGlow);
    door.position.set(0, 0.34, 0.74);
    const winL = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.08), this.mats.warmGlow);
    winL.position.set(-0.52, 0.84, 0.74);
    const winR = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.08), this.mats.warmGlow);
    winR.position.set(0.52, 0.84, 0.74);

    g.add(walls, roofL, roofR, chim, door, winL, winR);
    g.scale.setScalar(scale);
    return g;
  }

  createSnowman(scale = 1) {
    const g = new THREE.Group();
    const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.48, 18, 14), this.mats.snow);
    b1.position.y = 0.44;
    const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 18, 14), this.mats.snow);
    b2.position.y = 1.06;
    const b3 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 14), this.mats.snow);
    b3.position.y = 1.54;
    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.06, 8, 18), this.mats.redLacquer);
    scarf.rotation.x = Math.PI / 2;
    scarf.position.y = 1.33;
    const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 16), this.mats.navyPanel);
    hatBrim.position.y = 1.76;
    const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.32, 16), this.mats.navyPanel);
    hatTop.position.y = 1.94;
    const carrot = new THREE.Mesh(
      new THREE.ConeGeometry(0.05, 0.28, 10),
      new THREE.MeshStandardMaterial({ color: 0xe86c1f, roughness: 0.6 })
    );
    carrot.rotation.x = Math.PI / 2;
    carrot.position.set(0, 1.54, 0.3);
    g.add(b1, b2, b3, scarf, hatBrim, hatTop, carrot);
    g.scale.setScalar(scale);
    return g;
  }

  buildWinterVillageShowcase() {
    // All-Christmas Winter Village foreground showcase for the Home Intro Stage
    this.villageShowcaseGroup = new THREE.Group();
    this.villageShowcaseGroup.position.set(0, 0.2, 2.8);

    const cottageL = this.createSnowyCottage(1.05);
    cottageL.position.set(-4.6, 0, -0.4);
    cottageL.rotation.y = 0.38;

    const cottageR = this.createSnowyCottage(1.1);
    cottageR.position.set(4.6, 0, -0.4);
    cottageR.rotation.y = -0.38;

    const snowman = this.createSnowman(0.95);
    snowman.position.set(-2.5, 0, 1.0);
    snowman.rotation.y = 0.28;

    // Festive foreground present pile on right
    const fgGift1 = this.createGiftBox(0.9, 0.72, 0.9, this.mats.redLacquer, this.mats.gold);
    fgGift1.position.set(2.5, 0, 1.1);
    fgGift1.rotation.y = -0.35;
    const fgGift2 = this.createGiftBox(0.68, 0.56, 0.68, this.mats.emerald, this.mats.gold);
    fgGift2.position.set(3.25, 0, 1.55);
    fgGift2.rotation.y = 0.42;

    this.villageShowcaseGroup.add(cottageL, cottageR, snowman, fgGift1, fgGift2);
    this.scene.add(this.villageShowcaseGroup);
  }

  buildExtruded3DSign() {
    this.heroSignGroup = new THREE.Group();
    this.heroSignGroup.position.set(0, 5.1, 1.8);

    const signTex = createChristmasFeudSignTexture();
    const faceMat = new THREE.MeshPhysicalMaterial({
      map: signTex, roughness: 0.22, metalness: 0.22, clearcoat: 0.85
    });

    const signBox = new THREE.Mesh(
      new THREE.BoxGeometry(6.8, 3.2, 0.52),
      [this.mats.gold, this.mats.gold, this.mats.gold, this.mats.gold, faceMat, this.mats.navyPanel]
    );
    const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(7.16, 3.54, 0.34), this.mats.gold);
    outerFrame.position.z = -0.14;
    this.heroSignGroup.add(signBox, outerFrame);

    // Sculpted 3D Santa Hat perched on the top-right corner of the sign!
    const hatGroup = new THREE.Group();
    hatGroup.position.set(2.95, 1.72, 0.18);
    hatGroup.rotation.z = -0.34;
    const hatBrim = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.16, 12, 24), this.mats.snow);
    hatBrim.rotation.x = Math.PI / 2;
    const hatCone = new THREE.Mesh(new THREE.ConeGeometry(0.52, 1.25, 20), this.mats.redLacquer);
    hatCone.position.y = 0.64;
    const pom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 14), this.mats.snow);
    pom.position.set(0.32, 1.15, 0.08);
    hatGroup.add(hatBrim, hatCone, pom);
    this.heroSignGroup.add(hatGroup);

    // Holly corner accents
    [[-3.35, 1.55, 0.3], [-3.35, -1.55, 0.3], [3.35, -1.55, 0.3]].forEach((c) => {
      const h = this.createHollyCluster(0.9);
      h.position.set(...c);
      this.heroSignGroup.add(h);
    });

    // Illuminated champagne-gold marquee perimeter bulbs
    const perim = [];
    for (let i = 0; i <= 12; i++) {
      const x = -3.45 + (i / 12) * 6.9;
      perim.push([x, 1.68], [x, -1.68]);
    }
    for (let j = 1; j <= 4; j++) {
      const y = -1.68 + (j / 5) * 3.36;
      perim.push([-3.45, y], [3.45, y]);
    }
    perim.forEach(([bx, by]) => {
      const bMat = new THREE.MeshStandardMaterial({
        color: 0xfff8e6, emissive: 0xe8c067, emissiveIntensity: 1.65
      });
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), bMat);
      b.position.set(bx, by, 0.28);
      b.userData = { bulbIndex: this.marqueeBulbs.length, mat: bMat };
      this.heroSignGroup.add(b);
      this.marqueeBulbs.push(b);
    });

    this.scene.add(this.heroSignGroup);
  }

  buildGoldenTrophy() {
    this.trophyGroup = new THREE.Group();
    this.trophyGroup.position.set(0, -10, 0.5);

    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.78, 0.55, 32), this.mats.burgundyVelvet);
    base1.position.y = 0.28;
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.58, 0.08, 10, 36), this.mats.gold);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.55;
    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.35, 0.45, 32), this.mats.gold);
    base2.position.y = 0.78;

    const cupPts = [
      new THREE.Vector2(0.05, 0.0),
      new THREE.Vector2(0.65, 0.08),
      new THREE.Vector2(0.28, 0.55),
      new THREE.Vector2(0.24, 1.1),
      new THREE.Vector2(0.55, 1.45),
      new THREE.Vector2(1.22, 2.2),
      new THREE.Vector2(1.48, 3.25),
      new THREE.Vector2(1.62, 3.5),
      new THREE.Vector2(1.38, 3.5),
      new THREE.Vector2(1.08, 2.25),
      new THREE.Vector2(0.05, 1.75)
    ];
    const chalice = new THREE.Mesh(new THREE.LatheGeometry(cupPts, 36), this.mats.glassGold);
    chalice.position.y = 1.0;

    [-1, 1].forEach((side) => {
      const hCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(side * 1.32, 3.9, 0),
        new THREE.Vector3(side * 2.15, 3.7, 0),
        new THREE.Vector3(side * 2.05, 2.65, 0),
        new THREE.Vector3(side * 0.95, 2.35, 0)
      ]);
      this.trophyGroup.add(new THREE.Mesh(new THREE.TubeGeometry(hCurve, 24, 0.11, 10, false), this.mats.gold));
    });

    const laurel = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.14, 10, 32), this.mats.emerald);
    laurel.rotation.x = Math.PI / 2;
    laurel.position.y = 0.95;

    this.trophyGroup.add(base1, baseRing, base2, chalice, laurel);
    this.scene.add(this.trophyGroup);
  }

  buildSnowAndParticles() {
    const snowTex = createSnowflakeTexture();
    const snowCount = this.quality === 'ultra' ? 420 : 180;
    const pos = new Float32Array(snowCount * 3);
    const vel = new Float32Array(snowCount * 3);
    for (let i = 0; i < snowCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = Math.random() * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 24 - 2;
      vel[i * 3] = (Math.random() - 0.5) * 0.25;
      vel[i * 3 + 1] = 0.42 + Math.random() * 0.72;
      vel[i * 3 + 2] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      map: snowTex, color: 0xfaf5eb, size: 0.34, transparent: true, opacity: 0.85,
      depthWrite: false, blending: THREE.AdditiveBlending
    });
    this.snowSystem = new THREE.Points(geo, mat);
    this.snowSystem.userData = { vel, count: snowCount };
    this.scene.add(this.snowSystem);

    const dustCount = this.quality === 'ultra' ? 120 : 50;
    const dPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 24;
      dPos[i * 3 + 1] = 0.5 + Math.random() * 10;
      dPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    this.stardustSystem = new THREE.Points(
      dGeo,
      new THREE.PointsMaterial({
        color: 0xe8c067, size: 0.13, transparent: true, opacity: 0.45,
        depthWrite: false, blending: THREE.AdditiveBlending
      })
    );
    this.scene.add(this.stardustSystem);
  }

  buildConfettiSystem() {
    const count = 240;
    const geo = new THREE.PlaneGeometry(0.22, 0.12);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.65, side: THREE.DoubleSide });
    this.confettiMesh = new THREE.InstancedMesh(geo, mat, count);
    this.confettiMesh.visible = false;
    const colors = [
      new THREE.Color(PALETTE.champagne),
      new THREE.Color(PALETTE.crimson),
      new THREE.Color(PALETTE.emerald),
      new THREE.Color(PALETTE.ivory)
    ];
    this.confettiData = [];
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      this.confettiMesh.setColorAt(i, colors[i % colors.length]);
      this.confettiData.push({
        x: (Math.random() - 0.5) * 16, y: 8 + Math.random() * 8, z: (Math.random() - 0.5) * 8 + 2,
        vy: 1.5 + Math.random() * 2.4, vx: (Math.random() - 0.5) * 1.4,
        rx: Math.random() * 6, ry: Math.random() * 6, rz: Math.random() * 6, vr: 2 + Math.random() * 5
      });
      dummy.position.set(0, -50, 0);
      dummy.updateMatrix();
      this.confettiMesh.setMatrixAt(i, dummy.matrix);
    }
    this.confettiMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.confettiMesh);
  }

  setMode(mode) {
    this.mode = mode || 'home';
    if (this.usingFallback) return;
    if (this.mode === 'home') {
      this.camTargetPos.set(0, 3.3, 13.8);
      this.camTargetLook.set(0, 3.0, 0);
    } else if (this.mode === 'game') {
      this.camTargetPos.set(0, 4.4, 16.0);
      this.camTargetLook.set(0, 3.6, -3.0);
    } else if (this.mode === 'fastmoney') {
      this.camTargetPos.set(0, 4.1, 15.0);
      this.camTargetLook.set(0, 3.7, -3.5);
    } else if (this.mode === 'winner') {
      this.camTargetPos.set(0, 3.1, 11.4);
      this.camTargetLook.set(0, 2.9, 0.5);
      this.triggerCelebration(12);
    } else if (this.mode === 'studio') {
      this.camTargetPos.set(0, 5.2, 16.5);
      this.camTargetLook.set(0, 3.6, -4.0);
    }
  }

  triggerRevealBurst() { this.flashGold = 0.9; }
  triggerStrikeFlash(isMax = false) { this.flashRed = isMax ? 1.5 : 0.95; }

  triggerCelebration(seconds = 9) {
    this.confettiActive = Math.max(this.confettiActive, seconds);
    this.flashGold = 1.1;
    this.confettiData.forEach((p) => {
      p.x = (Math.random() - 0.5) * 14;
      p.y = 7 + Math.random() * 9;
      p.z = (Math.random() - 0.5) * 7 + 2;
    });
  }

  onResize() {
    if (this.usingFallback) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      return;
    }
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
    this.camera.updateProjectionMatrix();
    this.applyRendererQuality();
  }

  animateWebGL() {
    if (!this.running || !this.renderer) return;
    this.animId = requestAnimationFrame(() => this.animateWebGL());

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    this.camera.position.x += (this.camTargetPos.x + this.pointerX * 0.4 - this.camera.position.x) * Math.min(1, dt * 3.0);
    this.camera.position.y += (this.camTargetPos.y - this.pointerY * 0.22 - this.camera.position.y) * Math.min(1, dt * 3.0);
    this.camera.position.z += (this.camTargetPos.z - this.camera.position.z) * Math.min(1, dt * 3.0);
    this.currentLook.lerp(this.camTargetLook, Math.min(1, dt * 3.0));
    this.camera.lookAt(this.currentLook);

    if (this.heroSignGroup) {
      const targetY = this.mode === 'home' ? 5.1 + Math.sin(t * 1.3) * 0.07 : 13.8;
      this.heroSignGroup.position.y += (targetY - this.heroSignGroup.position.y) * Math.min(1, dt * 4.5);
      this.heroSignGroup.rotation.y = Math.sin(t * 0.65) * 0.055;
      this.heroSignGroup.visible = this.heroSignGroup.position.y < 12.6;
    }
    if (this.villageShowcaseGroup) {
      const targetY = this.mode === 'home' ? 0.2 : -4.4;
      this.villageShowcaseGroup.position.y += (targetY - this.villageShowcaseGroup.position.y) * Math.min(1, dt * 4.0);
      this.villageShowcaseGroup.visible = this.villageShowcaseGroup.position.y > -3.6;
    }
    if (this.trophyGroup) {
      const showTrophy = this.mode === 'winner' || (this.mode === 'fastmoney' && this.confettiActive > 0);
      const targetY = showTrophy ? 0.65 + Math.sin(t * 1.8) * 0.1 : -8.5;
      this.trophyGroup.position.y += (targetY - this.trophyGroup.position.y) * Math.min(1, dt * 4.0);
      this.trophyGroup.rotation.y += dt * 0.85;
      this.trophyGroup.visible = this.trophyGroup.position.y > -7.2;
    }

    const chaseStep = Math.floor(t * (this.mode === 'winner' ? 9 : 4.5));
    for (let i = 0; i < this.marqueeBulbs.length; i++) {
      this.marqueeBulbs[i].userData.mat.emissiveIntensity = (i + chaseStep) % 3 !== 0 ? 1.75 : 0.35;
    }
    for (let i = 0; i < this.treeLights.length; i++) {
      const l = this.treeLights[i];
      l.userData.mat.emissiveIntensity = 0.75 + 0.85 * (0.5 + 0.5 * Math.sin(t * 2.6 + l.userData.phase));
    }

    const sweepSpeed = this.mode === 'winner' || this.confettiActive > 0 ? 1.7 : 0.55;
    this.spotCones.forEach((cone) => {
      const ud = cone.userData;
      cone.rotation.z = ud.baseRotZ + Math.sin(t * sweepSpeed + ud.phase) * 0.16;
      ud.mat.opacity = ud.baseOpacity + this.flashGold * 0.06 + this.flashRed * 0.05;
    });

    this.flashRed = Math.max(0, this.flashRed - dt * 1.6);
    this.redSpot.intensity = 65 + this.flashRed * 170;
    this.flashGold = Math.max(0, this.flashGold - dt * 1.8);
    this.keyLight.intensity = 80 + this.flashGold * 100;

    this.bells.forEach((bell) => {
      bell.rotation.z = Math.sin(t * 1.5 + bell.userData.phase) * 0.12;
    });

    if (this.snowSystem) {
      const posAttr = this.snowSystem.geometry.attributes.position;
      const arr = posAttr.array;
      const { vel, count } = this.snowSystem.userData;
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] -= vel[i * 3 + 1] * dt;
        arr[i * 3] += Math.sin(t * 0.75 + vel[i * 3 + 2]) * 0.25 * dt;
        if (arr[i * 3 + 1] < -0.5) {
          arr[i * 3 + 1] = 14.5;
          arr[i * 3] = (Math.random() - 0.5) * 32;
        }
      }
      posAttr.needsUpdate = true;
    }

    if (this.stardustSystem) this.stardustSystem.rotation.y = t * 0.035;

    if (this.confettiMesh) {
      if (this.confettiActive > 0) {
        this.confettiActive = Math.max(0, this.confettiActive - dt);
        this.confettiMesh.visible = true;
        const dummy = new THREE.Object3D();
        for (let i = 0; i < this.confettiData.length; i++) {
          const p = this.confettiData[i];
          p.y -= p.vy * dt;
          p.x += (p.vx + Math.sin(t * 2 + i) * 0.5) * dt;
          p.rx += p.vr * dt;
          p.ry += p.vr * 0.8 * dt;
          if (p.y < -0.4 && this.confettiActive > 1.5) {
            p.y = 10 + Math.random() * 5;
            p.x = (Math.random() - 0.5) * 14;
          }
          dummy.position.set(p.x, p.y, p.z);
          dummy.rotation.set(p.rx, p.ry, p.rz);
          dummy.updateMatrix();
          this.confettiMesh.setMatrixAt(i, dummy.matrix);
        }
        this.confettiMesh.instanceMatrix.needsUpdate = true;
      } else {
        this.confettiMesh.visible = false;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  initFallback2D() {
    this.usingFallback = true;
    const ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const flakes = Array.from({ length: 85 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: 1.5 + Math.random() * 3.0, s: 0.4 + Math.random() * 1.1
    }));
    const draw = () => {
      if (!this.usingFallback || !this.running) return;
      this.animId = requestAnimationFrame(draw);
      const w = this.canvas.width;
      const h = this.canvas.height;
      const g = ctx.createRadialGradient(w * 0.5, h * 0.25, 40, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
      g.addColorStop(0, '#6B0E1D');
      g.addColorStop(0.55, '#340710');
      g.addColorStop(1, '#08261B');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(250, 245, 235, 0.72)';
      flakes.forEach((f) => {
        f.y += f.s;
        if (f.y > h) { f.y = -6; f.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    draw();
  }
}

