import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { playHover, playClick } from "../utils/audio";

// Pre-allocated scratch vectors for lightning math (saves garbage collection churn)
const _dir = new THREE.Vector3();
const _tempUp = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _pt = new THREE.Vector3();

// Fractal lightning path generator that writes coordinates directly into a pre-allocated Float32Array (ZERO allocations)
const fillLightningArray = (array, start, end, segments = 8, jitter = 0.1) => {
  _dir.subVectors(end, start);
  const len = _dir.length();

  // Start point
  array[0] = start.x;
  array[1] = start.y;
  array[2] = start.z;

  const innerEnd = segments - 2;
  for (let i = 1; i <= innerEnd; i++) {
    const t = i / (segments - 1);
    _pt.lerpVectors(start, end, t);

    // Get vectors perpendicular to line path for jitter offset
    if (Math.abs(_dir.y) < 0.9) {
      _tempUp.set(0, 1, 0);
    } else {
      _tempUp.set(1, 0, 0);
    }
    _right.crossVectors(_dir, _tempUp).normalize();
    _up.crossVectors(_right, _dir).normalize();

    // Chaotic displacement
    const dispX = (Math.random() - 0.5) * jitter * len;
    const dispY = (Math.random() - 0.5) * jitter * len;
    const dispZ = (Math.random() - 0.5) * jitter * len;

    _pt.addScaledVector(_right, dispX);
    _pt.addScaledVector(_up, dispY);
    _pt.z += dispZ;

    const idx = i * 3;
    array[idx] = _pt.x;
    array[idx + 1] = _pt.y;
    array[idx + 2] = _pt.z;
  }

  // End point
  const lastIdx = (segments - 1) * 3;
  array[lastIdx] = end.x;
  array[lastIdx + 1] = end.y;
  array[lastIdx + 2] = end.z;
};

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

      const width = container.clientWidth;
      const height = container.clientHeight;
      const scene = new THREE.Scene();

      // Determine initial theme
      const initialTheme =
        typeof document !== "undefined"
          ? document.documentElement.getAttribute("data-theme") || "dark"
          : "dark";
      const isLightInitial = initialTheme === "light";
      let isLightTheme = isLightInitial;
      const initialBg = isLightInitial ? 0xf4f7fa : 0x060913;

      scene.background = new THREE.Color(initialBg);
      scene.fog = new THREE.FogExp2(initialBg, 0.015);

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.set(0, 0, 15);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      });

      const isMobile = window.innerWidth < 768;
      const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      container.appendChild(renderer.domElement);

      // Light initial intensities
      const ambientLight = new THREE.AmbientLight(
        isLightInitial ? 0xb0c0d8 : 0x080f20,
        isLightInitial ? 1.2 : 1.8,
      );
      scene.add(ambientLight);

      const initAccPrimary = isLightInitial ? 0x0f172a : 0x00f0ff;
      const initAccSecondary = isLightInitial ? 0x3b0066 : 0x7000ff;

      const dirLight1 = new THREE.DirectionalLight(
        initAccPrimary,
        isLightInitial ? 2.0 : 3.0,
      );
      dirLight1.position.set(5, 10, 7);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(
        initAccSecondary,
        isLightInitial ? 1.5 : 2.5,
      );
      dirLight2.position.set(-5, -5, -5);
      scene.add(dirLight2);

      const pointLight = new THREE.PointLight(initAccPrimary, 3, 20);
      pointLight.position.set(0, 0, 0);
      scene.add(pointLight);

      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      // --- Group A: Particle System (Glowing Electrons) ---
      const particleCount = isMobile ? 250 : 800;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const randomSpeeds = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
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

      const particleMaterial = new THREE.PointsMaterial({
        color: initAccPrimary,
        size: isMobile ? 0.08 : 0.12,
        transparent: true,
        opacity: isLightInitial ? 0.5 : 0.6,
        blending: isLightInitial
          ? THREE.NormalBlending
          : THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particleSystem = new THREE.Points(
        particleGeometry,
        particleMaterial,
      );
      scene.add(particleSystem);

      // --- Group B: Hero/Landing Tesla Coil & Plasma Arcs ---
      const reactorGroup = new THREE.Group();
      reactorGroup.position.set(0, 0, 0);
      mainGroup.add(reactorGroup);

      // Tesla Coil base windings
      const coilBaseGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 16);
      const coilBaseMat = new THREE.MeshStandardMaterial({
        color: 0x8b4513, // copper/brown core
        roughness: 0.4,
        metalness: 0.8,
      });
      const coilBase = new THREE.Mesh(coilBaseGeo, coilBaseMat);
      coilBase.position.y = -0.5;
      reactorGroup.add(coilBase);

      // Helical wire windings around Tesla coil base
      const helixPointsBase = [];
      const coilTurns = 12;
      const coilRadius = 0.58;
      const coilLength = 1.6;
      for (let w = 0; w <= 150; w++) {
        const t = w / 150;
        const angle = t * coilTurns * Math.PI * 2;
        helixPointsBase.push(
          new THREE.Vector3(
            Math.cos(angle) * coilRadius,
            (t - 0.5) * coilLength - 0.5,
            Math.sin(angle) * coilRadius
          )
        );
      }
      const baseCoilGeo = new THREE.BufferGeometry().setFromPoints(helixPointsBase);
      const baseCoilMat = new THREE.LineBasicMaterial({ color: 0xffa500 }); // copper Orange
      const baseCoilLine = new THREE.Line(baseCoilGeo, baseCoilMat);
      reactorGroup.add(baseCoilLine);

      // Top capacitor sphere of the Tesla coil
      const coreGeo = new THREE.SphereGeometry(0.7, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({
        color: initAccPrimary,
        emissive: isLightInitial ? 0x000000 : 0x00a0cc,
        emissiveIntensity: isLightInitial ? 0.0 : 1.5,
        roughness: 0.1,
        metalness: 0.9,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = 0.6;
      reactorGroup.add(coreMesh);

      // Surrounding plasma rings
      const ringGeo1 = new THREE.TorusGeometry(2.4, 0.04, 8, 48);
      const ringMat1 = new THREE.MeshStandardMaterial({
        color: initAccSecondary,
        roughness: 0.2,
        metalness: 0.9,
      });
      const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      reactorGroup.add(ring1);

      const ringGeo2 = new THREE.TorusGeometry(2.8, 0.03, 8, 48);
      const ringMat2 = new THREE.MeshStandardMaterial({
        color: initAccPrimary,
        roughness: 0.2,
        metalness: 0.9,
      });
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      ring2.rotation.x = Math.PI / 2;
      reactorGroup.add(ring2);

      const ringGeo3 = new THREE.TorusGeometry(3.2, 0.02, 6, 32);
      const ring3 = new THREE.Mesh(ringGeo3, ringMat1);
      ring3.rotation.y = Math.PI / 4;
      reactorGroup.add(ring3);

      // Lightning discharge lines (pre-allocated Float32Array positions to prevent GC allocations)
      const lightningSegments = 8;
      const lightningArrays = [];
      const lightningGeos = [];
      const lightningLines = [];
      const lightningCount = 3;
      for (let i = 0; i < lightningCount; i++) {
        const lightningGeo = new THREE.BufferGeometry();
        const lightningArray = new Float32Array(lightningSegments * 3);
        const positionAttr = new THREE.BufferAttribute(lightningArray, 3);
        positionAttr.setUsage(THREE.DynamicDrawUsage);
        lightningGeo.setAttribute("position", positionAttr);

        const lightningMat = new THREE.LineBasicMaterial({
          color: initAccPrimary,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        });
        const line = new THREE.Line(lightningGeo, lightningMat);
        reactorGroup.add(line);
        lightningArrays.push(lightningArray);
        lightningGeos.push(lightningGeo);
        lightningLines.push(line);
      }

      // --- Group C: Club Metrics Futuristic Circuit Board ---
      const circuitGroup = new THREE.Group();
      circuitGroup.position.set(12, -4, -6);
      mainGroup.add(circuitGroup);

      const boardGeo = new THREE.BoxGeometry(7, 0.2, 7);
      const boardMat = new THREE.MeshStandardMaterial({
        color: isLightInitial ? 0xcadaec : 0x0c1424,
        roughness: 0.4,
        metalness: 0.8,
      });
      const board = new THREE.Mesh(boardGeo, boardMat);
      circuitGroup.add(board);

      const cpuGeo = new THREE.BoxGeometry(2, 0.4, 2);
      const cpuMat = new THREE.MeshStandardMaterial({
        color: isLightInitial ? 0xa2b7cc : 0x1d2d44,
        roughness: 0.2,
        metalness: 0.9,
      });
      const cpu = new THREE.Mesh(cpuGeo, cpuMat);
      cpu.position.set(0, 0.2, 0);
      circuitGroup.add(cpu);

      const chipCoreGeo = new THREE.BoxGeometry(1.4, 0.42, 1.4);
      const chipCoreMat = new THREE.MeshStandardMaterial({
        color: initAccPrimary,
        emissive: isLightInitial ? 0x000000 : initAccPrimary,
        emissiveIntensity: isLightInitial ? 0.0 : 2.0,
      });
      const chipCore = new THREE.Mesh(chipCoreGeo, chipCoreMat);
      chipCore.position.set(0, 0.2, 0);
      circuitGroup.add(chipCore);

      const detailGeo = new THREE.BoxGeometry(0.3, 0.4, 0.3);
      const detailMat = new THREE.MeshStandardMaterial({
        color: initAccSecondary,
        metalness: 0.8,
      });
      for (let x = -2.5; x <= 2.5; x += 1.2) {
        for (let z = -2.5; z <= 2.5; z += 1.2) {
          if (Math.abs(x) < 1 && Math.abs(z) < 1) continue;
          const detail = new THREE.Mesh(detailGeo, detailMat);
          detail.position.set(
            x + (Math.random() - 0.5) * 0.2,
            0.2,
            z + (Math.random() - 0.5) * 0.2,
          );
          circuitGroup.add(detail);
        }
      }

      const linePoints = [
        new THREE.Vector3(-3, 0.15, -3),
        new THREE.Vector3(3, 0.15, -3),
        new THREE.Vector3(3, 0.15, 3),
        new THREE.Vector3(-3, 0.15, 3),
        new THREE.Vector3(-3, 0.15, -3),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({ color: initAccPrimary });
      const boardLine = new THREE.Line(lineGeo, lineMat);
      circuitGroup.add(boardLine);

      // Current surges flowing along the circuit board path
      const surgeCount = 3;
      const surges = [];
      const surgeGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const surgeMat = new THREE.MeshBasicMaterial({
        color: initAccPrimary,
        transparent: true,
        opacity: 0.9,
      });
      for (let i = 0; i < surgeCount; i++) {
        const surge = new THREE.Mesh(surgeGeo, surgeMat);
        circuitGroup.add(surge);
        surges.push({
          mesh: surge,
          offset: i / surgeCount,
        });
      }

      // Helper function to interpolate position along circuit board trace (writes in-place to avoid allocations)
      const getCircuitPathPos = (progress, targetVec) => {
        const t = progress % 1.0;
        const totalLen = 24.0;
        const dist = t * totalLen;
        if (dist < 6.0) {
          targetVec.set(-3.0 + dist, 0.15, -3.0);
        } else if (dist < 12.0) {
          targetVec.set(3.0, 0.15, -3.0 + (dist - 6.0));
        } else if (dist < 18.0) {
          targetVec.set(3.0 - (dist - 12.0), 0.15, 3.0);
        } else {
          targetVec.set(-3.0, 0.15, 3.0 - (dist - 18.0));
        }
      };

      // --- Group D: Workshops & Services Electromagnetic Inductors ---
      const workshopsGroup = new THREE.Group();
      workshopsGroup.position.set(-10, -12, -3);
      mainGroup.add(workshopsGroup);

      const workshopMeshes = [];
      const colorsDark = [0x00f0ff, 0x7000ff, 0x00ff88];
      const colorsLight = [0x0f172a, 0x3b0066, 0x006633];
      const moduleTitles = ["Embedded Systems", "Automation", "Maintenance"];

      for (let i = 0; i < 3; i++) {
        const itemGroup = new THREE.Group();
        itemGroup.position.set((i - 1) * 3.8, 0, 0);

        itemGroup.userData = {
          title: moduleTitles[i],
          originalY: 0,
          hoverProgress: 0,
          floatOffset: Math.random() * Math.PI,
          index: i,
        };

        const activeColor = isLightInitial ? colorsLight[i] : colorsDark[i];

        // Core cylinder (inductor ferrite core)
        const boxGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.2, 16);
        const boxMat = new THREE.MeshStandardMaterial({
          color: isLightInitial ? 0x708090 : 0x1f2937, // dark ferrite core
          roughness: 0.5,
          metalness: 0.8,
          transparent: true,
          opacity: 0.85,
        });
        const box = new THREE.Mesh(boxGeo, boxMat);
        itemGroup.add(box);

        // Helical copper wire wrapping
        const helixPoints = [];
        const windingsCount = 12;
        const windingRadius = 0.95;
        const windingLength = 2.8;
        for (let w = 0; w <= 150; w++) {
          const t = w / 150;
          const angle = t * windingsCount * Math.PI * 2;
          helixPoints.push(
            new THREE.Vector3(
              Math.cos(angle) * windingRadius,
              (t - 0.5) * windingLength,
              Math.sin(angle) * windingRadius
            )
          );
        }
        const coilGeo = new THREE.BufferGeometry().setFromPoints(helixPoints);
        const coilMat = new THREE.LineBasicMaterial({
          color: 0xff8c00, // Copper dark orange
          linewidth: 2.0,
        });
        const coilLine = new THREE.Line(coilGeo, coilMat);
        itemGroup.add(coilLine);
        itemGroup.userData.coil = coilLine;

        // Concentric electromagnetic flux rings (concentric lines)
        const magRings = [];
        const magRingGeo = new THREE.TorusGeometry(1.2, 0.02, 6, 24);
        const magRingMat = new THREE.MeshBasicMaterial({
          color: activeColor,
          transparent: true,
          opacity: 0.35,
        });
        for (let k = 0; k < 2; k++) {
          const magRing = new THREE.Mesh(magRingGeo, magRingMat);
          magRing.rotation.x = Math.PI / 2; // Flat field
          itemGroup.add(magRing);
          magRings.push(magRing);
        }
        itemGroup.userData.magRings = magRings;

        // Inner glowing core
        const innerGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.0, 16);
        const innerMat = new THREE.MeshStandardMaterial({
          color: activeColor,
          emissive: isLightInitial ? 0x000000 : activeColor,
          emissiveIntensity: isLightInitial ? 0.0 : 1.2,
          wireframe: true,
        });
        const inner = new THREE.Mesh(innerGeo, innerMat);
        itemGroup.add(inner);

        workshopsGroup.add(itemGroup);
        workshopMeshes.push(itemGroup);
      }

      // --- Group E: Maintenance Portal Substation Towers ---
      const terminalGroup = new THREE.Group();
      terminalGroup.position.set(0, -22, 0);
      mainGroup.add(terminalGroup);

      const gridGeo = new THREE.RingGeometry(2, 4, 32);
      const gridMat = new THREE.MeshBasicMaterial({
        color: initAccSecondary,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const grid = new THREE.Mesh(gridGeo, gridMat);
      grid.rotation.x = Math.PI / 2;
      terminalGroup.add(grid);

      const tubeCount = 5;
      const tubes = [];
      for (let i = 0; i < tubeCount; i++) {
        const radius = 2.5 + i * 0.45;
        const tubeGeo = new THREE.TorusGeometry(radius, 0.03, 8, 64);
        const tubeMat = new THREE.MeshPhysicalMaterial({
          color: initAccPrimary,
          emissive: isLightInitial ? 0x000000 : initAccPrimary,
          emissiveIntensity: isLightInitial ? 0.0 : 1.0,
          transparent: true,
          opacity: 0.4,
        });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.rotation.x = Math.PI / 2;
        terminalGroup.add(tube);
        tubes.push(tube);
      }

      // High voltage insulator stack towers
      const tower1 = new THREE.Group();
      tower1.position.set(-3.5, 0, 0);
      terminalGroup.add(tower1);
      
      const tower2 = new THREE.Group();
      tower2.position.set(3.5, 0, 0);
      terminalGroup.add(tower2);
      
      const discGeo = new THREE.CylinderGeometry(0.6, 0.8, 0.15, 8);
      const discMat = new THREE.MeshStandardMaterial({
        color: isLightInitial ? 0x90a0b0 : 0x1a2b4c,
        roughness: 0.3,
        metalness: 0.8,
      });
      for (let k = 0; k < 6; k++) {
        const d1 = new THREE.Mesh(discGeo, discMat);
        d1.position.y = k * 0.3;
        tower1.add(d1);
        
        const d2 = new THREE.Mesh(discGeo, discMat);
        d2.position.y = k * 0.3;
        tower2.add(d2);
      }

      // Electric busbar line connecting tower tops (pre-allocated Float32Array positions to prevent GC allocations)
      const busbarSegments = 10;
      const busbarArray = new Float32Array(busbarSegments * 3);
      const busbarGeo = new THREE.BufferGeometry();
      const busbarPosAttr = new THREE.BufferAttribute(busbarArray, 3);
      busbarPosAttr.setUsage(THREE.DynamicDrawUsage);
      busbarGeo.setAttribute("position", busbarPosAttr);

      const busbarMat = new THREE.LineBasicMaterial({
        color: initAccPrimary,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const busbarLine = new THREE.Line(busbarGeo, busbarMat);
      terminalGroup.add(busbarLine);

      // --- Group F: Committee Analog Oscilloscope ---
      const committeeGroup = new THREE.Group();
      committeeGroup.position.set(10, -32, -6);
      mainGroup.add(committeeGroup);

      // CRT Display Housing Box
      const scopeHousingGeo = new THREE.BoxGeometry(4.4, 3.4, 0.8);
      const scopeHousingMat = new THREE.MeshStandardMaterial({
        color: isLightInitial ? 0xd0d0d8 : 0x181a20,
        roughness: 0.5,
        metalness: 0.7,
      });
      const scopeHousing = new THREE.Mesh(scopeHousingGeo, scopeHousingMat);
      committeeGroup.add(scopeHousing);

      // Screen glass
      const scopeScreenGeo = new THREE.BoxGeometry(4.0, 3.0, 0.82);
      const scopeScreenMat = new THREE.MeshStandardMaterial({
        color: 0x051d10, // dark phosphor tint
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8,
      });
      const scopeScreen = new THREE.Mesh(scopeScreenGeo, scopeScreenMat);
      committeeGroup.add(scopeScreen);

      // Oscilloscope screen grid pattern
      const scopeGridGeo = new THREE.PlaneGeometry(3.6, 2.6);
      const scopeGridMat = new THREE.MeshBasicMaterial({
        color: 0x005522, // dim green grid lines
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      const scopeGrid = new THREE.Mesh(scopeGridGeo, scopeGridMat);
      scopeGrid.position.z = 0.42;
      committeeGroup.add(scopeGrid);

      // Waveform line on the screen
      const wavePointsCount = 80;
      const waveGeo = new THREE.BufferGeometry();
      const wavePos = new Float32Array(wavePointsCount * 3);
      waveGeo.setAttribute("position", new THREE.BufferAttribute(wavePos, 3));
      const waveMat = new THREE.LineBasicMaterial({
        color: 0x00ff88, // Phosphor bright green
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      const oscilloscopeLine = new THREE.Line(waveGeo, waveMat);
      oscilloscopeLine.position.z = 0.43;
      committeeGroup.add(oscilloscopeLine);

      // --- Group G: Newsletter Transmitter Antenna ---
      const newsletterGroup = new THREE.Group();
      newsletterGroup.position.set(-12, -42, -4);
      mainGroup.add(newsletterGroup);

      // Vertical antenna pole
      const antennaPoleGeo = new THREE.CylinderGeometry(0.12, 0.22, 3.8, 16);
      const antennaPoleMat = new THREE.MeshStandardMaterial({
        color: isLightInitial ? 0x708090 : 0x2d3748,
        roughness: 0.4,
        metalness: 0.8,
      });
      const antennaPole = new THREE.Mesh(antennaPoleGeo, antennaPoleMat);
      newsletterGroup.add(antennaPole);

      // Top dome/sphere representing the active dome
      const transmitterGeo = new THREE.SphereGeometry(0.6, 16, 16);
      const transmitterMat = new THREE.MeshStandardMaterial({
        color: initAccPrimary,
        roughness: 0.3,
        metalness: 0.8,
      });
      const transmitter = new THREE.Mesh(transmitterGeo, transmitterMat);
      transmitter.position.y = 1.9;
      newsletterGroup.add(transmitter);

      const waveCount = 3;
      const waveRings = [];
      for (let i = 0; i < waveCount; i++) {
        const ringGeo = new THREE.RingGeometry(1.0, 1.05, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: initAccSecondary,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.y = 1.9; // Radiate from the top dome
        ring.rotation.x = Math.PI / 2;
        newsletterGroup.add(ring);
        waveRings.push({
          mesh: ring,
          speed: 0.8 + i * 0.2,
          delay: i * 0.5,
        });
      }

      // --- Group H: Contact Transmission Grid Globe ---
      const contactGroup = new THREE.Group();
      contactGroup.position.set(0, -52, 0);
      mainGroup.add(contactGroup);

      // Rotating transmission wireframe globe
      const globeGeo = new THREE.SphereGeometry(3.5, 18, 18);
      const globeMat = new THREE.MeshStandardMaterial({
        color: initAccPrimary,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
      });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      contactGroup.add(globe);

      const globeInnerGeo = new THREE.IcosahedronGeometry(2.2, 1);
      const globeInnerMat = new THREE.MeshStandardMaterial({
        color: initAccSecondary,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const globeInner = new THREE.Mesh(globeInnerGeo, globeInnerMat);
      contactGroup.add(globeInner);

      const nodeCount = 12;
      const globeNodes = [];
      const nodeGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: initAccPrimary,
      });
      for (let i = 0; i < nodeCount; i++) {
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        node.position.set(
          3.5 * Math.sin(phi) * Math.cos(theta),
          3.5 * Math.sin(phi) * Math.sin(theta),
          3.5 * Math.cos(phi)
        );
        contactGroup.add(node);
        globeNodes.push(node);
      }


      // --- Dynamic Theme Swapping Logic ---
      const updateThemeColors = (themeName) => {
        const isLight = themeName === "light";
        const bgVal = isLight ? 0xf4f7fa : 0x060913;
        const accPrimary = isLight ? 0x0f172a : 0x00f0ff;
        const accSecondary = isLight ? 0x3b0066 : 0x7000ff;

        // Transition background and fog
        gsap.to(scene.background, {
          r: ((bgVal >> 16) & 255) / 255,
          g: ((bgVal >> 8) & 255) / 255,
          b: (bgVal & 255) / 255,
          duration: 0.8,
        });

        gsap.to(scene.fog.color, {
          r: ((bgVal >> 16) & 255) / 255,
          g: ((bgVal >> 8) & 255) / 255,
          b: (bgVal & 255) / 255,
          duration: 0.8,
        });

        // Transition lights
        gsap.to(ambientLight.color, {
          r: isLight ? 0.69 : 0.03,
          g: isLight ? 0.75 : 0.06,
          b: isLight ? 0.85 : 0.12,
          duration: 0.8,
        });
        ambientLight.intensity = isLight ? 1.2 : 1.8;

        gsap.to(dirLight1.color, {
          r: ((accPrimary >> 16) & 255) / 255,
          g: ((accPrimary >> 8) & 255) / 255,
          b: (accPrimary & 255) / 255,
          duration: 0.8,
        });
        dirLight1.intensity = isLight ? 2.0 : 3.0;

        gsap.to(dirLight2.color, {
          r: ((accSecondary >> 16) & 255) / 255,
          g: ((accSecondary >> 8) & 255) / 255,
          b: (accSecondary & 255) / 255,
          duration: 0.8,
        });
        dirLight2.intensity = isLight ? 1.5 : 2.5;

        gsap.to(pointLight.color, {
          r: ((accPrimary >> 16) & 255) / 255,
          g: ((accPrimary >> 8) & 255) / 255,
          b: (accPrimary & 255) / 255,
          duration: 0.8,
        });

        // Transition particles
        gsap.to(particleMaterial.color, {
          r: ((accPrimary >> 16) & 255) / 255,
          g: ((accPrimary >> 8) & 255) / 255,
          b: (accPrimary & 255) / 255,
          duration: 0.8,
        });
        particleMaterial.opacity = isLight ? 0.5 : 0.6;
        particleMaterial.blending = isLight
          ? THREE.NormalBlending
          : THREE.AdditiveBlending;

        // Transition reactor core
        gsap.to(coreMat.color, {
          r: ((accPrimary >> 16) & 255) / 255,
          g: ((accPrimary >> 8) & 255) / 255,
          b: (accPrimary & 255) / 255,
          duration: 0.8,
        });

        gsap.to(coreMat.emissive, {
          r: isLight ? 0 : ((0x00a0cc >> 16) & 255) / 255,
          g: isLight ? 0 : ((0x00a0cc >> 8) & 255) / 255,
          b: isLight ? 0 : (0x00a0cc & 255) / 255,
          duration: 0.8,
        });
        coreMat.emissiveIntensity = isLight ? 0.0 : 1.2;

        // Transition motherboard board colors
        gsap.to(boardMat.color, {
          r: isLight ? 0.79 : 0.04,
          g: isLight ? 0.85 : 0.08,
          b: isLight ? 0.92 : 0.14,
          duration: 0.8,
        });

        gsap.to(cpuMat.color, {
          r: isLight ? 0.63 : 0.11,
          g: isLight ? 0.71 : 0.17,
          b: isLight ? 0.8 : 0.26,
          duration: 0.8,
        });

        // Transition line colors
        gsap.to(lineMat.color, {
          r: ((accPrimary >> 16) & 255) / 255,
          g: ((accPrimary >> 8) & 255) / 255,
          b: (accPrimary & 255) / 255,
          duration: 0.8,
        });

        gsap.to(chipCoreMat.color, {
          r: ((accPrimary >> 16) & 255) / 255,
          g: ((accPrimary >> 8) & 255) / 255,
          b: (accPrimary & 255) / 255,
          duration: 0.8,
        });

        gsap.to(chipCoreMat.emissive, {
          r: isLight ? 0 : ((accPrimary >> 16) & 255) / 255,
          g: isLight ? 0 : ((accPrimary >> 8) & 255) / 255,
          b: isLight ? 0 : (accPrimary & 255) / 255,
          duration: 0.8,
        });
        chipCoreMat.emissiveIntensity = isLight ? 0.0 : 2.0;

        // Transition workshop card meshes
        workshopMeshes.forEach((mesh, index) => {
          const actColor = isLight ? colorsLight[index] : colorsDark[index];

          gsap.to(mesh.children[0].material.color, {
            r: ((actColor >> 16) & 255) / 255,
            g: ((actColor >> 8) & 255) / 255,
            b: (actColor & 255) / 255,
            duration: 0.8,
          });

          gsap.to(mesh.children[1].material.color, {
            r: ((actColor >> 16) & 255) / 255,
            g: ((actColor >> 8) & 255) / 255,
            b: (actColor & 255) / 255,
            duration: 0.8,
          });

          gsap.to(mesh.children[1].material.emissive, {
            r: isLight ? 0 : ((actColor >> 16) & 255) / 255,
            g: isLight ? 0 : ((actColor >> 8) & 255) / 255,
            b: isLight ? 0 : (actColor & 255) / 255,
            duration: 0.8,
          });
          mesh.children[1].material.emissiveIntensity = isLight ? 0.0 : 0.8;
        });

        // Transition maintenance portal grid
        gsap.to(gridMat.color, {
          r: ((accSecondary >> 16) & 255) / 255,
          g: ((accSecondary >> 8) & 255) / 255,
          b: (accSecondary & 255) / 255,
          duration: 0.8,
        });

        tubes.forEach((tube) => {
          gsap.to(tube.material.color, {
            r: ((accPrimary >> 16) & 255) / 255,
            g: ((accPrimary >> 8) & 255) / 255,
            b: (accPrimary & 255) / 255,
            duration: 0.8,
          });
          gsap.to(tube.material.emissive, {
            r: isLight ? 0 : ((accPrimary >> 16) & 255) / 255,
            g: isLight ? 0 : ((accPrimary >> 8) & 255) / 255,
            b: isLight ? 0 : (accPrimary & 255) / 255,
            duration: 0.8,
          });
          tube.material.emissiveIntensity = isLight ? 0.0 : 1.0;
        });

        // Transition Group F (Committee hologram)
        gsap.to(hologramCoreMat.color, {
          r: ((accPrimary >> 16) & 255) / 255,
          g: ((accPrimary >> 8) & 255) / 255,
          b: (accPrimary & 255) / 255,
          duration: 0.8,
        });
        gsap.to(hologramCoreMat.emissive, {
          r: isLight ? 0 : ((accPrimary >> 16) & 255) / 255,
          g: isLight ? 0 : ((accPrimary >> 8) & 255) / 255,
          b: isLight ? 0 : (accPrimary & 255) / 255,
          duration: 0.8,
        });
        hologramCoreMat.emissiveIntensity = isLight ? 0.0 : 1.2;

        gsap.to(satMat.color, {
          r: ((accSecondary >> 16) & 255) / 255,
          g: ((accSecondary >> 8) & 255) / 255,
          b: (accSecondary & 255) / 255,
          duration: 0.8,
        });

        // Transition Group G (Newsletter transmitter and waves)
        gsap.to(transmitterMat.color, {
          r: ((accPrimary >> 16) & 255) / 255,
          g: ((accPrimary >> 8) & 255) / 255,
          b: (accPrimary & 255) / 255,
          duration: 0.8,
        });
        waveRings.forEach((wave) => {
          gsap.to(wave.mesh.material.color, {
            r: ((accSecondary >> 16) & 255) / 255,
            g: ((accSecondary >> 8) & 255) / 255,
            b: (accSecondary & 255) / 255,
            duration: 0.8,
          });
        });

        // Transition Group H (Contact globe)
        gsap.to(globeMat.color, {
          r: ((accPrimary >> 16) & 255) / 255,
          g: ((accPrimary >> 8) & 255) / 255,
          b: (accPrimary & 255) / 255,
          duration: 0.8,
        });
        gsap.to(globeInnerMat.color, {
          r: ((accSecondary >> 16) & 255) / 255,
          g: ((accSecondary >> 8) & 255) / 255,
          b: (accSecondary & 255) / 255,
          duration: 0.8,
        });
        gsap.to(nodeMat.color, {
          r: ((accPrimary >> 16) & 255) / 255,
          g: ((accPrimary >> 8) & 255) / 255,
          b: (accPrimary & 255) / 255,
          duration: 0.8,
        });
      };

      // Set up theme MutationObserver
      const observer = new MutationObserver((mutations) => {
        for (let i = 0; i < mutations.length; i++) {
          const mutation = mutations[i];
          if (mutation.attributeName === "data-theme") {
            const currentTheme =
              document.documentElement.getAttribute("data-theme") || "dark";
            isLightTheme = currentTheme === "light";
            updateThemeColors(currentTheme);
          }
        }
      });
      observer.observe(document.documentElement, { attributes: true });

      // 5. Mouse Interaction Tracking
      const mouse = new THREE.Vector2();
      const targetMouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();
      let hoveredModule = null;

      const onPointerMove = (event) => {
        targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      };

      const onPointerDown = () => {
        if (hoveredModule) {
          playClick();
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
      const cameraTargets = {
        p0_pos: { x: 0, y: 0, z: 8 },
        p0_look: { x: 0, y: 0, z: 0 },
        p1_pos: { x: 9.8, y: -4.5, z: -0.5 },
        p1_look: { x: 12, y: -4, z: -6 },
        p2_pos: { x: -10, y: -12.5, z: 5.5 },
        p2_look: { x: -10, y: -12, z: -3 },
        p3_pos: { x: 0, y: -19, z: 6.5 },
        p3_look: { x: 0, y: -22, z: 0 },
        p4_pos: { x: 8, y: -29, z: -1 },
        p4_look: { x: 10, y: -32, z: -6 },
        p5_pos: { x: -10, y: -39, z: 4 },
        p5_look: { x: -12, y: -42, z: -4 },
        p6_pos: { x: 0, y: -48, z: 8 },
        p6_look: { x: 0, y: -52, z: 0 },
      };

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
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

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

      scrollTimeline.to(
        animState,
        {
          camX: cameraTargets.p4_pos.x,
          camY: cameraTargets.p4_pos.y,
          camZ: cameraTargets.p4_pos.z,
          lookX: cameraTargets.p4_look.x,
          lookY: cameraTargets.p4_look.y,
          lookZ: cameraTargets.p4_look.z,
          ease: "power1.inOut",
        },
        3,
      );

      scrollTimeline.to(
        animState,
        {
          camX: cameraTargets.p5_pos.x,
          camY: cameraTargets.p5_pos.y,
          camZ: cameraTargets.p5_pos.z,
          lookX: cameraTargets.p5_look.x,
          lookY: cameraTargets.p5_look.y,
          lookZ: cameraTargets.p5_look.z,
          ease: "power1.inOut",
        },
        4,
      );

      scrollTimeline.to(
        animState,
        {
          camX: cameraTargets.p6_pos.x,
          camY: cameraTargets.p6_pos.y,
          camZ: cameraTargets.p6_pos.z,
          lookX: cameraTargets.p6_look.x,
          lookY: cameraTargets.p6_look.y,
          lookZ: cameraTargets.p6_look.z,
          ease: "power1.inOut",
        },
        5,
      );


      // 7. Render Loop
      const startTime = performance.now();
      let lastFrameCount = -1;
      let lastSubFrameCount = -1;

      // Pre-allocated math structures for rendering to avoid runtime memory allocations
      const startPt = new THREE.Vector3(0, 0.6, 0);
      const endPts = [
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ];
      const t1Top = new THREE.Vector3(-3.5, 1.8, 0);
      const t2Top = new THREE.Vector3(3.5, 1.8, 0);
      const surgeVec = new THREE.Vector3();

      const animate = () => {
        const elapsedTime = (performance.now() - startTime) * 0.001;

        particleSystem.rotation.y = elapsedTime * 0.02;
        particleSystem.rotation.x = elapsedTime * 0.008;

        // Animate Group B (Tesla Coil) - active when near top
        if (animState.camY > -6.0) {
          coreMesh.rotation.y = elapsedTime * 0.2;
          ring1.rotation.y = elapsedTime * 0.6;
          ring2.rotation.x = elapsedTime * 0.5;
          ring3.rotation.z = -elapsedTime * 0.3;

          // Generate Tesla coil lightning discharges connecting to the rings (ZERO allocations)
          endPts[0].set(Math.cos(elapsedTime * 0.6) * 2.4, 0, Math.sin(elapsedTime * 0.6) * 2.4);
          endPts[1].set(0, Math.cos(elapsedTime * 0.5) * 2.8, Math.sin(elapsedTime * 0.5) * 2.8);
          endPts[2].set(Math.cos(-elapsedTime * 0.3) * 3.2, Math.sin(-elapsedTime * 0.3) * 3.2, 0);

          const currentFrame = Math.floor(elapsedTime * 18); // ~18fps flicker
          if (currentFrame !== lastFrameCount) {
            for (let i = 0; i < lightningCount; i++) {
              // 20% chance of no discharge for realistic crackling gap
              if (Math.random() > 0.2) {
                lightningLines[i].visible = true;
                fillLightningArray(lightningArrays[i], startPt, endPts[i], lightningSegments, 0.08);
                lightningGeos[i].attributes.position.needsUpdate = true;
              } else {
                lightningLines[i].visible = false;
              }
            }
            lastFrameCount = currentFrame;
          }
        } else {
          for (let i = 0; i < lightningCount; i++) {
            lightningLines[i].visible = false;
          }
        }

        chipCoreMat.emissiveIntensity =
          (isLightTheme ? 0.0 : 1.5) + Math.sin(elapsedTime * 4) * 0.5;

        // Animate Group C (Motherboard traces & surges - active when nearby)
        circuitGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.3;
        if (animState.camY < -1.0 && animState.camY > -9.0) {
          for (let i = 0; i < surges.length; i++) {
            const s = surges[i];
            const t = (elapsedTime * 0.08 + s.offset) % 1.0;
            getCircuitPathPos(t, surgeVec);
            s.mesh.position.copy(surgeVec);
          }
        }

        // Animate Group D (Electromagnetic Inductors - active when nearby)
        if (animState.camY < -7.0 && animState.camY > -24.0) {
          for (let i = 0; i < workshopMeshes.length; i++) {
            const mesh = workshopMeshes[i];
            const ud = mesh.userData;
            mesh.position.y =
              ud.originalY + Math.sin(elapsedTime * 1.5 + ud.floatOffset) * 0.15;
            mesh.rotation.y = Math.sin(elapsedTime * 0.8 + ud.floatOffset) * 0.08;
            mesh.rotation.x = Math.cos(elapsedTime * 0.8 + ud.floatOffset) * 0.05;

            // Rotate coil wrapping
            if (ud.coil) {
              ud.coil.rotation.y = elapsedTime * 1.4;
            }

            // Expand electromagnetic flux field rings
            const magRings = ud.magRings;
            if (magRings) {
              for (let k = 0; k < magRings.length; k++) {
                const ring = magRings[k];
                const p = ((elapsedTime * 0.6 + k * 0.5) % 1.0);
                const scaleVal = 1.0 + p * 1.6;
                ring.scale.set(scaleVal, 1.0, scaleVal);
                ring.material.opacity = (1.0 - p) * 0.4;
              }
            }

            // Inner core wireframe spin
            const innerCore = mesh.children[mesh.children.length - 1];
            if (innerCore) {
              innerCore.rotation.y = -elapsedTime * 0.8;
            }
          }
        }

        // Animate Group E (Substation Insulators & Busbar - active when nearby)
        if (animState.camY < -23.0 && animState.camY > -35.0) {
          for (let i = 0; i < tubes.length; i++) {
            const tube = tubes[i];
            tube.material.emissiveIntensity = isLightTheme
              ? 0.0
              : 0.5 + Math.sin(elapsedTime * 3 - i * 0.8) * 0.4;
            tube.rotation.z = elapsedTime * 0.08 * (i % 2 === 0 ? 1 : -1);
          }

          const currentFrame = Math.floor(elapsedTime * 18);
          if (currentFrame !== lastSubFrameCount) {
            // Spark jitter probability
            if (Math.random() > 0.3) {
              busbarLine.visible = true;
              fillLightningArray(busbarArray, t1Top, t2Top, busbarSegments, 0.02);
              busbarGeo.attributes.position.needsUpdate = true;
            } else {
              busbarLine.visible = false;
            }
            lastSubFrameCount = currentFrame;
          }
        } else {
          busbarLine.visible = false;
        }

        // Animate Group F (Analog Oscilloscope wave - active when nearby)
        if (oscilloscopeLine && animState.camY < -33.0 && animState.camY > -44.0) {
          const positions = waveGeo.attributes.position.array;
          const width = 3.6;
          for (let i = 0; i < wavePointsCount; i++) {
            const t = i / (wavePointsCount - 1);
            const x = (t - 0.5) * width;
            
            // Amplitude modulation & frequency oscillation
            const phase = elapsedTime * 5.0;
            const amp = Math.sin(elapsedTime * 1.1) * 0.5 + 0.65;
            const freq = 11.0 + Math.cos(elapsedTime * 1.8) * 3.5;
            const y = Math.sin(x * freq + phase) * 0.7 * amp;
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = 0.05;
          }
          waveGeo.attributes.position.needsUpdate = true;
        }

        // Animate Group G (Antenna signal waves - active when nearby)
        if (animState.camY < -33.0 && animState.camY > -54.0) {
          for (let i = 0; i < waveRings.length; i++) {
            const wave = waveRings[i];
            const progress = ((elapsedTime + wave.delay) % 2) / 2;
            const currentScale = 1.0 + progress * 5.0;
            wave.mesh.scale.set(currentScale, currentScale, currentScale);
            wave.mesh.material.opacity = isLightTheme ? (1 - progress) * 0.35 : (1 - progress) * 0.6;
          }
          transmitter.rotation.y = elapsedTime * 0.5;
        }

        // Animate Group H (Contact Globe - active when near bottom)
        if (animState.camY < -42.0) {
          contactGroup.rotation.y = elapsedTime * 0.15;
          contactGroup.rotation.x = elapsedTime * 0.08;
          globeInner.rotation.y = -elapsedTime * 0.3;
          for (let i = 0; i < globeNodes.length; i++) {
            const node = globeNodes[i];
            const scale = 1 + Math.sin(elapsedTime * 4 + i) * 0.3;
            node.scale.set(scale, scale, scale);
          }
        }


        mouse.x += (targetMouse.x - mouse.x) * 0.06;
        mouse.y += (targetMouse.y - mouse.y) * 0.06;

        const parallaxOffsetLimit = isMobile ? 0.3 : 1.2;
        camera.position.x = animState.camX + mouse.x * parallaxOffsetLimit;
        camera.position.y = animState.camY + mouse.y * parallaxOffsetLimit;
        camera.position.z = animState.camZ;

        const targetLook = new THREE.Vector3(
          animState.lookX + mouse.x * parallaxOffsetLimit * 0.4,
          animState.lookY + mouse.y * parallaxOffsetLimit * 0.4,
          animState.lookZ,
        );
        camera.lookAt(targetLook);

        if (!isMobile) {
          raycaster.setFromCamera(mouse, camera);
          const interactiveObjects = [];
          workshopMeshes.forEach((group) => {
            interactiveObjects.push(group.children[0]);
          });

          const intersects = raycaster.intersectObjects(interactiveObjects);

          if (intersects.length > 0) {
            const intersectedBox = intersects[0].object;
            const parentGroup = intersectedBox.parent;

            if (hoveredModule !== parentGroup) {
              if (hoveredModule) {
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

      const handleResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        observer.disconnect();
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
