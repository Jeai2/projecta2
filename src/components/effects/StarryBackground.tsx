// src/components/effects/StarryBackground.tsx (최종 수정본)

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { IOptions, RecursivePartial } from "@tsparticles/engine"; // ✅ 타입을 RecursivePartial로 감싸 안정성 확보
import { loadSlim } from "@tsparticles/slim";
import { useMediaQuery } from "@/hooks/use-media-query"; // ✅ 새로 만든 훅 import

export const StarryBackground = () => {
  const [init, setInit] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // ✅ 파티클 옵션 타입을 RecursivePartial<IOptions>로 수정하여 타입 에러 해결
  const options: RecursivePartial<IOptions> = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          repulse: {
            distance: 60,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          enable: false,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: true,
          speed: 0.1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 100,
        },
        opacity: {
          value: { min: 0.1, max: 0.5 },
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 2.5 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (init && isDesktop) {
    return (
      <Particles
        id="tsparticles"
        options={options}
        className="absolute inset-0 -z-10" // ✅ z-index를 음수로 설정하여 콘텐츠 뒤에 위치하도록 보장
      />
    );
  }

  return null;
};
