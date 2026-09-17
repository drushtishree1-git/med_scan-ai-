import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Maximize2, 
  RotateCcw, 
  Eye, 
  Layers, 
  Activity, 
  Sparkles, 
  Info, 
  Sliders, 
  CheckCircle2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Anatomy3DMarker } from '../../types';

interface Medical3DViewerProps {
  selectedOrgan?: 'Lungs' | 'Brain' | 'Heart' | 'Spine';
  onSelectMarker?: (marker: Anatomy3DMarker) => void;
  showControls?: boolean;
}

const SAMPLE_MARKERS: Anatomy3DMarker[] = [
  {
    id: 'MK-1',
    name: 'Right Lower Lobe Parenchyma',
    organ: 'Lungs',
    position: [0.8, -0.3, 0.4],
    condition: 'Observation',
    notes: 'Mild localized opacity; no dense consolidation or pleural effusion.',
    modality: 'xray',
  },
  {
    id: 'MK-2',
    name: 'Left Bronchovascular Bundle',
    organ: 'Lungs',
    position: [-0.7, 0.2, 0.3],
    condition: 'Normal',
    notes: 'Normal caliber and vascular arborization.',
    modality: 'ct',
  },
  {
    id: 'MK-3',
    name: 'Left Frontal Cortex Sulci',
    organ: 'Brain',
    position: [-0.6, 0.5, 0.5],
    condition: 'Normal',
    notes: 'No mass effect or abnormal FLAIR hyperintensities.',
    modality: 'mri',
  },
  {
    id: 'MK-4',
    name: 'Coronary Anterior Descending Axis',
    organ: 'Heart',
    position: [0.2, 0.1, 0.8],
    condition: 'Normal',
    notes: 'Smooth lumen margins without calcification plaques.',
    modality: 'ct',
  },
];

export const Medical3DViewer: React.FC<Medical3DViewerProps> = ({
  selectedOrgan = 'Lungs',
  onSelectMarker,
  showControls = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeOrgan, setActiveOrgan] = useState<'Lungs' | 'Brain' | 'Heart' | 'Spine'>(selectedOrgan);
  const [renderMode, setRenderMode] = useState<'blueprint' | 'volumetric' | 'thermal' | 'xray'>('blueprint');
  const [slicePlane, setSlicePlane] = useState<'none' | 'axial' | 'sagittal' | 'coronal'>('none');
  const [slicePosition, setSlicePosition] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeMarker, setActiveMarker] = useState<Anatomy3DMarker | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const sliceMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    setActiveOrgan(selectedOrgan);
  }, [selectedOrgan]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f172a); // Deep slate slate-900

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x818cf8, 1.0);
    dirLight2.position.set(-5, -5, -3);
    scene.add(dirLight2);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(6, 12, 0x334155, 0x1e293b);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Group for Anatomy Meshes
    const anatomyGroup = new THREE.Group();
    scene.add(anatomyGroup);
    meshGroupRef.current = anatomyGroup;

    // Build Organ Mesh Geometry based on activeOrgan
    buildOrganMesh(activeOrgan, renderMode, anatomyGroup);

    // Slice Plane Mesh
    const planeGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const sliceMesh = new THREE.Mesh(planeGeo, planeMat);
    sliceMesh.visible = false;
    scene.add(sliceMesh);
    sliceMeshRef.current = sliceMesh;

    // Mouse Interaction / Orbit Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !anatomyGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      anatomyGroup.rotation.y += deltaX * 0.008;
      anatomyGroup.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z = Math.max(2.5, Math.min(10, cameraRef.current.position.z + e.deltaY * 0.005));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Touch Support for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && anatomyGroup) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        anatomyGroup.rotation.y += deltaX * 0.01;
        anatomyGroup.rotation.x += deltaY * 0.01;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    dom.addEventListener('touchstart', onTouchStart);
    dom.addEventListener('touchmove', onTouchMove);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging && anatomyGroup) {
        anatomyGroup.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('touchstart', onTouchStart);
      dom.removeEventListener('touchmove', onTouchMove);
      renderer.dispose();
    };
  }, [activeOrgan, renderMode]);

  // Update Slice Plane
  useEffect(() => {
    if (!sliceMeshRef.current) return;
    const slice = sliceMeshRef.current;
    if (slicePlane === 'none') {
      slice.visible = false;
    } else {
      slice.visible = true;
      if (slicePlane === 'axial') {
        slice.rotation.set(Math.PI / 2, 0, 0);
        slice.position.set(0, slicePosition, 0);
      } else if (slicePlane === 'sagittal') {
        slice.rotation.set(0, Math.PI / 2, 0);
        slice.position.set(slicePosition, 0, 0);
      } else if (slicePlane === 'coronal') {
        slice.rotation.set(0, 0, 0);
        slice.position.set(0, 0, slicePosition);
      }
    }
  }, [slicePlane, slicePosition]);

  const buildOrganMesh = (organ: string, mode: string, group: THREE.Group) => {
    group.clear();

    const getMaterial = (color: number, opacity = 0.85, wireframe = false) => {
      if (mode === 'blueprint') {
        return new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          wireframe: true,
          transparent: true,
          opacity: 0.75,
          emissive: 0x0284c7,
          emissiveIntensity: 0.4,
        });
      } else if (mode === 'thermal') {
        return new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          roughness: 0.3,
          metalness: 0.2,
          emissive: 0xe11d48,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.9,
        });
      } else if (mode === 'xray') {
        return new THREE.MeshPhysicalMaterial({
          color: 0xe2e8f0,
          roughness: 0.1,
          transmission: 0.6,
          thickness: 0.8,
          transparent: true,
          opacity: 0.6,
          wireframe,
        });
      } else {
        // Volumetric
        return new THREE.MeshStandardMaterial({
          color,
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
          opacity,
        });
      }
    };

    if (organ === 'Lungs') {
      // Right & Left Lung lobes
      const rightLungGeo = new THREE.CapsuleGeometry(0.7, 1.2, 8, 16);
      const rightLungMat = getMaterial(0x38bdf8, 0.8);
      const rightLung = new THREE.Mesh(rightLungGeo, rightLungMat);
      rightLung.position.set(0.85, 0, 0);
      rightLung.scale.set(0.9, 1.1, 0.8);
      group.add(rightLung);

      const leftLungGeo = new THREE.CapsuleGeometry(0.65, 1.1, 8, 16);
      const leftLungMat = getMaterial(0x38bdf8, 0.8);
      const leftLung = new THREE.Mesh(leftLungGeo, leftLungMat);
      leftLung.position.set(-0.85, -0.05, 0);
      leftLung.scale.set(0.85, 1.05, 0.75);
      group.add(leftLung);

      // Trachea and Bronchial tree
      const tracheaGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
      const tracheaMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3 });
      const trachea = new THREE.Mesh(tracheaGeo, tracheaMat);
      trachea.position.set(0, 1.1, 0);
      group.add(trachea);

      // Heart outline shadow
      const heartGeo = new THREE.SphereGeometry(0.45, 16, 16);
      const heartMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.6 });
      const heart = new THREE.Mesh(heartGeo, heartMat);
      heart.position.set(-0.15, -0.2, 0.2);
      group.add(heart);
    } else if (organ === 'Brain') {
      // Left and Right Hemispheres
      const leftHemiGeo = new THREE.SphereGeometry(1.1, 24, 24);
      leftHemiGeo.scale(0.8, 1.0, 1.2);
      const brainMat = getMaterial(0xa855f7, 0.85);
      const leftHemi = new THREE.Mesh(leftHemiGeo, brainMat);
      leftHemi.position.set(-0.35, 0, 0);
      group.add(leftHemi);

      const rightHemiGeo = new THREE.SphereGeometry(1.1, 24, 24);
      rightHemiGeo.scale(0.8, 1.0, 1.2);
      const rightHemi = new THREE.Mesh(rightHemiGeo, brainMat);
      rightHemi.position.set(0.35, 0, 0);
      group.add(rightHemi);

      // Cerebellum
      const cerebGeo = new THREE.SphereGeometry(0.5, 16, 16);
      const cerebMat = getMaterial(0x818cf8, 0.9);
      const cereb = new THREE.Mesh(cerebGeo, cerebMat);
      cereb.position.set(0, -0.8, -0.6);
      group.add(cereb);

      // Brainstem
      const stemGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.9, 16);
      const stem = new THREE.Mesh(stemGeo, new THREE.MeshStandardMaterial({ color: 0x64748b }));
      stem.position.set(0, -1.0, -0.2);
      group.add(stem);
    } else if (organ === 'Heart') {
      // Main Myocardium Volume
      const heartGeo = new THREE.DodecahedronGeometry(1.1, 2);
      heartGeo.scale(0.9, 1.2, 0.9);
      const heartMat = getMaterial(0xef4444, 0.9);
      const heartMesh = new THREE.Mesh(heartGeo, heartMat);
      group.add(heartMesh);

      // Aorta Arch
      const aortaGeo = new THREE.TorusGeometry(0.4, 0.14, 12, 24, Math.PI * 0.8);
      const aortaMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
      const aorta = new THREE.Mesh(aortaGeo, aortaMat);
      aorta.position.set(0, 0.9, 0);
      aorta.rotation.set(0, 0, -Math.PI / 4);
      group.add(aorta);

      // Pulmonary Artery
      const pulmGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 12);
      const pulmMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
      const pulm = new THREE.Mesh(pulmGeo, pulmMat);
      pulm.position.set(-0.3, 0.7, 0.2);
      group.add(pulm);
    } else {
      // Spine
      for (let i = -5; i <= 5; i++) {
        const vertGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.2, 16);
        const vertMat = getMaterial(0xf8fafc, 0.95);
        const vert = new THREE.Mesh(vertGeo, vertMat);
        vert.position.set(0, i * 0.32, 0);
        group.add(vert);

        // Intervertebral disc
        if (i < 5) {
          const discGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 16);
          const discMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
          const disc = new THREE.Mesh(discGeo, discMat);
          disc.position.set(0, i * 0.32 + 0.16, 0);
          group.add(disc);
        }
      }
    }

    // Add glowing clinical landmark markers
    SAMPLE_MARKERS.filter((m) => m.organ === organ).forEach((marker) => {
      const pinGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: marker.condition === 'Critical Finding' ? 0xf43f5e : marker.condition === 'Observation' ? 0xf59e0b : 0x10b981,
      });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.set(...marker.position);
      group.add(pin);

      // Outer glowing ring
      const ringGeo = new THREE.RingGeometry(0.12, 0.18, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinMat.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(...marker.position);
      group.add(ring);
    });
  };

  const handleResetCamera = () => {
    if (cameraRef.current && meshGroupRef.current) {
      cameraRef.current.position.set(0, 0, 5.5);
      meshGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  const zoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(2.5, cameraRef.current.position.z - 0.6);
    }
  };

  const zoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(10, cameraRef.current.position.z + 0.6);
    }
  };

  return (
    <div className="relative rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl text-white">
      {/* 3D Canvas Viewport */}
      <div 
        ref={mountRef} 
        className="w-full h-[360px] sm:h-[440px] cursor-grab active:cursor-grabbing relative"
      />

      {/* Top Floating Organ Selector & Modality HUD */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Organ Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/60 pointer-events-auto shadow-lg">
          {(['Lungs', 'Brain', 'Heart', 'Spine'] as const).map((organ) => (
            <button
              key={organ}
              onClick={() => setActiveOrgan(organ)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeOrgan === organ
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {organ}
            </button>
          ))}
        </div>

        {/* Live Rendering Mode HUD */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700/60 pointer-events-auto">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 hidden sm:inline">
            Shader:
          </span>
          {(['blueprint', 'volumetric', 'thermal', 'xray'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setRenderMode(mode)}
              className={`px-2 py-1 text-[11px] font-medium rounded-lg capitalize transition-all cursor-pointer ${
                renderMode === mode
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 shadow-xl">
          {/* Slice Plane Navigator */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>CT Slice:</span>
            </span>

            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              {(['none', 'axial', 'sagittal', 'coronal'] as const).map((plane) => (
                <button
                  key={plane}
                  onClick={() => setSlicePlane(plane)}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded capitalize cursor-pointer transition-colors ${
                    slicePlane === plane
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {plane}
                </button>
              ))}
            </div>

            {slicePlane !== 'none' && (
              <input
                type="range"
                min="-1.5"
                max="1.5"
                step="0.05"
                value={slicePosition}
                onChange={(e) => setSlicePosition(parseFloat(e.target.value))}
                className="w-20 sm:w-28 accent-blue-500"
                title="Slice position"
              />
            )}
          </div>

          {/* Camera & Rotation Tools */}
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                autoRotate
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle Auto Rotation"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin-slow' : ''}`} />
            </button>

            <button
              onClick={zoomIn}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={zoomOut}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResetCamera}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold cursor-pointer"
            >
              Reset View
            </button>
          </div>
        </div>
      )}

      {/* Interactive Markers Legend */}
      <div className="absolute top-16 right-3 max-w-[210px] space-y-1.5 hidden md:block pointer-events-none">
        {SAMPLE_MARKERS.filter((m) => m.organ === activeOrgan).map((m) => (
          <div
            key={m.id}
            onClick={() => {
              setActiveMarker(m);
              onSelectMarker?.(m);
            }}
            className="p-2 rounded-lg bg-slate-800/90 backdrop-blur-md border border-slate-700 text-left pointer-events-auto cursor-pointer hover:border-blue-400 transition-all shadow-md"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  m.condition === 'Critical Finding'
                    ? 'bg-rose-500 animate-pulse'
                    : m.condition === 'Observation'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              />
              <span className="text-[11px] font-bold text-slate-200 truncate">{m.name}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{m.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
