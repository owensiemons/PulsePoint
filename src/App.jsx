import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CelestialSphere from "./components/CelestialSphere";
import Pulsars from "./components/Pulsars";

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <CelestialSphere />
      <Pulsars />
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={85}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
      />
    </Canvas>
  );
}

export default App;
