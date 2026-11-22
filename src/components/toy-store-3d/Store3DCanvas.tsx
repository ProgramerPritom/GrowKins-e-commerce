import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getBengaliProductDetails } from '../toy-world/bengaliToyData';

export interface Store3DCanvasProps {
  products: any[];
  walkProgress: number; // 0 (entrance) to 1 (back of the shop)
  onWalkProgressChange: (newProgress: number) => void;
  onSelectProduct: (product: any) => void;
}

interface ProductMeshMap {
  mesh: THREE.Mesh;
  product: any;
  originalY: number;
  originalZ: number;
  highlightMesh: THREE.Mesh;
  labelSprite?: THREE.Sprite;
}

export const Store3DCanvas: React.FC<Store3DCanvasProps> = ({
  products,
  walkProgress,
  onWalkProgressChange,
  onSelectProduct,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const productMeshesRef = useRef<ProductMeshMap[]>([]);
  const hoveredMeshRef = useRef<ProductMeshMap | null>(null);

  // Look-around angles (smooth yaw & pitch)
  const lookYawRef = useRef<number>(0);
  const lookPitchRef = useRef<number>(0);
  const targetYawRef = useRef<number>(0);
  const targetPitchRef = useRef<number>(0);

  // Mouse drag tracking
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Current smooth walk progress
  const smoothProgressRef = useRef<number>(walkProgress);
  useEffect(() => {
    smoothProgressRef.current = walkProgress;
  }, [walkProgress]);

  // Procedural Wood Floor Texture Generator
  const createWoodTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Warm parquet wooden plank background
    ctx.fillStyle = '#C89D66';
    ctx.fillRect(0, 0, 512, 512);

    const plankWidth = 128;
    const plankHeight = 32;

    for (let y = 0; y < 512; y += plankHeight) {
      const offsetX = (Math.floor(y / plankHeight) % 2) * (plankWidth / 2);
      for (let x = -offsetX; x < 512; x += plankWidth) {
        // Subtle plank color variations
        const lightness = 0.9 + Math.random() * 0.2;
        ctx.fillStyle = `rgb(${Math.floor(190 * lightness)}, ${Math.floor(140 * lightness)}, ${Math.floor(90 * lightness)})`;
        ctx.fillRect(x + 1, y + 1, plankWidth - 2, plankHeight - 2);

        // Wood grain streaks
        ctx.strokeStyle = 'rgba(100, 60, 20, 0.08)';
        ctx.lineWidth = 1;
        for (let g = 0; g < 4; g++) {
          const gy = y + 4 + Math.random() * (plankHeight - 8);
          ctx.beginPath();
          ctx.moveTo(x, gy);
          ctx.bezierCurveTo(
            x + plankWidth * 0.3, gy + (Math.random() - 0.5) * 4,
            x + plankWidth * 0.7, gy + (Math.random() - 0.5) * 4,
            x + plankWidth, gy
          );
          ctx.stroke();
        }

        // Plank border shadow
        ctx.strokeStyle = 'rgba(70, 40, 10, 0.25)';
        ctx.strokeRect(x, y, plankWidth, plankHeight);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 16);
    return texture;
  };

  // Procedural Canvas Banner for Welcome Sign
  const createWelcomeBannerTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Warm festive gradient
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, '#E76F51');
    grad.addColorStop(0.5, '#F4A261');
    grad.addColorStop(1, '#2D6A4F');
    ctx.fillStyle = grad;
    ctx.roundRect(10, 10, 1004, 236, 30);
    ctx.fill();

    // Gold border
    ctx.strokeStyle = '#F7E198';
    ctx.lineWidth = 10;
    ctx.roundRect(10, 10, 1004, 236, 30);
    ctx.stroke();

    // English Tag
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🌟 GROWKINS TOY WORLD 🌟', 512, 70);

    // Bengali Main Greeting
    ctx.fillStyle = '#FAF7F1';
    ctx.font = 'bold 64px "Hind Siliguri", sans-serif';
    ctx.fillText('গ্রো কিন্স খেলনার দুনিয়ায় স্বাগতম', 512, 150);

    // Subtitle
    ctx.fillStyle = '#F7E198';
    ctx.font = 'bold 32px "Hind Siliguri", sans-serif';
    ctx.fillText('ছোটদের আনন্দ ও মানসিক বিকাশের নিরাপদ সঙ্গী', 512, 205);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Helper to create Bengali Price & Name Sprite Label
  const createProductLabelSprite = (prod: any) => {
    const bData = getBengaliProductDetails(prod);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Background pill
    ctx.fillStyle = 'rgba(36, 34, 31, 0.88)';
    ctx.roundRect(20, 20, 472, 216, 28);
    ctx.fill();

    // Border
    ctx.strokeStyle = '#E76F51';
    ctx.lineWidth = 6;
    ctx.roundRect(20, 20, 472, 216, 28);
    ctx.stroke();

    // Price tag pill
    ctx.fillStyle = '#E76F51';
    ctx.roundRect(310, 36, 160, 56, 16);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`৳${prod.price || 750}`, 390, 76);

    // Age Badge
    ctx.fillStyle = '#2D6A4F';
    ctx.roundRect(40, 38, 140, 48, 14);
    ctx.fill();
    ctx.fillStyle = '#FAF7F1';
    ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
    ctx.fillText(bData.ageBadge || '১–৫ বছর', 110, 72);

    // Title (Bengali truncated)
    ctx.fillStyle = '#FAF7F1';
    ctx.font = 'bold 38px "Hind Siliguri", sans-serif';
    ctx.textAlign = 'left';
    const rawTitle = bData.bName || prod.name || 'খেলনা';
    const displayTitle = rawTitle.length > 18 ? rawTitle.slice(0, 17) + '…' : rawTitle;
    ctx.fillText(displayTitle, 40, 145);

    // Call to action prompt
    ctx.fillStyle = '#F7E198';
    ctx.font = 'bold 28px "Hind Siliguri", sans-serif';
    ctx.fillText('👉 ক্লিক করে ভিডিও ও বিবরণ দেখুন', 40, 195);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.4, 0.7, 1);
    return sprite;
  };

  // Main Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#FAF7F1');
    scene.fog = new THREE.FogExp2(0xFAF7F1, 0.025);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 100);
    camera.position.set(0, 1.55, 3); // Eye level at aisle entrance
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xFFF6E8, 1.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFF0DD, 1.2);
    sunLight.position.set(5, 12, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // Point lights down the aisle (warm boutique ceiling lights)
    const aisleLength = 32;
    for (let z = 2; z >= -aisleLength; z -= 6) {
      const lampLight = new THREE.PointLight(0xFFE3B3, 0.9, 10);
      lampLight.position.set(0, 3.4, z);
      scene.add(lampLight);

      // Hanging lamp fixture mesh
      const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 8);
      const wireMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      wire.position.set(0, 3.6, z);
      scene.add(wire);

      const shadeGeo = new THREE.ConeGeometry(0.3, 0.25, 16, 1, true);
      const shadeMat = new THREE.MeshStandardMaterial({ color: 0xE76F51, roughness: 0.3 });
      const shade = new THREE.Mesh(shadeGeo, shadeMat);
      shade.position.set(0, 3.25, z);
      shade.rotation.x = Math.PI;
      scene.add(shade);

      // Bulb
      const bulbGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const bulbMat = new THREE.MeshBasicMaterial({ color: 0xFFF3C4 });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(0, 3.2, z);
      scene.add(bulb);
    }

    // 5. Room Architecture
    // Floor
    const woodTexture = createWoodTexture();
    const floorGeo = new THREE.PlaneGeometry(10, aisleLength + 10);
    const floorMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.45,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -(aisleLength / 2 - 2));
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(10, aisleLength + 10);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0xFDFBF7,
      roughness: 0.9,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, 4.0, -(aisleLength / 2 - 2));
    scene.add(ceiling);

    // Ceiling Beams (Warm Oak)
    const beamGeo = new THREE.BoxGeometry(10, 0.25, 0.3);
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x8C5E35, roughness: 0.7 });
    for (let z = 4; z >= -aisleLength; z -= 4) {
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(0, 3.9, z);
      scene.add(beam);
    }

    // Walls (Warm Soft Cream)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xF7F2E8, roughness: 0.8 });
    
    // Left Wall
    const leftWallGeo = new THREE.PlaneGeometry(aisleLength + 10, 4);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-4.5, 2, -(aisleLength / 2 - 2));
    scene.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(leftWallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(4.5, 2, -(aisleLength / 2 - 2));
    scene.add(rightWall);

    // Back Wall with Cozy Window & Garden View
    const backWallGeo = new THREE.PlaneGeometry(10, 4);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 2, -aisleLength - 2);
    scene.add(backWall);

    // Back Wall Poster / Feature Banner
    const backBannerGeo = new THREE.PlaneGeometry(5, 2.2);
    const backBannerMat = new THREE.MeshBasicMaterial({
      map: createWelcomeBannerTexture(),
    });
    const backBanner = new THREE.Mesh(backBannerGeo, backBannerMat);
    backBanner.position.set(0, 2.1, -aisleLength - 1.9);
    scene.add(backBanner);

    // Entrance Arch Banner
    const archBannerGeo = new THREE.PlaneGeometry(6, 1.5);
    const archBannerMat = new THREE.MeshBasicMaterial({
      map: createWelcomeBannerTexture(),
      side: THREE.DoubleSide,
    });
    const archBanner = new THREE.Mesh(archBannerGeo, archBannerMat);
    archBanner.position.set(0, 3.1, 2.5);
    scene.add(archBanner);

    // 6. Wooden Shelves Structure (Left & Right Aisles)
    const shelfWoodMat = new THREE.MeshStandardMaterial({
      color: 0xBA8650,
      roughness: 0.5,
      metalness: 0.1,
    });

    const createShelfUnit = (x: number, z: number, rotationY: number) => {
      const shelfGroup = new THREE.Group();

      // Vertical Uprights
      const postGeo = new THREE.BoxGeometry(0.1, 2.6, 0.7);
      const leftPost = new THREE.Mesh(postGeo, shelfWoodMat);
      leftPost.position.set(-1.4, 1.3, 0);
      shelfGroup.add(leftPost);

      const rightPost = new THREE.Mesh(postGeo, shelfWoodMat);
      rightPost.position.set(1.4, 1.3, 0);
      shelfGroup.add(rightPost);

      // Back Panel
      const backGeo = new THREE.BoxGeometry(2.9, 2.6, 0.05);
      const backPanel = new THREE.Mesh(backGeo, new THREE.MeshStandardMaterial({ color: 0xE8D5B7, roughness: 0.8 }));
      backPanel.position.set(0, 1.3, -0.32);
      shelfGroup.add(backPanel);

      // Horizontal Shelf Tiers
      const tierGeo = new THREE.BoxGeometry(2.9, 0.08, 0.7);
      const tiersY = [0.2, 0.95, 1.7, 2.45];
      tiersY.forEach((y) => {
        const tier = new THREE.Mesh(tierGeo, shelfWoodMat);
        tier.position.set(0, y, 0);
        tier.receiveShadow = true;
        shelfGroup.add(tier);
      });

      shelfGroup.position.set(x, 0, z);
      shelfGroup.rotation.y = rotationY;
      scene.add(shelfGroup);
    };

    // Build shelf bays along left (x = -3.4) and right (x = 3.4)
    for (let z = 0; z >= -aisleLength + 3; z -= 3.5) {
      createShelfUnit(-3.3, z, Math.PI / 2);
      createShelfUnit(3.3, z, -Math.PI / 2);
    }

    // 7. Populate Live Products on Shelves
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    const productMeshes: ProductMeshMap[] = [];

    // Distinct shelf slot coordinates (alternating left & right bays, eye level y = 1.05 and 1.8)
    const slots: { x: number; y: number; z: number; normalX: number }[] = [];
    let slotZ = 0;
    while (slotZ >= -aisleLength + 2) {
      // Left shelf upper & lower
      slots.push({ x: -2.8, y: 1.15, z: slotZ - 0.7, normalX: 1 });
      slots.push({ x: -2.8, y: 1.9, z: slotZ + 0.7, normalX: 1 });
      // Right shelf upper & lower
      slots.push({ x: 2.8, y: 1.15, z: slotZ + 0.7, normalX: -1 });
      slots.push({ x: 2.8, y: 1.9, z: slotZ - 0.7, normalX: -1 });

      slotZ -= 3.5;
    }

    products.forEach((prod, idx) => {
      if (idx >= slots.length) return;
      const slot = slots[idx];

      const imgUrl = prod.featuredImage || prod.images?.main || (Array.isArray(prod.images) ? prod.images[0]?.url : '/items/busy-cube.jfif');

      // Product 3D Display Box Geometry
      const boxWidth = 0.75;
      const boxHeight = 0.65;
      const boxDepth = 0.35;
      const boxGeo = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

      // Load texture with fallback
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0xFFFFFF,
        roughness: 0.3,
        metalness: 0.1,
      });

      if (imgUrl) {
        textureLoader.load(
          imgUrl,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            // Create multi-material: front face gets image, sides get branded packaging color
            const sideMat = new THREE.MeshStandardMaterial({ color: 0xF4A261, roughness: 0.4 });
            const topMat = new THREE.MeshStandardMaterial({ color: 0xE76F51, roughness: 0.4 });
            const faceMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.25 });

            // Box faces order: +X, -X, +Y, -Y, +Z, -Z
            const materials = [
              slot.normalX === 1 ? faceMat : sideMat, // Left / right
              slot.normalX === -1 ? faceMat : sideMat,
              topMat,
              sideMat,
              sideMat,
              sideMat,
            ];
            productBox.material = materials as any;
          },
          undefined,
          (err) => {
            console.warn('Failed loading 3D texture for product', prod.id, err);
          }
        );
      }

      const productBox = new THREE.Mesh(boxGeo, boxMat);
      productBox.position.set(slot.x, slot.y, slot.z);
      productBox.castShadow = true;
      productBox.receiveShadow = true;

      // Rotate box to face towards the center aisle
      if (slot.normalX === 1) {
        productBox.rotation.y = -Math.PI / 6; // angled nicely toward customer
      } else {
        productBox.rotation.y = Math.PI + Math.PI / 6;
      }

      // Golden Halo / Highlight Mesh on hover
      const highlightGeo = new THREE.BoxGeometry(boxWidth * 1.08, boxHeight * 1.08, boxDepth * 1.08);
      const highlightMat = new THREE.MeshBasicMaterial({
        color: 0xFFD166,
        transparent: true,
        opacity: 0,
        wireframe: true,
      });
      const highlightMesh = new THREE.Mesh(highlightGeo, highlightMat);
      productBox.add(highlightMesh);

      // Floating price tag sprite above the toy
      const labelSprite = createProductLabelSprite(prod);
      if (labelSprite) {
        labelSprite.position.set(0, 0.65, 0);
        productBox.add(labelSprite);
      }

      scene.add(productBox);

      // Store in raycaster array
      productMeshes.push({
        mesh: productBox,
        product: prod,
        originalY: slot.y,
        originalZ: slot.z,
        highlightMesh,
        labelSprite: labelSprite || undefined,
      });
    });

    productMeshesRef.current = productMeshes;

    // 8. Raycaster & Mouse Click Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Handle drag look-around
      if (isDraggingRef.current) {
        const deltaX = e.clientX - lastMousePosRef.current.x;
        const deltaY = e.clientY - lastMousePosRef.current.y;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };

        targetYawRef.current -= deltaX * 0.003;
        targetPitchRef.current -= deltaY * 0.002;

        // Clamp look angles
        targetYawRef.current = Math.max(-0.6, Math.min(0.6, targetYawRef.current));
        targetPitchRef.current = Math.max(-0.35, Math.min(0.35, targetPitchRef.current));
      }

      // Raycast against products
      raycaster.setFromCamera(mouse, camera);
      const candidateMeshes = productMeshesRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(candidateMeshes, false);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const item = productMeshesRef.current.find((p) => p.mesh === hitMesh);
        if (item) {
          if (hoveredMeshRef.current !== item) {
            if (hoveredMeshRef.current) {
              (hoveredMeshRef.current.highlightMesh.material as THREE.MeshBasicMaterial).opacity = 0;
            }
            hoveredMeshRef.current = item;
            (item.highlightMesh.material as THREE.MeshBasicMaterial).opacity = 0.8;
            renderer.domElement.style.cursor = 'pointer';
          }
        }
      } else {
        if (hoveredMeshRef.current) {
          (hoveredMeshRef.current.highlightMesh.material as THREE.MeshBasicMaterial).opacity = 0;
          hoveredMeshRef.current = null;
          renderer.domElement.style.cursor = isDraggingRef.current ? 'grabbing' : 'default';
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      renderer.domElement.style.cursor = 'grabbing';
    };

    const handlePointerUp = (e: MouseEvent) => {
      const wasDrag = Math.abs(e.clientX - lastMousePosRef.current.x) > 5 || Math.abs(e.clientY - lastMousePosRef.current.y) > 5;
      isDraggingRef.current = false;
      renderer.domElement.style.cursor = hoveredMeshRef.current ? 'pointer' : 'default';

      if (!wasDrag && hoveredMeshRef.current) {
        onSelectProduct(hoveredMeshRef.current.product);
      }
    };

    // Wheel to walk forward / backward
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0008;
      const nextProgress = Math.max(0, Math.min(1, smoothProgressRef.current + delta));
      onWalkProgressChange(nextProgress);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', handlePointerMove);
    domElement.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // 9. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth progress interpolation
      const targetZ = 2.5 - smoothProgressRef.current * (aisleLength - 4);
      camera.position.z += (targetZ - camera.position.z) * 0.1;

      // Smooth look-around
      lookYawRef.current += (targetYawRef.current - lookYawRef.current) * 0.12;
      lookPitchRef.current += (targetPitchRef.current - lookPitchRef.current) * 0.12;

      // Camera orientation
      camera.rotation.set(0, 0, 0);
      camera.rotation.y = lookYawRef.current;
      camera.rotation.x = lookPitchRef.current;

      // Idle floating animation for toys
      productMeshesRef.current.forEach((item, i) => {
        const floatOffset = Math.sin(elapsedTime * 2 + i * 0.8) * 0.04;
        item.mesh.position.y = item.originalY + floatOffset;

        // Pulse highlight if hovered
        if (hoveredMeshRef.current === item) {
          item.mesh.scale.set(1.06, 1.06, 1.06);
        } else {
          item.mesh.scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 10. Window Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handlePointerUp);
      domElement.removeEventListener('mousemove', handlePointerMove);
      domElement.removeEventListener('mousedown', handlePointerDown);
      domElement.removeEventListener('wheel', handleWheel);
      renderer.dispose();
    };
  }, [products, onSelectProduct, onWalkProgressChange]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative select-none overflow-hidden touch-none"
      style={{ minHeight: '600px' }}
    />
  );
};
