/**
 * CHRISTMAS FEUD (REACT) — THREE.JS REAL-TIME 3D STAGE COMPONENT
 * Wraps ChristmasStage3D with proper React StrictMode mount/unmount cleanup.
 */

import React, { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import { ChristmasStage3D } from '../services/stage3dEngine.js';

const Stage3D = forwardRef(function Stage3D({ mode, quality, onFallbackChange }, ref) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const engine = new ChristmasStage3D(canvas, { initialQuality: quality });
    engineRef.current = engine;
    engine.setMode(mode || 'home');
    onFallbackChange?.(engine.usingFallback);

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // Only instantiate once per canvas mount; quality & mode sync via effects below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.setMode(mode || 'home');
  }, [mode]);

  useEffect(() => {
    if (!engineRef.current || !quality) return;
    if (engineRef.current.quality !== quality) {
      engineRef.current.setQuality(quality);
      onFallbackChange?.(engineRef.current.usingFallback);
    }
  }, [quality, onFallbackChange]);

  useImperativeHandle(ref, () => ({
    triggerRevealBurst: () => engineRef.current?.triggerRevealBurst(),
    triggerStrikeFlash: (isMax) => engineRef.current?.triggerStrikeFlash(isMax),
    triggerCelebration: (secs) => engineRef.current?.triggerCelebration(secs),
    setQuality: (q) => {
      engineRef.current?.setQuality(q);
      onFallbackChange?.(Boolean(engineRef.current?.usingFallback));
    },
    getQuality: () => engineRef.current?.quality || 'ultra'
  }));

  return <canvas id="stage3d" ref={canvasRef} aria-hidden="true" />;
});

export default Stage3D;
