import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getBengaliProductDetails } from '../toy-world/bengaliToyData';

export interface Store3DCanvasProps {
  products: any[];
  walkProgress: number; // 0 (entrance) to 1 (back of shop)
  onWalkProgressChange: (newProgress: number) => void;
  onSelectProduct: (product: any) => void;
  onHoverProductChange?: (product: any | null, screenPos?: { x: number; y: number }) => void;
}

interface ProductMeshItem {
  boxMesh: THREE.Mesh;
  product: any;
  shelfPosition: THREE.Vector3;
  shelfRotationY: number;
}

export const Store3DCanvas: React.FC<Store3DCanvasProps> = ({
  products,
  walkProgress,
  onWalkProgressChange,
  onSelectProduct,
  onHoverProductChange,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const productItemsRef = useRef<ProductMeshItem[]>([]);
  const hoveredItemRef = useRef<ProductMeshItem | null>(null);

  // Smooth camera position and look-at targets
  const currentZRef = useRef<number>(2.2);
  const targetZRef = useRef<number>(2.2);
  const currentYawRef = useRef<number>(0);
  const targetYawRef = useRef<number>(0);
  const currentPitchRef = useRef<number>(0);
  const targetPitchRef = useRef<number>(0);

  // Mouse & Touch drag tracking for smooth panning
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Compact, intimate boutique aisle length (14.5 meters instead of 26 meters!)
  const aisleLength = 14.5;
  useEffect(() => {
    targetZRef.current = 2.2 - walkProgress * (aisleLength - 1.2);
  }, [walkProgress]);

  // Procedural Colorful Kids Playmat Puzzle Floor Texture
  const createPlayfulPuzzleFloorTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const tileColors = ['#FFE66D', '#4ECDC4', '#FF6B6B', '#A8DADC', '#F7D070', '#C5A3FF'];
    const tileSize = 256;

    for (let y = 0; y < 1024; y += tileSize) {
      for (let x = 0; x < 1024; x += tileSize) {
        const colorIdx = ((x / tileSize) + (y / tileSize) * 3) % tileColors.length;
        ctx.fillStyle = tileColors[colorIdx];
        ctx.fillRect(x, y, tileSize, tileSize);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 6;
        ctx.strokeRect(x + 3, y + 3, tileSize - 6, tileSize - 6);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 4;
        ctx.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

        // Cute playful motif
        ctx.save();
        ctx.translate(x + tileSize / 2, y + tileSize / 2);
        const motifType = (x + y) % 3;
        if (motifType === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(Math.cos((18 + s * 72) * 0.01745) * 28, -Math.sin((18 + s * 72) * 0.01745) * 28);
            ctx.lineTo(Math.cos((54 + s * 72) * 0.01745) * 13, -Math.sin((54 + s * 72) * 0.01745) * 13);
          }
          ctx.closePath();
          ctx.fill();
        } else if (motifType === 1) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.beginPath();
          ctx.arc(0, 0, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.arc(-14, 4, 14, 0, Math.PI * 2);
          ctx.arc(14, 4, 14, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(-10, -7, 12, Math.PI, 0, false);
          ctx.arc(10, -7, 12, Math.PI, 0, false);
          ctx.lineTo(0, 19);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.5, 6);
    return tex;
  };

  // Ceiling Texture (Soft sky blue with cartoon clouds & twinkling stars)
  const createSkyCeilingTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = '#E3F2FD';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const drawCloud = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.arc(cx - 24, cy + 6, 22, 0, Math.PI * 2);
      ctx.arc(cx + 24, cy + 6, 22, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCloud(120, 140);
    drawCloud(380, 100);
    drawCloud(260, 360);

    ctx.fillStyle = '#FFD166';
    const drawStar = (sx: number, sy: number) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fill();
    };
    drawStar(70, 70);
    drawStar(420, 240);
    drawStar(180, 260);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 6);
    return tex;
  };

  // Entrance Welcome Banner
  const createGlowingSignTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, '#FF3366');
    grad.addColorStop(0.3, '#FF9F1C');
    grad.addColorStop(0.7, '#2EC4B6');
    grad.addColorStop(1, '#8338EC');
    ctx.fillStyle = grad;
    ctx.roundRect(16, 16, 992, 224, 28);
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 8;
    ctx.roundRect(16, 16, 992, 224, 28);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 54px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌈 GROWKINS TOY WONDERLAND 🎪', 512, 105);

    ctx.fillStyle = '#FFF8E7';
    ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
    ctx.fillText('বাচ্চাদের হাসিমুখ ও আনন্দের রঙিন দুনিয়া', 512, 175);

    return new THREE.CanvasTexture(canvas);
  };

  // Instant High-Impact Toy Packaging Texture
  const createInstantToyBoxTexture = (prod: any, loadedImg?: HTMLImageElement) => {
    const bData = getBengaliProductDetails(prod);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = '#FFF9EC';
    ctx.fillRect(0, 0, 512, 512);

    ctx.lineWidth = 14;
    ctx.strokeStyle = '#FF5964';
    ctx.strokeRect(7, 7, 498, 498);

    ctx.fillStyle = '#35A7FF';
    ctx.fillRect(14, 14, 484, 56);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ GROWKINS PREMIUM TOYS ✨', 256, 50);

    const imgX = 24;
    const imgY = 80;
    const imgW = 464;
    const imgH = 332;

    if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
      ctx.drawImage(loadedImg, imgX, imgY, imgW, imgH);
      const gloss = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
      gloss.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
      gloss.addColorStop(0.3, 'rgba(255, 255, 255, 0.0)');
      gloss.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
      ctx.fillStyle = gloss;
      ctx.fillRect(imgX, imgY, imgW, imgH);
    } else {
      const artGrad = ctx.createLinearGradient(imgX, imgY, imgX, imgY + imgH);
      artGrad.addColorStop(0, '#FFE3E3');
      artGrad.addColorStop(1, '#FFC2D1');
      ctx.fillStyle = artGrad;
      ctx.fillRect(imgX, imgY, imgW, imgH);

      ctx.fillStyle = '#FF5964';
      ctx.font = 'bold 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧸', 256, 255);

      ctx.fillStyle = '#1D3557';
      ctx.font = 'bold 26px "Hind Siliguri", sans-serif';
      ctx.fillText(bData.bName.slice(0, 14) || 'গ্রো কিন্স খেলনা', 256, 320);
    }

    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 4;
    ctx.strokeRect(imgX, imgY, imgW, imgH);

    ctx.fillStyle = '#1D3557';
    ctx.fillRect(14, 420, 484, 78);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 25px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    const rawName = bData.bName || prod.name || 'শিক্ষণীয় খেলনা';
    const shortName = rawName.length > 17 ? rawName.slice(0, 16) + '…' : rawName;
    ctx.fillText(shortName, 26, 468);

    const priceText = `৳${prod.price || 750}`;
    ctx.fillStyle = '#FF5964';
    ctx.roundRect(355, 432, 130, 54, 14);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(priceText, 420, 470);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // Main Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth || 800;
    const height = container.clientHeight || window.innerHeight || 600;
    const isPortrait = width < height;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#FFFDF9');
    scene.fog = new THREE.FogExp2(0xFFFDF9, 0.022);

    // 2. Camera with Adaptive Field of View for Mobile vs Desktop
    // On portrait mobile (isPortrait): use wider 68° FOV so both shelves are easily visible!
    const cameraFOV = isPortrait ? 68 : 52;
    const camera = new THREE.PerspectiveCamera(cameraFOV, width / height, 0.1, 100);
    camera.position.set(0, 1.45, currentZRef.current);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Vibrant Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xFFFBE6, 1.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFF4D6, 1.4);
    mainLight.position.set(2, 9, 7);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.0004;
    scene.add(mainLight);

    // Colorful Hanging Lantern Globes
    const globeColors = [0xFF5964, 0xFFD166, 0x06D6A0, 0x118AB2, 0x9B5DE5];
    for (let z = 2; z >= -aisleLength; z -= 3.8) {
      const gColor = globeColors[Math.abs(Math.floor(z / 3.8)) % globeColors.length];

      const lampPoint = new THREE.PointLight(gColor, 0.85, 7.5);
      lampPoint.position.set(0, 3.1, z);
      scene.add(lampPoint);

      const chainGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.6, 8);
      const chainMat = new THREE.MeshStandardMaterial({ color: 0xFFD166, metalness: 0.8 });
      const chain = new THREE.Mesh(chainGeo, chainMat);
      chain.position.set(0, 3.4, z);
      scene.add(chain);

      const globeGeo = new THREE.SphereGeometry(0.28, 16, 16);
      const globeMat = new THREE.MeshStandardMaterial({
        color: gColor,
        roughness: 0.2,
        emissive: gColor,
        emissiveIntensity: 0.35,
      });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      globe.position.set(0, 3.05, z);
      scene.add(globe);
    }

    // Festive Garland Flags along ceiling
    const flagColors = [0xFF5964, 0xFFD166, 0x06D6A0, 0x35A7FF, 0x9B5DE5];
    for (let z = 1.5; z >= -aisleLength; z -= 3.0) {
      for (let fx = -2.0; fx <= 2.0; fx += 0.45) {
        const flagColor = flagColors[Math.abs(Math.floor((fx + 2.5) * 2)) % flagColors.length];
        const flagGeo = new THREE.ConeGeometry(0.12, 0.22, 3);
        const flagMat = new THREE.MeshBasicMaterial({ color: flagColor, side: THREE.DoubleSide });
        const flag = new THREE.Mesh(flagGeo, flagMat);
        flag.position.set(fx, 3.65 - Math.cos((fx / 2.2) * (Math.PI / 2)) * 0.18, z);
        flag.rotation.x = Math.PI;
        scene.add(flag);
      }
    }

    // 5. Room Interior Architecture (Cozy boutique width: 5.8m instead of 8m!)
    const roomWidth = 5.8;

    // Floor
    const floorGeo = new THREE.PlaneGeometry(roomWidth, aisleLength + 6);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createPlayfulPuzzleFloorTexture(),
      roughness: 0.28,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -(aisleLength / 2 - 1.5));
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(roomWidth, aisleLength + 6);
    const ceilingMat = new THREE.MeshStandardMaterial({
      map: createSkyCeilingTexture(),
      roughness: 0.9,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 3.8, -(aisleLength / 2 - 1.5));
    scene.add(ceiling);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xFFFBF2, roughness: 0.8 });

    const sideWallGeo = new THREE.PlaneGeometry(aisleLength + 6, 4.0);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomWidth / 2, 1.9, -(aisleLength / 2 - 1.5));
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomWidth / 2, 1.9, -(aisleLength / 2 - 1.5));
    scene.add(rightWall);

    const backWallGeo = new THREE.PlaneGeometry(roomWidth, 4.0);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 1.9, -aisleLength - 1.2);
    scene.add(backWall);

    // Back Poster
    const backPosterGeo = new THREE.PlaneGeometry(3.8, 1.7);
    const backPosterMat = new THREE.MeshBasicMaterial({
      map: createGlowingSignTexture(),
    });
    const backPoster = new THREE.Mesh(backPosterGeo, backPosterMat);
    backPoster.position.set(0, 2.1, -aisleLength - 1.15);
    scene.add(backPoster);

    // ================= 6. GLOWING ENTRANCE ARCH =================
    const archGroup = new THREE.Group();

    const archCurve = new THREE.TorusGeometry(2.4, 0.35, 20, 36, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.2,
      metalness: 0.05,
    });
    const archMesh = new THREE.Mesh(archCurve, archMat);
    archMesh.position.set(0, 0.2, 2.0);
    archGroup.add(archMesh);

    const neonCurve = new THREE.TorusGeometry(2.3, 0.08, 14, 36, Math.PI);
    const neonMat = new THREE.MeshBasicMaterial({ color: 0x00F0FF });
    const neonMesh = new THREE.Mesh(neonCurve, neonMat);
    neonMesh.position.set(0, 0.2, 2.02);
    archGroup.add(neonMesh);

    const entranceSignGeo = new THREE.PlaneGeometry(3.8, 1.2);
    const entranceSignMat = new THREE.MeshBasicMaterial({
      map: createGlowingSignTexture(),
      side: THREE.DoubleSide,
    });
    const entranceSign = new THREE.Mesh(entranceSignGeo, entranceSignMat);
    entranceSign.position.set(0, 2.8, 1.8);
    archGroup.add(entranceSign);

    scene.add(archGroup);

    // Cute Toys on Floor near Entrance
    const rockerBaseGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.2, 16);
    const rockerBaseMat = new THREE.MeshStandardMaterial({ color: 0xFF5964 });
    const rockerBase = new THREE.Mesh(rockerBaseGeo, rockerBaseMat);
    rockerBase.position.set(-1.8, 0.12, 1.0);
    scene.add(rockerBase);

    const toyBinGeo = new THREE.BoxGeometry(0.5, 0.38, 0.5);
    const toyBinMat = new THREE.MeshStandardMaterial({ color: 0x70E000 });
    const toyBin = new THREE.Mesh(toyBinGeo, toyBinMat);
    toyBin.position.set(1.8, 0.19, 1.0);
    scene.add(toyBin);

    // ================= 7. COLORFUL HOUSE-SHAPED SHELVING UNITS (Cozy Spacing!) =================
    const bayColors = [
      0xFFD166, // Yellow
      0x2EC4B6, // Mint Teal
      0xFF5964, // Coral
      0x35A7FF, // Sky Blue
      0x9B5DE5, // Lilac
      0xFB8500, // Orange
    ];

    const shelfDepth = 0.52;
    const shelfBayWidth = 1.95; // Compact, cozy width
    const tierHeights = [0.25, 0.95, 1.65, 2.35];

    const createHouseShelfBay = (x: number, z: number, isLeft: boolean, bayIdx: number) => {
      const bayGroup = new THREE.Group();
      const houseColor = bayColors[bayIdx % bayColors.length];

      const frameMat = new THREE.MeshStandardMaterial({
        color: houseColor,
        roughness: 0.3,
        metalness: 0.05,
      });

      const whiteBackMat = new THREE.MeshStandardMaterial({
        color: 0xFFFDF7,
        roughness: 0.8,
      });

      const ledGlowMat = new THREE.MeshBasicMaterial({
        color: 0xFFFBE6,
      });

      // Back Panel
      const backGeo = new THREE.BoxGeometry(shelfBayWidth, 2.6, 0.03);
      const backPanel = new THREE.Mesh(backGeo, whiteBackMat);
      backPanel.position.set(0, 1.3, -shelfDepth / 2 + 0.015);
      bayGroup.add(backPanel);

      // House Pointed Gable Roof
      const roofGeo = new THREE.ConeGeometry(shelfBayWidth * 0.65, 0.65, 4);
      const roofMesh = new THREE.Mesh(roofGeo, frameMat);
      roofMesh.position.set(0, 2.92, 0);
      roofMesh.rotation.y = Math.PI / 4;
      bayGroup.add(roofMesh);

      // Roof Attic Window
      const windowGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
      const windowMat = new THREE.MeshBasicMaterial({ color: 0xFFF3C4 });
      const windowMesh = new THREE.Mesh(windowGeo, windowMat);
      windowMesh.rotation.x = Math.PI / 2;
      windowMesh.position.set(0, 2.82, 0.05);
      bayGroup.add(windowMesh);

      // Vertical Posts
      const postGeo = new THREE.BoxGeometry(0.07, 2.6, shelfDepth);
      const postL = new THREE.Mesh(postGeo, frameMat);
      postL.position.set(-shelfBayWidth / 2, 1.3, 0);
      postL.castShadow = true;
      bayGroup.add(postL);

      const postR = new THREE.Mesh(postGeo, frameMat);
      postR.position.set(shelfBayWidth / 2, 1.3, 0);
      postR.castShadow = true;
      bayGroup.add(postR);

      // Shelves with LED lights
      tierHeights.forEach((y) => {
        const tierGeo = new THREE.BoxGeometry(shelfBayWidth, 0.045, shelfDepth);
        const tier = new THREE.Mesh(tierGeo, frameMat);
        tier.position.set(0, y, 0);
        tier.receiveShadow = true;
        bayGroup.add(tier);

        if (y > 0.3) {
          const ledGeo = new THREE.BoxGeometry(shelfBayWidth - 0.1, 0.02, 0.03);
          const ledStrip = new THREE.Mesh(ledGeo, ledGlowMat);
          ledStrip.position.set(0, y - 0.03, shelfDepth / 2 - 0.03);
          bayGroup.add(ledStrip);
        }

        const lipGeo = new THREE.BoxGeometry(shelfBayWidth, 0.035, 0.02);
        const lipMat = new THREE.MeshStandardMaterial({ color: 0xFFD166, metalness: 0.3 });
        const lip = new THREE.Mesh(lipGeo, lipMat);
        lip.position.set(0, y + 0.02, shelfDepth / 2);
        bayGroup.add(lip);
      });

      bayGroup.position.set(x, 0, z);
      bayGroup.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
      scene.add(bayGroup);
    };

    // Shelves placed closely at x = -1.55 and +1.55!
    // Aisle is 2.5m wide — cozy and immediate!
    let bayCount = 0;
    const shelfX = 1.55;
    for (let z = 0; z >= -aisleLength + 1.5; z -= 2.15) {
      createHouseShelfBay(-shelfX, z, true, bayCount);
      createHouseShelfBay(shelfX, z, false, bayCount + 1);
      bayCount += 2;
    }

    // ================= 8. DENSELY PACKED TOYS DIRECTLY FACING THE USER =================
    const productMeshList: ProductMeshItem[] = [];

    // Dense shelf slots: 3 products side-by-side per tier with NO huge gaps!
    // Offsets inside bay: -0.52, 0.0, +0.52
    const shelfSlots: { x: number; y: number; z: number; rotY: number; isLeft: boolean }[] = [];
    let currentBayZ = 0;

    while (currentBayZ >= -aisleLength + 1.5) {
      // Offsets along bay length
      const offsets = [-0.52, 0.0, 0.52];

      // Left Shelf (x = -1.25)
      // Eye-level tier (y = 1.675)
      offsets.forEach((oz) => {
        shelfSlots.push({ x: -1.25, y: 1.675, z: currentBayZ + oz, rotY: -0.42, isLeft: true });
      });
      // Waist-level tier (y = 0.975)
      offsets.forEach((oz) => {
        shelfSlots.push({ x: -1.25, y: 0.975, z: currentBayZ + oz, rotY: -0.42, isLeft: true });
      });

      // Right Shelf (x = 1.25)
      // Eye-level tier (y = 1.675)
      offsets.forEach((oz) => {
        shelfSlots.push({ x: 1.25, y: 1.675, z: currentBayZ - oz, rotY: 0.42, isLeft: false });
      });
      // Waist-level tier (y = 0.975)
      offsets.forEach((oz) => {
        shelfSlots.push({ x: 1.25, y: 0.975, z: currentBayZ - oz, rotY: 0.42, isLeft: false });
      });

      currentBayZ -= 2.15;
    }

    products.forEach((prod, idx) => {
      if (idx >= shelfSlots.length) return;
      const slot = shelfSlots[idx];

      const imgUrl = prod.featuredImage || prod.images?.main || (Array.isArray(prod.images) ? prod.images[0]?.url : '/items/busy-cube.jfif');

      // Compact, dense toy packaging (W: 0.46m, H: 0.45m, D: 0.16m)
      const boxW = 0.46;
      const boxH = 0.45;
      const boxD = 0.16;

      const boxGeo = new THREE.BoxGeometry(boxW, boxH, boxD);

      const initialTex = createInstantToyBoxTexture(prod);

      const toyFaceMat = new THREE.MeshStandardMaterial({
        map: initialTex,
        roughness: 0.2,
        metalness: 0.05,
      });

      const sidePackagingMat = new THREE.MeshStandardMaterial({
        color: 0xFFF3C4,
        roughness: 0.35,
      });

      const topPackagingMat = new THREE.MeshStandardMaterial({
        color: 0xFF5964,
        roughness: 0.3,
      });

      const materials = [
        slot.isLeft ? toyFaceMat : sidePackagingMat, // +X
        slot.isLeft ? sidePackagingMat : toyFaceMat, // -X
        topPackagingMat,                              // +Y
        sidePackagingMat,                             // -Y
        toyFaceMat,                                   // +Z (Directly facing user!)
        sidePackagingMat,                             // -Z
      ];

      const productBox = new THREE.Mesh(boxGeo, materials as any);

      if (imgUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const updatedTex = createInstantToyBoxTexture(prod, img);
          toyFaceMat.map = updatedTex;
          toyFaceMat.needsUpdate = true;
        };
        img.src = imgUrl;
      }

      const restingY = slot.y + boxH / 2;
      productBox.position.set(slot.x, restingY, slot.z);
      productBox.rotation.y = slot.rotY;

      productBox.castShadow = true;
      productBox.receiveShadow = true;

      const shadowPadGeo = new THREE.PlaneGeometry(boxW * 0.98, boxD * 0.98);
      const shadowPadMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.28,
      });
      const shadowPad = new THREE.Mesh(shadowPadGeo, shadowPadMat);
      shadowPad.rotation.x = -Math.PI / 2;
      shadowPad.position.set(0, -boxH / 2 + 0.005, 0);
      productBox.add(shadowPad);

      const pedestalGeo = new THREE.BoxGeometry(boxW * 1.05, 0.025, boxD * 1.05);
      const pedestalMat = new THREE.MeshStandardMaterial({ color: 0xFFD166, metalness: 0.4, roughness: 0.3 });
      const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestal.position.set(0, -boxH / 2 + 0.012, 0);
      productBox.add(pedestal);

      scene.add(productBox);

      productMeshList.push({
        boxMesh: productBox,
        product: prod,
        shelfPosition: new THREE.Vector3(slot.x, restingY, slot.z),
        shelfRotationY: slot.rotY,
      });
    });

    productItemsRef.current = productMeshList;

    // ================= 9. RAYCASTER & INTERACTION (MOUSE + MOBILE TOUCH) =================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - lastMousePosRef.current.x;
        const deltaY = e.clientY - lastMousePosRef.current.y;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };

        targetYawRef.current -= deltaX * 0.0025;
        targetPitchRef.current -= deltaY * 0.0018;

        targetYawRef.current = Math.max(-0.55, Math.min(0.55, targetYawRef.current));
        targetPitchRef.current = Math.max(-0.25, Math.min(0.25, targetPitchRef.current));
      }

      raycaster.setFromCamera(mouse, camera);
      const candidateBoxes = productItemsRef.current.map((item) => item.boxMesh);
      const hits = raycaster.intersectObjects(candidateBoxes, false);

      if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh;
        const found = productItemsRef.current.find((item) => item.boxMesh === hitMesh);

        if (found) {
          if (hoveredItemRef.current !== found) {
            hoveredItemRef.current = found;
            renderer.domElement.style.cursor = 'pointer';
            onHoverProductChange?.(found.product, { x: e.clientX, y: e.clientY });
          }
        }
      } else {
        if (hoveredItemRef.current) {
          hoveredItemRef.current = null;
          renderer.domElement.style.cursor = isDraggingRef.current ? 'grabbing' : 'default';
          onHoverProductChange?.(null);
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handlePointerUp = (e: MouseEvent) => {
      const wasDrag = Math.abs(e.clientX - lastMousePosRef.current.x) > 6 || Math.abs(e.clientY - lastMousePosRef.current.y) > 6;
      isDraggingRef.current = false;
      renderer.domElement.style.cursor = hoveredItemRef.current ? 'pointer' : 'default';

      if (!wasDrag && hoveredItemRef.current) {
        onSelectProduct(hoveredItemRef.current.product);
      }
    };

    // Desktop Mouse Wheel Scroll
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0006;
      const currentWalk = (2.2 - targetZRef.current) / (aisleLength - 1.2);
      const nextWalk = Math.max(0, Math.min(1, currentWalk + delta));
      onWalkProgressChange(nextWalk);
    };

    // Mobile Touch Navigation (Swipe Up/Down to Walk, Drag to Look, Tap to Open)
    let touchStartY = 0;
    let touchStartX = 0;
    let isTouchMoving = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        isTouchMoving = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaY = e.touches[0].clientY - touchStartY;
        const deltaX = e.touches[0].clientX - touchStartX;

        if (Math.abs(deltaY) > 6 || Math.abs(deltaX) > 6) {
          isTouchMoving = true;
          // Swipe up moves camera forward
          const walkDelta = -deltaY * 0.0022;
          const currentWalk = (2.2 - targetZRef.current) / (aisleLength - 1.2);
          const nextWalk = Math.max(0, Math.min(1, currentWalk + walkDelta));
          onWalkProgressChange(nextWalk);
          touchStartY = e.touches[0].clientY;

          // Pan horizontally slightly
          targetYawRef.current -= deltaX * 0.003;
          targetYawRef.current = Math.max(-0.55, Math.min(0.55, targetYawRef.current));
          touchStartX = e.touches[0].clientX;
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isTouchMoving && e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const candidateBoxes = productItemsRef.current.map((item) => item.boxMesh);
        const hits = raycaster.intersectObjects(candidateBoxes, false);
        if (hits.length > 0) {
          const hitMesh = hits[0].object as THREE.Mesh;
          const found = productItemsRef.current.find((item) => item.boxMesh === hitMesh);
          if (found) {
            onSelectProduct(found.product);
          }
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', handlePointerMove);
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Touch events for mobile phones & tablets
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    domElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    domElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    // ================= 10. ULTRA-SMOOTH RENDER LOOP =================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);

      const smoothFactor = 1.0 - Math.pow(0.001, delta);
      currentZRef.current += (targetZRef.current - currentZRef.current) * smoothFactor;
      camera.position.z = currentZRef.current;

      currentYawRef.current += (targetYawRef.current - currentYawRef.current) * (smoothFactor * 1.5);
      currentPitchRef.current += (targetPitchRef.current - currentPitchRef.current) * (smoothFactor * 1.5);

      camera.rotation.set(0, 0, 0);
      camera.rotation.y = currentYawRef.current;
      camera.rotation.x = currentPitchRef.current;

      productItemsRef.current.forEach((item) => {
        const isHovered = hoveredItemRef.current === item;
        const targetPull = isHovered ? 0.08 : 0.0;
        const targetScale = isHovered ? 1.05 : 1.0;

        const dirX = item.shelfPosition.x > 0 ? -1 : 1;
        const targetX = item.shelfPosition.x + dirX * targetPull;

        item.boxMesh.position.x += (targetX - item.boxMesh.position.x) * 0.15;
        item.boxMesh.scale.set(targetScale, targetScale, targetScale);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      const newPortrait = newW < newH;
      cameraRef.current.fov = newPortrait ? 68 : 52;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('mousemove', handlePointerMove);
      domElement.removeEventListener('mousedown', handlePointerDown);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchmove', handleTouchMove);
      domElement.removeEventListener('touchend', handleTouchEnd);
      renderer.dispose();
    };
  }, [products, onSelectProduct, onWalkProgressChange, onHoverProductChange]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative select-none overflow-hidden touch-none"
      style={{ minHeight: '600px' }}
    />
  );
};
