"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Team } from './data';

const NeonShape = ({ type, color }: { type: 'icosahedron' | 'dodecahedron' | 'torus', color: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.7;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef}>
                {type === 'icosahedron' && <icosahedronGeometry args={[1.2, 0]} />}
                {type === 'dodecahedron' && <dodecahedronGeometry args={[1.2, 0]} />}
                {type === 'torus' && <torusGeometry args={[0.9, 0.3, 16, 30]} />}

                {/* Wireframe material for the glowing effect */}
                <meshBasicMaterial color={color} wireframe />
            </mesh>
            {/* Inner mesh for a bit of solidity/glow core */}
            <mesh ref={meshRef} scale={[0.95, 0.95, 0.95]}>
                {type === 'icosahedron' && <icosahedronGeometry args={[1.2, 0]} />}
                {type === 'dodecahedron' && <dodecahedronGeometry args={[1.2, 0]} />}
                {type === 'torus' && <torusGeometry args={[0.9, 0.3, 16, 30]} />}
                <meshBasicMaterial color={color} transparent opacity={0.1} />
            </mesh>
        </Float>
    );
};

const Card = ({ team, shapeType, color, rankLabel }: { team: Team, shapeType: 'icosahedron' | 'dodecahedron' | 'torus', color: string, rankLabel: string }) => {
    return (
        <div className={`relative flex flex-col items-center p-4 border rounded-xl bg-black/40 backdrop-blur-sm 
                        ${color === '#a855f7' ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : ''}
                        ${color === '#ef4444' ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : ''} 
                        ${color === '#eab308' ? 'border-yellow-400/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : ''}
                        w-64 h-80 transition-transform hover:scale-105 duration-300`}>
            {/* Vertical Lines Decoration */}
            <div className="absolute top-4 left-2 w-0.5 h-12 bg-white/20"></div>
            <div className="absolute top-4 right-2 w-0.5 h-12 bg-white/20"></div>

            {/* Rank Label at Bottom */}
            <div className="absolute bottom-2 font-mono text-sm text-gray-400">{rankLabel}</div>

            <div className="w-full h-32 mb-4 relative z-10">
                <Canvas camera={{ position: [0, 0, 4] }}>
                    <ambientLight intensity={0.5} />
                    <NeonShape type={shapeType} color={color} />
                </Canvas>
            </div>

            <div className="w-full space-y-2 z-20">
                <div className="w-full border border-gray-600 bg-gray-900/50 px-2 py-1 text-center">
                    <span className="font-mono text-xs text-gray-400 block mb-0.5 uppercase tracking-widest"> &gt; Team_name</span>
                    <div className="font-bold text-white tracking-wide truncate text-sm">{team.teamName}</div>
                </div>

                <div className={`flex justify-between items-center text-xs font-mono border px-2 py-1
                                ${color === '#a855f7' || color === '#ef4444' ? 'border-purple-500/30 text-purple-300' : 'border-yellow-400/30 text-yellow-300'}`}>
                    <span>SCORE:</span>
                    <span>{team.score ? team.score.toFixed(4) : '0.000'}</span>
                </div>
            </div>

        </div>
    )
}

export default function TopThree({ teams }: { teams: Team[] }) {
    if (teams.length < 3) return null;

    const [first, second, third] = teams;

    return (
        <div className="flex flex-col md:flex-row justify-center items-end gap-8 my-10 px-4">
            {/* 2nd Place */}
            <div className="order-2 md:order-1 mb-0 md:mb-4">
                <Card team={second} shapeType="icosahedron" color="#a855f7" rankLabel="#002" />
            </div>

            {/* 1st Place - Slightly lifted or larger? */}
            <div className="order-1 md:order-2 mb-8 md:mb-12 scale-110 z-10">
                <Card team={first} shapeType="dodecahedron" color="#a855f7" rankLabel="#001" />
            </div>

            {/* 3rd Place */}
            <div className="order-3 md:order-3 mb-0 md:mb-4">
                <Card team={third} shapeType="torus" color="#eab308" rankLabel="#003" />
            </div>
        </div>
    );
}
