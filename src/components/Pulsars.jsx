import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { raDecToXYZ } from "../utils.js";
import pulsarData from "../cleaned_pulsar_data.json";

export default function Pulsars() {
  console.log("First pulsar:", pulsarData[0]);
  const pulsarTimers = useRef({}); //Tracks time elapsed per pulsar for ping timing
  const ringPool = useRef([]); //Reusable rish meshes - benefits performance
  const activeRings = useRef([]); //Currently active rings in scene
  const groupRef = useRef(); //Ref to the instancedMesh rendering pulsar spheres

  //Positions array of XYZ coords for all pulsars, memoized
  const positions = useMemo(() => {
    return pulsarData.map((p) => {
      if (!p.DIST) {
        return raDecToXYZ(p.RAJ, p.DECJ);
      } else {
        return raDecToXYZ(p.RAJ, p.DECJ);
      }
    });
  }, []);

  //temp object to prevent creatiung lots of temp objects every frame
  const dummy = useMemo(() => new THREE.Object3D(), []);

  //runs once, loops over all pulsars and sets them to their correct XYZ position
  useEffect(() => {
    const instancedMesh = groupRef.current;
    if (!instancedMesh) return;

    positions.forEach((pos, i) => {
      dummy.position.set(...pos);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    });

    instancedMesh.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  //Saved setup for the ring geometry and material properties
  const ringGeometry = useMemo(() => new THREE.RingGeometry(0.2, 0.22, 32), []);
  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
    []
  );

  //Every frame, tracks elapsed time for each pulsar and creates new ring at positon when timer exceeded

  useFrame((state, delta) => {
    const instancedMesh = groupRef.current;
    if (!instancedMesh) return;

    positions.forEach((pos, i) => {
      if (!pulsarData[i]?.P0) return;

      //Throttling! We're running on a website and don't have access to that much.
      if (i % 10 !== Math.floor(performance.now() / 100) % 10) return;

      if (!pulsarTimers.current[i]) pulsarTimers.current[i] = 0;
      pulsarTimers.current[i] += delta;

      //Adds new rings if timer is greater than each pulsars' period
      const period = Number(pulsarData[i].P0);
      if (pulsarTimers.current[i] >= period) {
        const ring = getRing();
        ring.position.set(...pos);
        ring.userData.age = 0;
        ring.scale.set(1, 1, 1);
        instancedMesh.parent.add(ring);
        activeRings.current.push(ring);
        pulsarTimers.current[i] = 0;
      }
    });

    //Updates active rings, facilitating expansion, fading, and billboarding
    const camera = state.camera;
    for (let i = activeRings.current.length - 1; i >= 0; i--) {
      const ring = activeRings.current[i];

      //billboarding
      ring.quaternion.copy(camera.quaternion);

      ring.userData.age += delta;
      //expansion
      const scale = 1 + ring.userData.age * 2.5;
      ring.scale.set(scale, scale, scale);
      //fading
      ring.material.opacity = 1 - ring.userData.age / 2;

      //remove really old rings for performance boost
      if (ring.userData.age > 2) {
        ring.parent.remove(ring);
        ringPool.current.push(ring);
        activeRings.current.splice(i, 1);
      }
    }
  });

  //Recycles mesh objects! Don't want ballooning memory allocations. If available, reuse.
  function getRing() {
    if (ringPool.current.length > 0) {
      return ringPool.current.pop();
    }
    return new THREE.Mesh(ringGeometry, ringMaterial.clone());
  }

  return (
    <instancedMesh
      ref={groupRef}
      args={[null, null, positions.length]}
      frustumCulled
    >
      <sphereGeometry args={[0.2, 6, 6]} />
      <meshBasicMaterial color="red" />
    </instancedMesh>
  );
}