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
  const currentZRef = useRef<number>(2.4);
  const targetZRef = useRef<number>(2.4);
  const currentYawRef = useRef<number>(0);
  const targetYawRef = useRef<number>(0);
  const currentPitchRef = useRef<number>(0);
  const targetPitchRef = useRef<number>(0);

  // Mouse drag tracking for smooth panning
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update target Z from walkProgress smoothly
  const aisleLength = 26;
  useEffect(() => {
    targetZRef.current = 2.4 - walkProgress * (aisleLength - 1.0);
  }, [walkProgress]);

  // Procedural Colorful Kids Playmat Puzzle Floor Texture
  // Like high-end playful children's boutiques (Image 3 reference)
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

        // Tile inner border shadow
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 6;
        ctx.strokeRect(x + 3, y + 3, tileSize - 6, tileSize - 6);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 4;
        ctx.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

        // Cute playful motif in center of tile (Stars, Smileys, Clouds)
        ctx.save();
        ctx.translate(x + tileSize / 2, y + tileSize / 2);

        const motifType = (x + y) % 3;
        if (motifType === 0) {
          // Playful Star
          ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(Math.cos((18 + s * 72) * 0.01745) * 32, -Math.sin((18 + s * 72) * 0.01745) * 32);
            ctx.lineTo(Math.cos((54 + s * 72) * 0.01745) * 15, -Math.sin((54 + s * 72) * 0.01745) * 15);
          }
          ctx.closePath();
          ctx.fill();
        } else if (motifType === 1) {
          // Playful Cloud / Circle
          ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.arc(-16, 4, 16, 0, Math.PI * 2);
          ctx.arc(16, 4, 16, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Cute Heart
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(-12, -8, 14, Math.PI, 0, false);
          ctx.arc(12, -8, 14, Math.PI, 0, false);
          ctx.lineTo(0, 22);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 10);
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

    // Soft clouds
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

    // Stars
    ctx.fillStyle = '#FFD166';
    const drawStar = (sx: number, sy: number) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fill();
    };
    drawStar(70, 70);
    drawStar(420, 240);
    drawStar(180, 260);
    drawStar(310, 40);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 10);
    return tex;
  };

  // Vibrant Entrance Welcome Banner
  const createGlowingSignTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Glowing Neon Gradient Board
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
    ctx.font = 'bold 56px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌈 GROWKINS TOY WONDERLAND 🎪', 512, 105);

    ctx.fillStyle = '#FFF8E7';
    ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
    ctx.fillText('বাচ্চাদের হাসিমুখ ও আনন্দের রঙিন দুনিয়া', 512, 175);

    return new THREE.CanvasTexture(canvas);
  };

  // Instant High-Impact Toy Packaging Texture
  // Bold, saturated, candy-like toy box with large clear image, star rating & price!
  const createInstantToyBoxTexture = (prod: any, loadedImg?: HTMLImageElement) => {
    const bData = getBengaliProductDetails(prod);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Cheerful yellow/coral toy packaging frame
    ctx.fillStyle = '#FFF9EC';
    ctx.fillRect(0, 0, 512, 512);

    // Thick candy-colored border
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#FF5964';
    ctx.strokeRect(8, 8, 496, 496);

    // Top Header Banner
    ctx.fillStyle = '#35A7FF';
    ctx.fillRect(16, 16, 480, 58);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ GROWKINS PREMIUM TOYS ✨', 256, 52);

    // Main Center Toy Photo Showcase Window
    const imgX = 26;
    const imgY = 82;
    const imgW = 460;
    const imgH = 330;

    if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
      ctx.drawImage(loadedImg, imgX, imgY, imgW, imgH);
      // Glossy sheen overlay
      const gloss = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
      gloss.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
      gloss.addColorStop(0.3, 'rgba(255, 255, 255, 0.0)');
      gloss.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
      ctx.fillStyle = gloss;
      ctx.fillRect(imgX, imgY, imgW, imgH);
    } else {
      // Immediate vibrant fallback
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

    // Inner gold border
    ctx.strokeStyle = '#FFD166';
    ctx.lineWidth = 4;
    ctx.strokeRect(imgX, imgY, imgW, imgH);

    // Bottom Banner: Bengali Title & Price Tag
    ctx.fillStyle = '#1D3557';
    ctx.fillRect(16, 420, 480, 78);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 25px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    const rawName = bData.bName || prod.name || 'শিক্ষণীয় খেলনা';
    const shortName = rawName.length > 17 ? rawName.slice(0, 16) + '…' : rawName;
    ctx.fillText(shortName, 30, 468);

    // Bold Price Pill in Bright Golden Coral
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

    const width = container.clientWidth || window.innerWidth || 1000;
    const height = container.clientHeight || window.innerHeight || 700;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#FFFDF9');
    scene.fog = new THREE.FogExp2(0xFFFDF9, 0.018);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 100);
    camera.position.set(0, 1.48, currentZRef.current);
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

    // 4. Vibrant Lighting Setup (Bright, Joyful Boutique Feel)
    const ambientLight = new THREE.AmbientLight(0xFFFBE6, 1.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFF4D6, 1.4);
    mainLight.position.set(2, 10, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0004;
    scene.add(mainLight);

    // Hanging Colorful Globe Pendant Lights (Pink, Yellow, Mint, Cyan)
    const globeColors = [0xFF5964, 0xFFD166, 0x06D6A0, 0x118AB2, 0x9B5DE5];
    for (let z = 2; z >= -aisleLength; z -= 4.5) {
      const gColor = globeColors[Math.abs(Math.floor(z / 4.5)) % globeColors.length];

      const lampPoint = new THREE.PointLight(gColor, 0.9, 8);
      lampPoint.position.set(0, 3.2, z);
      scene.add(lampPoint);

      // Gold hanging chain
      const chainGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.7, 8);
      const chainMat = new THREE.MeshStandardMaterial({ color: 0xFFD166, metalness: 0.8 });
      const chain = new THREE.Mesh(chainGeo, chainMat);
      chain.position.set(0, 3.5, z);
      scene.add(chain);

      // Glowing spherical paper lantern globe
      const globeGeo = new THREE.SphereGeometry(0.32, 20, 20);
      const globeMat = new THREE.MeshStandardMaterial({
        color: gColor,
        roughness: 0.2,
        emissive: gColor,
        emissiveIntensity: 0.35,
      });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      globe.position.set(0, 3.1, z);
      scene.add(globe);
    }

    // Festive Bunting Garland Flags along the ceiling
    const flagColors = [0xFF5964, 0xFFD166, 0x06D6A0, 0x35A7FF, 0x9B5DE5];
    for (let z = 1.5; z >= -aisleLength; z -= 3.5) {
      for (let fx = -2.8; fx <= 2.8; fx += 0.55) {
        const flagColor = flagColors[Math.abs(Math.floor((fx + 3) * 2)) % flagColors.length];
        const flagGeo = new THREE.ConeGeometry(0.14, 0.24, 3);
        const flagMat = new THREE.MeshBasicMaterial({ color: flagColor, side: THREE.DoubleSide });
        const flag = new THREE.Mesh(flagGeo, flagMat);
        flag.position.set(fx, 3.7 - Math.cos((fx / 3) * (Math.PI / 2)) * 0.2, z);
        flag.rotation.x = Math.PI;
        scene.add(flag);
      }
    }

    // 5. Room Interior Architecture
    // Floor: Playful Puzzle Mat
    const floorGeo = new THREE.PlaneGeometry(8, aisleLength + 10);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createPlayfulPuzzleFloorTexture(),
      roughness: 0.28,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -(aisleLength / 2 - 2));
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling: Blue Sky with Clouds
    const ceilingGeo = new THREE.PlaneGeometry(8, aisleLength + 10);
    const ceilingMat = new THREE.MeshStandardMaterial({
      map: createSkyCeilingTexture(),
      roughness: 0.9,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 4.0, -(aisleLength / 2 - 2));
    scene.add(ceiling);

    // Walls: Sunny Buttercream with soft tint
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xFFFBF2, roughness: 0.8 });

    const sideWallGeo = new THREE.PlaneGeometry(aisleLength + 10, 4.2);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-3.8, 2.0, -(aisleLength / 2 - 2));
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(3.8, 2.0, -(aisleLength / 2 - 2));
    scene.add(rightWall);

    const backWallGeo = new THREE.PlaneGeometry(8, 4.2);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 2.0, -aisleLength - 1.5);
    scene.add(backWall);

    // Back Poster
    const backPosterGeo = new THREE.PlaneGeometry(4.8, 2.0);
    const backPosterMat = new THREE.MeshBasicMaterial({
      map: createGlowingSignTexture(),
    });
    const backPoster = new THREE.Mesh(backPosterGeo, backPosterMat);
    backPoster.position.set(0, 2.2, -aisleLength - 1.45);
    scene.add(backPoster);

    // ================= 6. GLOWING FUTURISTIC/PLAYFUL ENTRANCE ARCH (Like Image 1!) =================
    // Sleek white curved portal with bright glowing neon LED rim!
    const archGroup = new THREE.Group();

    // Curved White Outer Arch Frame
    const archCurve = new THREE.TorusGeometry(3.2, 0.45, 24, 48, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.2,
      metalness: 0.05,
    });
    const archMesh = new THREE.Mesh(archCurve, archMat);
    archMesh.position.set(0, 0.2, 2.2);
    archGroup.add(archMesh);

    // Glowing Cyan Neon LED Inner Rim
    const neonCurve = new THREE.TorusGeometry(3.05, 0.1, 16, 48, Math.PI);
    const neonMat = new THREE.MeshBasicMaterial({
      color: 0x00F0FF,
    });
    const neonMesh = new THREE.Mesh(neonCurve, neonMat);
    neonMesh.position.set(0, 0.2, 2.22);
    archGroup.add(neonMesh);

    // Welcome Header Sign over Arch
    const entranceSignGeo = new THREE.PlaneGeometry(4.8, 1.4);
    const entranceSignMat = new THREE.MeshBasicMaterial({
      map: createGlowingSignTexture(),
      side: THREE.DoubleSide,
    });
    const entranceSign = new THREE.Mesh(entranceSignGeo, entranceSignMat);
    entranceSign.position.set(0, 3.2, 2.0);
    archGroup.add(entranceSign);

    scene.add(archGroup);

    // Cute Kid's Toys on Floor near Entrance (Like Image 1 reference)
    // Kid's Rocking Horse / Zebra Prop
    const rockerBaseGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.25, 16);
    const rockerBaseMat = new THREE.MeshStandardMaterial({ color: 0xFF5964 });
    const rockerBase = new THREE.Mesh(rockerBaseGeo, rockerBaseMat);
    rockerBase.position.set(-2.5, 0.15, 1.0);
    scene.add(rockerBase);

    // Kid's Green Toy Storage Box with Colorful Balls
    const toyBinGeo = new THREE.BoxGeometry(0.6, 0.45, 0.6);
    const toyBinMat = new THREE.MeshStandardMaterial({ color: 0x70E000 });
    const toyBin = new THREE.Mesh(toyBinGeo, toyBinMat);
    toyBin.position.set(2.5, 0.22, 1.0);
    scene.add(toyBin);

    // ================= 7. COLORFUL HOUSE-SHAPED SHELVING UNITS (Like Image 2!) =================
    // Bays painted in cheerful colors: Yellow, Teal, Coral, Sky Blue, Lilac
    const bayColors = [
      0xFFD166, // Sunshine Yellow House
      0x2EC4B6, // Mint Turquoise House
      0xFF5964, // Cheerful Coral House
      0x35A7FF, // Sky Blue House
      0x9B5DE5, // Lavender Purple House
      0xFB8500, // Sunset Orange House
    ];

    const shelfDepth = 0.58;
    const shelfBayWidth = 2.4;
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

      // House Back Wall Panel
      const backGeo = new THREE.BoxGeometry(shelfBayWidth, 2.6, 0.03);
      const backPanel = new THREE.Mesh(backGeo, whiteBackMat);
      backPanel.position.set(0, 1.3, -shelfDepth / 2 + 0.015);
      bayGroup.add(backPanel);

      // House Pointed Gable Roof on Top! (Like Image 2)
      const roofGeo = new THREE.ConeGeometry(shelfBayWidth * 0.65, 0.7, 4);
      const roofMesh = new THREE.Mesh(roofGeo, frameMat);
      roofMesh.position.set(0, 2.95, 0);
      roofMesh.rotation.y = Math.PI / 4;
      bayGroup.add(roofMesh);

      // Roof Round Attic Window
      const windowGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
      const windowMat = new THREE.MeshBasicMaterial({ color: 0xFFF3C4 });
      const windowMesh = new THREE.Mesh(windowGeo, windowMat);
      windowMesh.rotation.x = Math.PI / 2;
      windowMesh.position.set(0, 2.85, 0.05);
      bayGroup.add(windowMesh);

      // Vertical Side Posts
      const postGeo = new THREE.BoxGeometry(0.08, 2.6, shelfDepth);
      const postL = new THREE.Mesh(postGeo, frameMat);
      postL.position.set(-shelfBayWidth / 2, 1.3, 0);
      postL.castShadow = true;
      bayGroup.add(postL);

      const postR = new THREE.Mesh(postGeo, frameMat);
      postR.position.set(shelfBayWidth / 2, 1.3, 0);
      postR.castShadow = true;
      bayGroup.add(postR);

      // Shelves with Bright Glowing Under-shelf LED Strips! (Like Image 3)
      tierHeights.forEach((y) => {
        const tierGeo = new THREE.BoxGeometry(shelfBayWidth, 0.05, shelfDepth);
        const tier = new THREE.Mesh(tierGeo, frameMat);
        tier.position.set(0, y, 0);
        tier.receiveShadow = true;
        bayGroup.add(tier);

        // Glowing Under-Shelf LED Bar
        if (y > 0.3) {
          const ledGeo = new THREE.BoxGeometry(shelfBayWidth - 0.1, 0.02, 0.04);
          const ledStrip = new THREE.Mesh(ledGeo, ledGlowMat);
          ledStrip.position.set(0, y - 0.035, shelfDepth / 2 - 0.03);
          bayGroup.add(ledStrip);
        }

        // Golden Shelf Lip
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

    // Build the colorful house bays down left (x = -2.2) and right (x = 2.2)
    let bayCount = 0;
    for (let z = 0; z >= -aisleLength + 2; z -= 3.0) {
      createHouseShelfBay(-2.2, z, true, bayCount);
      createHouseShelfBay(2.2, z, false, bayCount + 1);
      bayCount += 2;
    }

    // ================= 8. PLACE VIBRANT TOYS DIRECTLY FACING THE USER =================
    const productMeshList: ProductMeshItem[] = [];

    // Angled 30-35° forward toward oncoming customer
    const shelfSlots: { x: number; y: number; z: number; rotY: number; isLeft: boolean }[] = [];
    let currentBayZ = 0;

    while (currentBayZ >= -aisleLength + 2) {
      // Left shelf (x = -1.86, eye level y = 1.675 and waist level y = 0.975)
      shelfSlots.push({ x: -1.86, y: 1.675, z: currentBayZ - 0.55, rotY: -0.45, isLeft: true });
      shelfSlots.push({ x: -1.86, y: 1.675, z: currentBayZ + 0.55, rotY: -0.45, isLeft: true });
      shelfSlots.push({ x: -1.86, y: 0.975, z: currentBayZ - 0.55, rotY: -0.45, isLeft: true });
      shelfSlots.push({ x: -1.86, y: 0.975, z: currentBayZ + 0.55, rotY: -0.45, isLeft: true });

      // Right shelf (x = 1.86)
      shelfSlots.push({ x: 1.86, y: 1.675, z: currentBayZ + 0.55, rotY: 0.45, isLeft: false });
      shelfSlots.push({ x: 1.86, y: 1.675, z: currentBayZ - 0.55, rotY: 0.45, isLeft: false });
      shelfSlots.push({ x: 1.86, y: 0.975, z: currentBayZ + 0.55, rotY: 0.45, isLeft: false });
      shelfSlots.push({ x: 1.86, y: 0.975, z: currentBayZ - 0.55, rotY: 0.45, isLeft: false });

      currentBayZ -= 3.0;
    }

    products.forEach((prod, idx) => {
      if (idx >= shelfSlots.length) return;
      const slot = shelfSlots[idx];

      const imgUrl = prod.featuredImage || prod.images?.main || (Array.isArray(prod.images) ? prod.images[0]?.url : '/items/busy-cube.jfif');

      // Prominent, juicy toy box dimensions
      const boxW = 0.56;
      const boxH = 0.50;
      const boxD = 0.20;

      const boxGeo = new THREE.BoxGeometry(boxW, boxH, boxD);

      // Instant procedural texture — rendered on frame 1 with ZERO delay!
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

      // Front face (+Z) AND inner side face get the toy artwork!
      const materials = [
        slot.isLeft ? toyFaceMat : sidePackagingMat, // +X
        slot.isLeft ? sidePackagingMat : toyFaceMat, // -X
        topPackagingMat,                              // +Y
        sidePackagingMat,                             // -Y
        toyFaceMat,                                   // +Z (Directly facing user!)
        sidePackagingMat,                             // -Z
      ];

      const productBox = new THREE.Mesh(boxGeo, materials as any);

      // Load high-res photo and swap seamlessly
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

      // Rest on shelf surface
      const restingY = slot.y + boxH / 2;
      productBox.position.set(slot.x, restingY, slot.z);
      productBox.rotation.y = slot.rotY;

      productBox.castShadow = true;
      productBox.receiveShadow = true;

      // Soft shadow under toy
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

      // Golden Standee Display Pedestal under each toy
      const pedestalGeo = new THREE.BoxGeometry(boxW * 1.05, 0.03, boxD * 1.05);
      const pedestalMat = new THREE.MeshStandardMaterial({ color: 0xFFD166, metalness: 0.4, roughness: 0.3 });
      const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestal.position.set(0, -boxH / 2 + 0.015, 0);
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

    // ================= 9. RAYCASTER & INTERACTION =================
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

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0006;
      const currentWalk = (2.4 - targetZRef.current) / (aisleLength - 1.0);
      const nextWalk = Math.max(0, Math.min(1, currentWalk + delta));
      onWalkProgressChange(nextWalk);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', handlePointerMove);
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

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

      // Hover pull forward animation
      productItemsRef.current.forEach((item) => {
        const isHovered = hoveredItemRef.current === item;
        const targetPull = isHovered ? 0.09 : 0.0;
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
