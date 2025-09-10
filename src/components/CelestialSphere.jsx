import * as THREE from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import sphereTextureUrl from "../assets/SphereTexture.png";
export default function CelestialSphere() {
  const texture = useLoader(THREE.TextureLoader, sphereTextureUrl);
  return (
    //TODO: Find a more permanent rotation solution than this.
    <mesh rotation={[Math.PI / 3, Math.PI / 1.2, -Math.PI / 2]}>
      <sphereGeometry args={[100, 64, 64]} />
      <meshBasicMaterial
        side={THREE.BackSide}
        map={texture}
        color={"#555555"}
      />
    </mesh>
  );
}