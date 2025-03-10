import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Html } from "@react-three/drei";

const Label = ({ position, text, visible }) => (
  visible ? (
    <Html position={position} center>
      <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
        {text}
      </div>
    </Html>
  ) : null
);

const Beam = ({ position, rotation, size = [4, 0.2, 0.2], color = "gray", label, showLabels }) => (
  <group>
    <Box args={size} position={position} rotation={rotation}>
      <meshStandardMaterial attach="material" color={color} />
    </Box>
    <Label position={position} text={label} visible={showLabels} />
  </group>
);

const Column = ({ position, size = [0.2, 3, 0.2], color = "darkgray", label, showLabels }) => (
  <group>
    <Box args={size} position={position}>
      <meshStandardMaterial attach="material" color={color} />
    </Box>
    <Label position={position} text={label} visible={showLabels} />
  </group>
);

const FloorJoist = ({ position, size = [4, 0.1, 0.2], color = "saddlebrown", label, showLabels }) => (
  <group>
    <Box args={size} position={position}>
      <meshStandardMaterial attach="material" color={color} />
    </Box>
    <Label position={position} text={label} visible={showLabels} />
  </group>
);

const Staircase = ({ position }) => {
  const steps = [];
  for (let i = 0; i < 5; i++) {
    steps.push(
      <Box
        key={i}
        args={[1, 0.2, 1]}
        position={[position[0], position[1] + i * 0.2, position[2] - i * 0.8]}
      >
        <meshStandardMaterial attach="material" color="peru" />
      </Box>
    );
  }
  return <group>{steps}</group>;
};

const Building3D = () => {
  const [showColumns, setShowColumns] = useState(true);
  const [showBeams, setShowBeams] = useState(true);
  const [showFloorJoists, setShowFloorJoists] = useState(true);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Checkbox Controls */}
      <div className="bg-gray-900 text-white p-4 flex justify-center gap-6">
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="w-4 h-4" checked={showColumns} onChange={() => setShowColumns(!showColumns)} />
          <span>Column (C)</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="w-4 h-4" checked={showBeams} onChange={() => setShowBeams(!showBeams)} />
          <span>Beam (B)</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="w-4 h-4" checked={showFloorJoists} onChange={() => setShowFloorJoists(!showFloorJoists)} />
          <span>Floor Joist (FJ)</span>
        </label>
      </div>

      <div className="flex-1 h-full">
        <Canvas camera={{ position: [8, 8, 8], fov: 50 }} className="w-full h-full">
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} />

          {/* Ground Floor Frame */}
          <Column position={[-2, 1.5, -2]} label="C1" showLabels={showColumns} />
          <Column position={[2, 1.5, -2]} label="C2" showLabels={showColumns} />
          <Column position={[-2, 1.5, 2]} label="C3" showLabels={showColumns} />
          <Column position={[2, 1.5, 2]} label="C4" showLabels={showColumns} />

          <Beam position={[0, 3, -2]} label="B1" showLabels={showBeams} />
          <Beam position={[0, 3, 2]} label="B2" showLabels={showBeams} />
          <Beam position={[-2, 3, 0]} rotation={[0, Math.PI / 2, 0]} label="B3" showLabels={showBeams} />
          <Beam position={[2, 3, 0]} rotation={[0, Math.PI / 2, 0]} label="B4" showLabels={showBeams} />

          {/* Floor Joists (Ground Floor) */}
          <FloorJoist position={[0, 3, -1]} label="FJ1" showLabels={showFloorJoists} />
          <FloorJoist position={[0, 3, 1]} label="FJ2" showLabels={showFloorJoists} />

          {/* First Floor Frame */}
          <Column position={[-2, 4.5, -2]} label="C5" showLabels={showColumns} />
          <Column position={[2, 4.5, -2]} label="C6" showLabels={showColumns} />
          <Column position={[-2, 4.5, 2]} label="C7" showLabels={showColumns} />
          <Column position={[2, 4.5, 2]} label="C8" showLabels={showColumns} />

          <Beam position={[0, 6, -2]} label="B5" showLabels={showBeams} />
          <Beam position={[0, 6, 2]} label="B6" showLabels={showBeams} />
          <Beam position={[-2, 6, 0]} rotation={[0, Math.PI / 2, 0]} label="B7" showLabels={showBeams} />
          <Beam position={[2, 6, 0]} rotation={[0, Math.PI / 2, 0]} label="B8" showLabels={showBeams} />

          {/* Floor Joists (First Floor) */}
          <FloorJoist position={[0, 6, -1]} label="FJ3" showLabels={showFloorJoists} />
          <FloorJoist position={[0, 6, 1]} label="FJ4" showLabels={showFloorJoists} />

          {/* Staircase */}
          <Staircase position={[-1, 0, 1]} />

          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default Building3D;
