import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

export const OceanMaterial = shaderMaterial(
	{
		time: 0,
		waveHeight: 0.3, // Height of the waves
		waveFrequency: 1.2, // Frequency of the waves
		lightPosition: new THREE.Vector3(5, 10, 10),
		cameraPosition: new THREE.Vector3(0, 5, 10),
		color1: new THREE.Color(0.3, 0.6, 1.0), // Brighter cartoon-like colors
		color2: new THREE.Color(0.1, 0.3, 0.8),
	},
	`
    uniform float time;
    uniform float waveHeight;
    uniform float waveFrequency;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normal;
      vPosition = position;

      vec3 pos = position;

      // Sharper and more exaggerated wave pattern
      float wave1 = sin(pos.x * waveFrequency + time) * waveHeight;
      float wave2 = sin(pos.y * waveFrequency * 0.7 + time * 0.5) * waveHeight * 0.5;
      float wave3 = sin((pos.x + pos.y) * waveFrequency * 0.5 + time * 1.5) * waveHeight * 0.3;
      
      // Adding sharper horizontal dynamic movement
      float horizontalWave = sin((pos.x + time * 0.8) * waveFrequency) * waveHeight * 0.6;
      horizontalWave += sin((pos.x - time * 0.6) * waveFrequency) * waveHeight * 0.6;

      pos.z += wave1 + wave2 + wave3 + horizontalWave;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
	`
    uniform float time;
    uniform vec3 lightPosition;
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 lightDir = normalize(lightPosition - vPosition);
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float lightIntensity = max(dot(vNormal, lightDir), 0.0);
      float toonStep = ceil(lightIntensity * 3.0) / 3.0; // More pronounced toon steps

      // Base cartoon-like water color
      vec3 baseColor = mix(color1, color2, vUv.y) * toonStep;

      // Simple reflection and refraction effect with more cartoonish tones
      float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
      vec3 reflectionColor = vec3(0.7, 0.8, 1.0); // Cartoonish sky reflection
      vec3 refractionColor = mix(baseColor, color1 * 0.4, 0.5); // Darken for refraction

      vec3 finalColor = mix(refractionColor, reflectionColor, fresnel);

      // Sharper ripple effect: using a step function for sharper edges
      float ripple = step(0.3, sin((vUv.x + vUv.y + time) * 15.0)) * 0.1;
      finalColor += ripple * vec3(0.3, 0.5, 0.7);

      // Enhancing edge detection for sharper cartoon-like outlines
      float edge = smoothstep(0.3, 0.6, abs(dFdx(vUv.x)) + abs(dFdy(vUv.y)));
      finalColor *= 1.0 - edge * 0.7;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
);
