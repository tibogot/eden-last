"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import * as THREE from "three";
import { gsap, ScrollTrigger, SplitText } from "@/app/lib/gsapConfig";
import Image from "next/image";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uSpread;
  varying vec2 vUv;

  float Hash(vec2 p) {
    vec3 p2 = vec3(p.xy, 1.0);
    return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0 - 2.0 * f);
    return mix(
      mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
      mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += noise(p * 1.0) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);
    
    float dissolveEdge = uv.y - uProgress * 1.2;
    float noiseValue = fbm(centeredUv * 15.0);
    float d = dissolveEdge + noiseValue * uSpread;
    
    float pixelSize = 1.0 / uResolution.y;
    float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);
    
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface MorphogenesisScrollProps {
  imageSrc: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  aboutText?: string;
  color?: string;
  spread?: number;
  speed?: number;
}

export default function MorphogenesisScroll({
  imageSrc,
  imageAlt = "",
  title = "Morphogenesis",
  subtitle = "Solid form gives way to liquid movement.",
  content = "An underlying field of motion pushes and pulls the image across its surface, redistributing pixels in a way that feels organic and constantly in flux.",
  aboutText = "This animation is driven by a real-time WebGL displacement process where interaction introduces force into the surface, causing form to bend, stretch, and reorganize dynamically. Rather than relying on fixed keyframes, the visual state evolves continuously, allowing motion to feel organic, responsive, and materially present as the page progresses.",
  color = "#ebf5df",
  spread = 0.5,
  speed = 2,
}: MorphogenesisScrollProps) {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!heroRef.current || !canvasRef.current || !lenis) return;

    const CONFIG = { color, spread, speed };
    const hero = heroRef.current;
    const canvas = canvasRef.current;

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });

    function hexToRgb(hex: string) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
          }
        : { r: 0.89, g: 0.89, b: 0.89 };
    }

    function resize() {
      const width = hero.offsetWidth;
      const height = hero.offsetHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    resize();
    window.addEventListener("resize", resize);

    const rgb = hexToRgb(CONFIG.color);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight),
        },
        uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
        uSpread: { value: CONFIG.spread },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let scrollProgress = 0;

    function animate() {
      material.uniforms.uProgress.value = scrollProgress;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // Scroll handler
    const handleScroll = ({ scroll }: { scroll: number }) => {
      const heroHeight = hero.offsetHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = heroHeight - windowHeight;
      scrollProgress = Math.min((scroll / maxScroll) * CONFIG.speed, 1.1);
    };

    lenis.on("scroll", handleScroll);

    // Text reveal animation
    const heroH2 = hero.querySelector(".hero-content h2");
    if (heroH2) {
      const split = new SplitText(heroH2, { type: "words" });
      const words = split.words as HTMLElement[];

      gsap.set(words, { opacity: 0 });

      ScrollTrigger.create({
        trigger: ".hero-content",
        start: "top 25%",
        end: "bottom 100%",
        onUpdate: (self) => {
          const progress = self.progress;
          const totalWords = words.length;

          words.forEach((word, index) => {
            const wordProgress = index / totalWords;
            const nextWordProgress = (index + 1) / totalWords;

            let opacity = 0;

            if (progress >= nextWordProgress) {
              opacity = 1;
            } else if (progress >= wordProgress) {
              const fadeProgress =
                (progress - wordProgress) / (nextWordProgress - wordProgress);
              opacity = fadeProgress;
            }

            gsap.to(word, {
              opacity: opacity,
              duration: 0.1,
              overwrite: true,
            });
          });
        },
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      lenis.off("scroll", handleScroll);
      renderer.dispose();
      material.dispose();
      geometry.dispose();
    };
  }, [lenis, color, spread, speed]);

  return (
    <>
      <section ref={heroRef} className="relative w-full h-[175svh] text-[#fec81d] overflow-hidden">
        {/* Background Image */}
        <div className="absolute w-full h-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Header */}
        <div className="absolute w-full h-svh flex flex-col justify-center items-center gap-2 text-center">
          <h1 className="text-[clamp(4rem,7.5vw,10rem)] uppercase font-ivy-headline leading-[0.9] font-medium">
            {title}
          </h1>
          <p className="w-3/4 font-neue-haas text-lg font-normal">
            {subtitle}
          </p>
        </div>

        {/* WebGL Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute bottom-0 w-full h-full pointer-events-none"
        />

        {/* Content */}
        <div className="absolute bottom-0 w-full h-[125svh] flex justify-center items-center text-center">
          <h2 className="w-3/4 text-[clamp(2.5rem,4.5vw,5rem)] uppercase font-ivy-headline leading-[0.9] font-medium text-[#0f0f0f] hero-content">
            {content}
          </h2>
        </div>
      </section>

      {/* About Section */}
      {aboutText && (
        <section className="relative w-full h-svh flex justify-center items-center bg-[#0f0f0f] text-[#ebf5df]">
          <p className="w-[40%] text-center font-neue-haas text-lg font-normal max-md:w-[calc(100%-4rem)]">
            {aboutText}
          </p>
        </section>
      )}
    </>
  );
}
