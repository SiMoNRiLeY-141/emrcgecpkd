import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { playHover, playClick } from "../utils/audio";

// Fallback component in case WebGL is not supported
const WebGLFallback = () => (
  <div className="fixed inset-0 z-0 bg-slate-950 flex items-center justify-center pointer-events-none opacity-40">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05),transparent_60%)]" />
    <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vh] border border-dashed border-accent-primary/10 rounded-full animate-[spin_120s_linear_infinite]" />
    <div className="absolute top-1/3 left-1/3 w-[30vw] h-[30vh] border border-dashed border-accent-secondary/10 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
  </div>
);

const ScrollScene3D = () => {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // 1. WebGL Availability Check
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    // Dynamic GSAP and ScrollTrigger import to avoid SSR issues
    let gsap, ScrollTrigger;

    const initThreeAndGSAP = async () => {
      try {
        const gsapModule = await import("gsap");
        const scrollTriggerModule = await import("gsap/ScrollTrigger");
        gsap = gsapModule.default || gsapModule;
        ScrollTrigger =
          scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;
        gsap.registerPlugin(ScrollTrigger);
      } catch (err) {
        console.error("GSAP loading error", err);
        return;
      }

      const container = mountRef.current;
      if (!container) return;

      // 2. Setup Scene, Camera, Renderer
      const width = container.clientWidth;
      const height = container.clientHeight;
      const scene = new THREE.Scene();

      // Black slate background with slight blue fog for depth
      scene.background = new THREE.Color(0x060913);
      scene.fog = new THREE.FogExp2(0x060913, 0.015);

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(0, 0, 15);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });

      // Performance Budget Capping
      const isMobile = window.innerWidth < 768;
      const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      container.appendChild(renderer.domElement);

      // 3. Lighting Setup
      const ambientLight = new THREE.AmbientLight(0x080f20, 1.5);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 2.5);
      dirLight1.position.set(5, 10, 7);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x7000ff, 2.0);
      dirLight2.position.set(-5, -5, -5);
      scene.add(dirLight2);

      const pointLight = new THREE.PointLight(0x00f0ff, 3, 20);
      pointLight.position.set(0, 0, 0);
      scene.add(pointLight);

      // 4. Object Groups
      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // --- Group A: Particle System (Glowing Electrons) ---
      const particleCount = isMobile ? 250 : 800;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const randomSpeeds = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        // Distribute in a spherical volume
        const r = 10 + Math.random() * 25;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        randomSpeeds[i] = 0.1 + Math.random() * 0.9;
      }

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );

      // Simple particle shader or point material
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: isMobile ? 0.08 : 0.12,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particleSystem = new THREE.Points(
        particleGeometry,
        particleMaterial,
      );
      scene.add(particleSystem);

      // --- Group B: Hero/Landing Central Reactor Core ---
      const reactorGroup = new THREE.Group();
      reactorGroup.position.set(0, 0, 0);
      mainGroup.add(reactorGroup);

      // Core sphere
      const coreGeo = new THREE.IcosahedronGeometry(1.6, 2);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        emissive: 0x00a0cc,
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.95,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      reactorGroup.add(coreMesh);

      // Outer mechanical rings
      const ringGeo1 = new THREE.TorusGeometry(2.4, 0.06, 8, 48);
      const ringMat1 = new THREE.MeshStandardMaterial({
        color: 0x7000ff,
        roughness: 0.2,
        metalness: 0.9,
      });
      const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      reactorGroup.add(ring1);

      const ringGeo2 = new THREE.TorusGeometry(2.8, 0.04, 8, 48);
      const ringMat2 = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        roughness: 0.2,
        metalness: 0.9,
      });
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.x = Math.PI / 2;
      reactorGroup.add(ring2);

      const ringGeo3 = new THREE.TorusGeometry(3.2, 0.03, 6, 32);
      const ring3 = new THREE.Mesh(ringGeo3, ringMat1);
      ring3.rotation.y = Math.PI / 4;
      reactorGroup.add(ring3);

      // --- Group C: Club Metrics Futuristic Circuit Board ---
      const circuitGroup = new THREE.Group();
      circuitGroup.position.set(12, -4, -6);
      mainGroup.add(circuitGroup);

      // Circuit motherboard base plate
      const boardGeo = new THREE.BoxGeometry(7, 0.2, 7);
      const boardMat = new THREE.MeshStandardMaterial({
        color: 0x0c1424,
        roughness: 0.4,
        metalness: 0.8,
      });
      const board = new THREE.Mesh(boardGeo, boardMat);
      circuitGroup.add(board);

      // CPU central processor chip
      const cpuGeo = new THREE.BoxGeometry(2, 0.4, 2);
      const cpuMat = new THREE.MeshStandardMaterial({
        color: 0x1d2d44,
        roughness: 0.2,
        metalness: 0.9,
      });
      const cpu = new THREE.Mesh(cpuGeo, cpuMat);
      cpu.position.set(0, 0.2, 0);
      circuitGroup.add(cpu);

      // Glowing chip core
      const chipCoreGeo = new THREE.BoxGeometry(1.4, 0.42, 1.4);
      const chipCoreMat = new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        emissive: 0x00f0ff,
        emissiveIntensity: 2.0,
      });
      const chipCore = new THREE.Mesh(chipCoreGeo, chipCoreMat);
      chipCore.position.set(0, 0.2, 0);
      circuitGroup.add(chipCore);

      // Individual transistors and details
      const detailGeo = new THREE.BoxGeometry(0.3, 0.4, 0.3);
      const detailMat = new THREE.MeshStandardMaterial({
        color: 0x7000ff,
        metalness: 0.8,
      });
      for (let x = -2.5; x <= 2.5; x += 1.2) {
        for (let z = -2.5; z <= 2.5; z += 1.2) {
          if (Math.abs(x) < 1 && Math.abs(z) < 1) continue; // Skip CPU center
          const detail = new THREE.Mesh(detailGeo, detailMat);
          detail.position.set(
            x + (Math.random() - 0.5) * 0.2,
            0.2,
            z + (Math.random() - 0.5) * 0.2,
          );
          circuitGroup.add(detail);
        }
      }

      // Add a dynamic glowing path line around CPU
      const linePoints = [
        new THREE.Vector3(-3, 0.15, -3),
        new THREE.Vector3(3, 0.15, -3),
        new THREE.Vector3(3, 0.15, 3),
        new THREE.Vector3(-3, 0.15, 3),
        new THREE.Vector3(-3, 0.15, -3),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff });
      const boardLine = new THREE.Line(lineGeo, lineMat);
      circuitGroup.add(boardLine);

      // --- Group D: Workshops & Services Floating Interactive Cards ---
      const workshopsGroup = new THREE.Group();
      workshopsGroup.position.set(-10, -12, -3);
      mainGroup.add(workshopsGroup);

      const workshopMeshes = [];
      const colors = [0x00f0ff, 0x7000ff, 0x00ff88];
      const moduleTitles = ["Embedded Systems", "Automation", "Maintenance"];

      for (let i = 0; i < 3; i++) {
        const itemGroup = new THREE.Group();
        itemGroup.position.set((i - 1) * 3.8, 0, 0);

        // Dynamic floating offset
        itemGroup.userData = {
          title: moduleTitles[i],
          originalY: 0,
          hoverProgress: 0,
          floatOffset: Math.random() * Math.PI,
          index: i,
        };

        // Outer glass enclosure
        const boxGeo = new THREE.BoxGeometry(2.4, 3.4, 0.6);
        const boxMat = new THREE.MeshPhysicalMaterial({
          color: colors[i],
          roughness: 0.1,
          metalness: 0.1,
          transmission: 0.85,
          thickness: 0.5,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
        });
        const box = new THREE.Mesh(boxGeo, boxMat);
        itemGroup.add(box);

        // Glowing core cylinder inside the box
        const innerGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.0, 16);
        const innerMat = new THREE.MeshPhysicalMaterial({
          color: colors[i],
          emissive: colors[i],
          emissiveIntensity: 0.8,
          wireframe: true,
        });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        inner.position.set(0, 0, 0);
        itemGroup.add(inner);

        workshopsGroup.add(itemGroup);
        workshopMeshes.push(itemGroup); // Keep track of interactive group
      }

      // --- Group E: Maintenance Portal Terminals & Power Lines ---
      const terminalGroup = new THREE.Group();
      terminalGroup.position.set(0, -22, 0);
      mainGroup.add(terminalGroup);

      // Sleek central ring grid
      const gridGeo = new THREE.RingGeometry(2, 4, 32);
      const gridMat = new THREE.MeshBasicMaterial({
        color: 0x7000ff,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const grid = new THREE.Mesh(gridGeo, gridMat);
      grid.rotation.x = Math.PI / 2;
      terminalGroup.add(grid);

      // Glowing power tubes
      const tubeCount = 5;
      const tubes = [];
      for (let i = 0; i < tubeCount; i++) {
        const radius = 2.5 + i * 0.45;
        const tubeGeo = new THREE.TorusGeometry(radius, 0.03, 8, 64);
        const tubeMat = new THREE.MeshPhysicalMaterial({
          color: 0x00f0ff,
          emissive: 0x00f0ff,
          emissiveIntensity: 1.0,
          transparent: true,
          opacity: 0.4,
        });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.rotation.x = Math.PI / 2;
        terminalGroup.add(tube);
        tubes.push(tube);
      }

      // 5. Mouse Interaction Tracking
      const mouse = new THREE.Vector2();
      const targetMouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();
      let hoveredModule = null;

      const onPointerMove = (event) => {
        // Normalised device coordinates (-1 to +1)
        targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      const onPointerDown = () => {
        if (hoveredModule) {
          playClick();
          // Visual pulse displacement on click
          gsap.to(hoveredModule.scale, {
            x: 1.3,
            y: 1.3,
            z: 1.3,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          });
        }
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });

      // 6. GSAP ScrollTrigger Integration
      // Link scroll steps smoothly to Three.js camera position & lookAt Target
      const cameraTargets = {
        // Scroll 0% (Hero)
        p0_pos: { x: 0, y: 0, z: 8 },
        p0_look: { x: 0, y: 0, z: 0 },
        // Scroll 15-35% (Metrics/About)
        p1_pos: { x: 9.8, y: -4.5, z: -0.5 },
        p1_look: { x: 12, y: -4, z: -6 },
        // Scroll 40-70% (Workshops)
        p2_pos: { x: -10, y: -12.5, z: 5.5 },
        p2_look: { x: -10, y: -12, z: -3 },
        // Scroll 75-100% (Maintenance Portal)
        p3_pos: { x: 0, y: -19, z: 6.5 },
        p3_look: { x: 0, y: -22, z: 0 },
      };

      // Current animated properties
      const animState = {
        camX: cameraTargets.p0_pos.x,
        camY: cameraTargets.p0_pos.y,
        camZ: cameraTargets.p0_pos.z,
        lookX: cameraTargets.p0_look.x,
        lookY: cameraTargets.p0_look.y,
        lookZ: cameraTargets.p0_look.z,
      };

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2, // Smooth interpolation
          invalidateOnRefresh: true,
        },
      });

      // Frame 1: Scroll to About/Metrics
      scrollTimeline.to(
        animState,
        {
          camX: cameraTargets.p1_pos.x,
          camY: cameraTargets.p1_pos.y,
          camZ: cameraTargets.p1_pos.z,
          lookX: cameraTargets.p1_look.x,
          lookY: cameraTargets.p1_look.y,
          lookZ: cameraTargets.p1_look.z,
          ease: "power1.inOut",
        },
        0,
      );

      // Frame 2: Scroll to Workshops
      scrollTimeline.to(
        animState,
        {
          camX: cameraTargets.p2_pos.x,
          camY: cameraTargets.p2_pos.y,
          camZ: cameraTargets.p2_pos.z,
          lookX: cameraTargets.p2_look.x,
          lookY: cameraTargets.p2_look.y,
          lookZ: cameraTargets.p2_look.z,
          ease: "power1.inOut",
        },
        1,
      );

      // Frame 3: Scroll to Maintenance Portal
      scrollTimeline.to(
        animState,
        {
          camX: cameraTargets.p3_pos.x,
          camY: cameraTargets.p3_pos.y,
          camZ: cameraTargets.p3_pos.z,
          lookX: cameraTargets.p3_look.x,
          lookY: cameraTargets.p3_look.y,
          lookZ: cameraTargets.p3_look.z,
          ease: "power1.inOut",
        },
        2,
      );

      // 7. Render Loop
      const clock = new THREE.Clock();

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Let particles drift slightly
        particleSystem.rotation.y = elapsedTime * 0.02;
        particleSystem.rotation.x = elapsedTime * 0.008;

        // Animate landing reactor rings
        coreMesh.rotation.y = elapsedTime * 0.4;
        coreMesh.rotation.x = elapsedTime * 0.25;
        ring1.rotation.y = elapsedTime * 0.6;
        ring2.rotation.x = elapsedTime * 0.5;
        ring3.rotation.z = -elapsedTime * 0.3;

        // Animate metrics circuit motherboard chip pulse
        chipCoreMat.emissiveIntensity = 1.5 + Math.sin(elapsedTime * 4) * 0.5;
        circuitGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.3;

        // Animate workshop cards floating
        workshopMeshes.forEach((mesh) => {
          const ud = mesh.userData;
          // Float height movement
          mesh.position.y =
            ud.originalY + Math.sin(elapsedTime * 1.5 + ud.floatOffset) * 0.15;
          // Soft rotational wobble
          mesh.rotation.y = Math.sin(elapsedTime * 0.8 + ud.floatOffset) * 0.08;
          mesh.rotation.x = Math.cos(elapsedTime * 0.8 + ud.floatOffset) * 0.05;

          // Inside core cylinder animation
          const innerCore = mesh.children[1];
          if (innerCore) {
            innerCore.rotation.y = elapsedTime * 1.2;
          }
        });

        // Maintenance Portal Tubes pulsating glow
        tubes.forEach((tube, idx) => {
          tube.material.emissiveIntensity =
            0.5 + Math.sin(elapsedTime * 3 - idx * 0.8) * 0.4;
          tube.rotation.z = elapsedTime * 0.08 * (idx % 2 === 0 ? 1 : -1);
        });

        // Smooth mouse parallax damping
        mouse.x += (targetMouse.x - mouse.x) * 0.06;
        mouse.y += (targetMouse.y - mouse.y) * 0.06;

        // Set camera position interpolated by scroll-linked GSAP timeline
        const parallaxOffsetLimit = isMobile ? 0.3 : 1.2;
        camera.position.x = animState.camX + mouse.x * parallaxOffsetLimit;
        camera.position.y = animState.camY + mouse.y * parallaxOffsetLimit;
        camera.position.z = animState.camZ;

        // Render camera looking at dynamic targets
        const targetLook = new THREE.Vector3(
          animState.lookX + mouse.x * parallaxOffsetLimit * 0.4,
          animState.lookY + mouse.y * parallaxOffsetLimit * 0.4,
          animState.lookZ,
        );
        camera.lookAt(targetLook);

        // Raycasting for interactive Workshop cards
        if (!isMobile) {
          raycaster.setFromCamera(mouse, camera);

          // Flatten workshop mesh hierarchy for intersection
          const interactiveObjects = [];
          workshopMeshes.forEach((group) => {
            // Include main box mesh
            interactiveObjects.push(group.children[0]);
          });

          const intersects = raycaster.intersectObjects(interactiveObjects);

          if (intersects.length > 0) {
            const intersectedBox = intersects[0].object;
            const parentGroup = intersectedBox.parent;

            if (hoveredModule !== parentGroup) {
              if (hoveredModule) {
                // Return previous to default scale & emission
                gsap.to(hoveredModule.scale, {
                  x: 1,
                  y: 1,
                  z: 1,
                  duration: 0.3,
                });
                gsap.to(hoveredModule.children[0].material, {
                  opacity: 0.45,
                  duration: 0.3,
                });
              }
              hoveredModule = parentGroup;
              playHover();
              // Animate hover: scale up and increase opacity/neon glow
              gsap.to(parentGroup.scale, {
                x: 1.15,
                y: 1.15,
                z: 1.15,
                duration: 0.3,
              });
              gsap.to(intersectedBox.material, { opacity: 0.8, duration: 0.3 });
            }
          } else {
            if (hoveredModule) {
              gsap.to(hoveredModule.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
              gsap.to(hoveredModule.children[0].material, {
                opacity: 0.45,
                duration: 0.3,
              });
              hoveredModule = null;
            }
          }
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();

      // 8. Handle Window Resize
      const handleResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        renderer.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      // Cleanups
      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("resize", handleResize);
        if (renderer && renderer.domElement) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    };

    let cleanupPromise = initThreeAndGSAP();

    return () => {
      cleanupPromise.then((cleanup) => cleanup && cleanup());
    };
  }, []);

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  return (
    <div
      ref={mountRef}
      className="scroll-scene-3d fixed inset-0 z-0 w-screen h-screen overflow-hidden pointer-events-auto"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    />
  );
};

export default ScrollScene3D;
