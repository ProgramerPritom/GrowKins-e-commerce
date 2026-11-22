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

  // Mouse drag tracking for smooth panning
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update target Z from walkProgress smoothly
  const aisleLength = 26; // total walking depth
  useEffect(() => {
    targetZRef.current = 2.2 - walkProgress * (aisleLength - 1.0);
  }, [walkProgress]);

  // Procedural Warm Oak Parquet Floor Texture
  const createRealisticFloorTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = '#D4A373';
    ctx.fillRect(0, 0, 1024, 1024);

    const plankW = 256;
    const plankH = 64;

    for (let y = 0; y < 1024; y += plankH) {
      const row = Math.floor(y / plankH);
      const offsetX = (row % 2) * (plankW / 2);

      for (let x = -offsetX; x < 1024; x += plankW) {
        const tone = 0.92 + (Math.sin(x * 12.3 + y * 7.1) * 0.5 + 0.5) * 0.16;
        ctx.fillStyle = `rgb(${Math.floor(212 * tone)}, ${Math.floor(163 * tone)}, ${Math.floor(115 * tone)})`;
        ctx.fillRect(x + 1, y + 1, plankW - 2, plankH - 2);

        ctx.strokeStyle = 'rgba(90, 50, 20, 0.06)';
        ctx.lineWidth = 1;
        for (let g = 0; g < 6; g++) {
          const gy = y + 8 + (g * 8);
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.bezierCurveTo(x + 80, gy + (g % 2 === 0 ? 2 : -2), x + 180, gy + (g % 2 === 0 ? -2 : 2), x + plankW, gy);
          ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(60, 35, 15, 0.22)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, plankW, plankH);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 14);
    return tex;
  };

  // Ceiling Grid Texture
  const createCeilingTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = '#F8F6F0';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(180, 170, 155, 0.4)';
    ctx.lineWidth = 3;
    const tileSize = 128;
    for (let i = 0; i <= 512; i += tileSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 14);
    return tex;
  };

  // Welcome Arch Sign
  const createWelcomeSignTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = '#1D3557';
    ctx.roundRect(16, 16, 992, 224, 24);
    ctx.fill();

    ctx.strokeStyle = '#F4A261';
    ctx.lineWidth = 6;
    ctx.roundRect(16, 16, 992, 224, 24);
    ctx.stroke();

    ctx.fillStyle = '#FAF7F1';
    ctx.font = 'bold 58px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎪 GROWKINS TOY WORLD 🎪', 512, 105);

    ctx.fillStyle = '#F4A261';
    ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
    ctx.fillText('বাচ্চাদের সেরা শিক্ষণীয় ও নিরাপদ খেলনার রাজ্য', 512, 175);

    return new THREE.CanvasTexture(canvas);
  };

  // Instant Procedural Toy Box Packaging Texture
  // Renders IMMEDIATELY with bold Bengali title, colors, and price — NO blank white blocks!
  const createInstantToyBoxTexture = (prod: any, loadedImg?: HTMLImageElement) => {
    const bData = getBengaliProductDetails(prod);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Box Background - Warm Buttercream / Branded border
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(0, 0, 512, 512);

    // Vibrant Toy Box Border Frame
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#E76F51';
    ctx.strokeRect(7, 7, 498, 498);

    // Header Tag Pill
    ctx.fillStyle = '#2D6A4F';
    ctx.fillRect(14, 14, 484, 52);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌟 GROWKINS TOYS • EDUCATIONAL', 256, 48);

    // Center Image Window / Artwork Area
    const imgX = 28;
    const imgY = 76;
    const imgW = 456;
    const imgH = 340;

    if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
      // Draw actual high-res product photo fitted nicely
      ctx.drawImage(loadedImg, imgX, imgY, imgW, imgH);
      // Subtle gloss reflection stripe
      const glossGrad = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
      glossGrad.addColorStop(0, 'rgba(255,255,255,0.22)');
      glossGrad.addColorStop(0.3, 'rgba(255,255,255,0.0)');
      glossGrad.addColorStop(1, 'rgba(255,255,255,0.08)');
      ctx.fillStyle = glossGrad;
      ctx.fillRect(imgX, imgY, imgW, imgH);
    } else {
      // Colorful fallback artwork while image is fetching
      const artGrad = ctx.createLinearGradient(imgX, imgY, imgX, imgY + imgH);
      artGrad.addColorStop(0, '#FFE8D6');
      artGrad.addColorStop(1, '#DDBEA9');
      ctx.fillStyle = artGrad;
      ctx.fillRect(imgX, imgY, imgW, imgH);

      ctx.fillStyle = '#E76F51';
      ctx.font = 'bold 64px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧸', 256, 250);

      ctx.fillStyle = '#6B705C';
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.fillText(bData.bName.slice(0, 15) || 'গ্রো কিন্স খেলনা', 256, 310);
    }

    // Inner photo border
    ctx.strokeStyle = '#E8E0D2';
    ctx.lineWidth = 3;
    ctx.strokeRect(imgX, imgY, imgW, imgH);

    // Footer Info Bar: Bengali Title & Price Pill
    ctx.fillStyle = '#24221F';
    ctx.fillRect(14, 422, 484, 76);

    // Bengali Name
    ctx.fillStyle = '#FAF7F1';
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    const rawName = bData.bName || prod.name || 'শিক্ষণীয় খেলনা';
    const shortName = rawName.length > 18 ? rawName.slice(0, 17) + '…' : rawName;
    ctx.fillText(shortName, 28, 468);

    // Price Badge
    const priceText = `৳${prod.price || 750}`;
    ctx.fillStyle = '#E76F51';
    ctx.roundRect(360, 434, 126, 52, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(priceText, 423, 470);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };

  // Main Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth || 1000;
    const height = container.clientHeight || window.innerHeight || 700;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#FAF7F1');
    scene.fog = new THREE.FogExp2(0xFAF7F1, 0.022);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.set(0, 1.45, currentZRef.current);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xFFF7EC, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xFFF3DD, 1.3);
    mainLight.position.set(2, 10, 8);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);

    // Hanging pendant lamps down the center ceiling
    for (let z = 2; z >= -aisleLength; z -= 5) {
      const lampPoint = new THREE.PointLight(0xFFE2B0, 0.8, 8);
      lampPoint.position.set(0, 3.1, z);
      scene.add(lampPoint);

      const rodGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.7, 8);
      const rodMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
      const rod = new THREE.Mesh(rodGeo, rodMat);
      rod.position.set(0, 3.4, z);
      scene.add(rod);

      const domeGeo = new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({ color: 0x2A9D8F, roughness: 0.3 });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.set(0, 3.05, z);
      dome.rotation.x = Math.PI;
      scene.add(dome);

      const bulbGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const bulbMat = new THREE.MeshBasicMaterial({ color: 0xFFF2C2 });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(0, 3.0, z);
      scene.add(bulb);
    }

    // 5. Room Interior Architecture
    // Floor
    const floorGeo = new THREE.PlaneGeometry(8, aisleLength + 10);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createRealisticFloorTexture(),
      roughness: 0.35,
      metalness: 0.08,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -(aisleLength / 2 - 2));
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(8, aisleLength + 10);
    const ceilingMat = new THREE.MeshStandardMaterial({
      map: createCeilingTexture(),
      roughness: 0.9,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 3.8, -(aisleLength / 2 - 2));
    scene.add(ceiling);

    // Exposed Wooden Ceiling Beams
    const beamGeo = new THREE.BoxGeometry(8, 0.22, 0.28);
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x7F4F24, roughness: 0.6 });
    for (let z = 3; z >= -aisleLength; z -= 3.5) {
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 3.7, z);
      scene.add(beam);
    }

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xF5F0E6, roughness: 0.85 });

    // Left Wall
    const sideWallGeo = new THREE.PlaneGeometry(aisleLength + 10, 4);
    const leftWall = new THREE.Mesh(sideWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-3.8, 1.9, -(aisleLength / 2 - 2));
    scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(sideWallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(3.8, 1.9, -(aisleLength / 2 - 2));
    scene.add(rightWall);

    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(8, 4);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 1.9, -aisleLength - 1.5);
    scene.add(backWall);

    // Feature Poster on Back Wall
    const backPosterGeo = new THREE.PlaneGeometry(4.2, 1.8);
    const backPosterMat = new THREE.MeshBasicMaterial({
      map: createWelcomeSignTexture(),
    });
    const backPoster = new THREE.Mesh(backPosterGeo, backPosterMat);
    backPoster.position.set(0, 2.1, -aisleLength - 1.45);
    scene.add(backPoster);

    // Entrance Arch Sign
    const entranceSignGeo = new THREE.PlaneGeometry(4.8, 1.4);
    const entranceSignMat = new THREE.MeshBasicMaterial({
      map: createWelcomeSignTexture(),
      side: THREE.DoubleSide,
    });
    const entranceSign = new THREE.Mesh(entranceSignGeo, entranceSignMat);
    entranceSign.position.set(0, 2.9, 1.6);
    scene.add(entranceSign);

    // 6. Realistic Multi-Tier Shelving Units
    const shelfWoodMat = new THREE.MeshStandardMaterial({
      color: 0xB8834E,
      roughness: 0.45,
      metalness: 0.05,
    });
    const shelfBackMat = new THREE.MeshStandardMaterial({
      color: 0xEAD8C0,
      roughness: 0.7,
    });
    const ledMat = new THREE.MeshBasicMaterial({
      color: 0xFFF3C4,
    });

    const shelfDepth = 0.55;
    const shelfBayWidth = 2.4;
    const tierHeights = [0.25, 0.95, 1.65, 2.35];

    const createShelfBay = (x: number, z: number, isLeft: boolean) => {
      const bayGroup = new THREE.Group();

      const backGeo = new THREE.BoxGeometry(shelfBayWidth, 2.6, 0.03);
      const backPanel = new THREE.Mesh(backGeo, shelfBackMat);
      backPanel.position.set(0, 1.3, -shelfDepth / 2 + 0.015);
      bayGroup.add(backPanel);

      const postGeo = new THREE.BoxGeometry(0.06, 2.6, shelfDepth);
      const postL = new THREE.Mesh(postGeo, shelfWoodMat);
      postL.position.set(-shelfBayWidth / 2, 1.3, 0);
      postL.castShadow = true;
      bayGroup.add(postL);

      const postR = new THREE.Mesh(postGeo, shelfWoodMat);
      postR.position.set(shelfBayWidth / 2, 1.3, 0);
      postR.castShadow = true;
      bayGroup.add(postR);

      tierHeights.forEach((y) => {
        const tierGeo = new THREE.BoxGeometry(shelfBayWidth, 0.05, shelfDepth);
        const tier = new THREE.Mesh(tierGeo, shelfWoodMat);
        tier.position.set(0, y, 0);
        tier.receiveShadow = true;
        bayGroup.add(tier);

        if (y > 0.3) {
          const ledGeo = new THREE.BoxGeometry(shelfBayWidth - 0.1, 0.015, 0.03);
          const ledStrip = new THREE.Mesh(ledGeo, ledMat);
          ledStrip.position.set(0, y - 0.03, shelfDepth / 2 - 0.03);
          bayGroup.add(ledStrip);
        }

        const lipGeo = new THREE.BoxGeometry(shelfBayWidth, 0.04, 0.02);
        const lipMat = new THREE.MeshStandardMaterial({ color: 0x8C5628 });
        const lip = new THREE.Mesh(lipGeo, lipMat);
        lip.position.set(0, y + 0.02, shelfDepth / 2);
        bayGroup.add(lip);
      });

      bayGroup.position.set(x, 0, z);
      bayGroup.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
      scene.add(bayGroup);
    };

    for (let z = 0; z >= -aisleLength + 2; z -= 3.0) {
      createShelfBay(-2.2, z, true);
      createShelfBay(2.2, z, false);
    }

    // 7. PLACE TOYS DIRECTLY FACING THE USER (Angled ~25-35° forward into aisle)
    const productMeshList: ProductMeshItem[] = [];

    // Distinct shelf slots:
    // Left shelf slots: rotY = -0.42 (turns front face +Z toward the oncoming customer!)
    // Right shelf slots: rotY = +0.42 (turns front face +Z toward the oncoming customer!)
    const shelfSlots: { x: number; y: number; z: number; rotY: number; isLeft: boolean }[] = [];
    let currentBayZ = 0;

    while (currentBayZ >= -aisleLength + 2) {
      // Left shelf (x = -1.90, eye level y = 1.675 and waist level y = 0.975)
      shelfSlots.push({ x: -1.88, y: 1.675, z: currentBayZ - 0.55, rotY: -0.42, isLeft: true });
      shelfSlots.push({ x: -1.88, y: 1.675, z: currentBayZ + 0.55, rotY: -0.42, isLeft: true });
      shelfSlots.push({ x: -1.88, y: 0.975, z: currentBayZ - 0.55, rotY: -0.42, isLeft: true });
      shelfSlots.push({ x: -1.88, y: 0.975, z: currentBayZ + 0.55, rotY: -0.42, isLeft: true });

      // Right shelf (x = 1.90)
      shelfSlots.push({ x: 1.88, y: 1.675, z: currentBayZ + 0.55, rotY: 0.42, isLeft: false });
      shelfSlots.push({ x: 1.88, y: 1.675, z: currentBayZ - 0.55, rotY: 0.42, isLeft: false });
      shelfSlots.push({ x: 1.88, y: 0.975, z: currentBayZ + 0.55, rotY: 0.42, isLeft: false });
      shelfSlots.push({ x: 1.88, y: 0.975, z: currentBayZ - 0.55, rotY: 0.42, isLeft: false });

      currentBayZ -= 3.0;
    }

    products.forEach((prod, idx) => {
      if (idx >= shelfSlots.length) return;
      const slot = shelfSlots[idx];

      const imgUrl = prod.featuredImage || prod.images?.main || (Array.isArray(prod.images) ? prod.images[0]?.url : '/items/busy-cube.jfif');

      // Generous, prominent toy box dimensions (W: 0.54m, H: 0.48m, D: 0.18m)
      const boxW = 0.54;
      const boxH = 0.48;
      const boxD = 0.18;

      const boxGeo = new THREE.BoxGeometry(boxW, boxH, boxD);

      // Instant procedural texture — ready on frame 1 with 0 delay!
      const initialTex = createInstantToyBoxTexture(prod);

      const toyFaceMat = new THREE.MeshStandardMaterial({
        map: initialTex,
        roughness: 0.25,
        metalness: 0.05,
      });

      const sidePackagingMat = new THREE.MeshStandardMaterial({
        color: 0xF4F1DE,
        roughness: 0.4,
      });

      const topPackagingMat = new THREE.MeshStandardMaterial({
        color: 0xE76F51, // Branded coral lid
        roughness: 0.35,
      });

      // Materials: [+X, -X, +Y, -Y, +Z (Front), -Z (Back)]
      // Both front face (+Z) AND the inner face facing the aisle get the toy artwork!
      const materials = [
        slot.isLeft ? toyFaceMat : sidePackagingMat, // +X
        slot.isLeft ? sidePackagingMat : toyFaceMat, // -X
        topPackagingMat,                              // +Y
        sidePackagingMat,                             // -Y
        toyFaceMat,                                   // +Z (Front face directly facing user!)
        sidePackagingMat,                             // -Z
      ];

      const productBox = new THREE.Mesh(boxGeo, materials as any);

      // Asynchronously load the actual high-res image and swap into canvas
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

      // Rest FIRMLY on the shelf surface!
      const restingY = slot.y + boxH / 2;
      productBox.position.set(slot.x, restingY, slot.z);
      productBox.rotation.y = slot.rotY;

      productBox.castShadow = true;
      productBox.receiveShadow = true;

      // Soft contact shadow under the toy box on the shelf
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

      // Cute Shelf-Edge Acrylic Price Tag Standee in front of the toy
      const priceStandeeGeo = new THREE.BoxGeometry(0.22, 0.08, 0.02);
      const priceStandeeMat = new THREE.MeshStandardMaterial({
        color: 0x24221F,
        roughness: 0.3,
      });
      const priceStandee = new THREE.Mesh(priceStandeeGeo, priceStandeeMat);
      priceStandee.position.set(0, -boxH / 2 + 0.04, boxD / 2 + 0.05);
      productBox.add(priceStandee);

      scene.add(productBox);

      productMeshList.push({
        boxMesh: productBox,
        product: prod,
        shelfPosition: new THREE.Vector3(slot.x, restingY, slot.z),
        shelfRotationY: slot.rotY,
      });
    });

    productItemsRef.current = productMeshList;

    // 8. Raycaster & Smooth Hover Detection
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
      const currentWalk = (2.2 - targetZRef.current) / (aisleLength - 1.0);
      const nextWalk = Math.max(0, Math.min(1, currentWalk + delta));
      onWalkProgressChange(nextWalk);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', handlePointerMove);
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // 9. Ultra-Smooth Cinematic Render Loop
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

      // Subtle hover pull-forward effect (gently slides forward ~5cm when hovered)
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
