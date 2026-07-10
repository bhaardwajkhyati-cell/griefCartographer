'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const colors = [
  '#FFFFFF',
  '#CFCFCF',
  '#8B8B8B',
  '#6C8EBF',
  '#5C8D6D',
  '#A67C52',
  '#7B5FA1',
  '#8C3A3A',
];

export default function DrawingCanvas({ canvasRef: externalCanvasRef }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const ctxRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#FFFFFF');
  const [tool, setTool] = useState('pencil');

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 800, damping: 40, mass: 0.3 });
  const springY = useSpring(rawY, { stiffness: 800, damping: 40, mass: 0.3 });

  const [isHoveringCanvas, setIsHoveringCanvas] = useState(false);
  const [activePointerType, setActivePointerType] = useState('mouse');

  useEffect(() => {
    const canvas = canvasRef.current;

    if (externalCanvasRef) externalCanvasRef.current = canvas;

    canvas.width = 1000;
    canvas.height = 600;

    const ctx = canvas.getContext('2d');

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;

    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (!ctxRef.current) return;

    if (tool === 'pencil') {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = 3;
    } else {
      ctxRef.current.strokeStyle = '#111111';
      ctxRef.current.lineWidth = 18;
    }
  }, [tool, color]);

  const getPointerPosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const getCursorPosition = (e) => {
    const wrapper = wrapperRef.current;
    const rect = wrapper.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();

    canvasRef.current.setPointerCapture(e.pointerId);

    const { x, y } = getPointerPosition(e);
    const cursor = getCursorPosition(e);
    rawX.set(cursor.x);
    rawY.set(cursor.y);
    setActivePointerType(e.pointerType);

    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);

    if (tool === 'eraser') {
      ctxRef.current.strokeStyle = '#111111';
      ctxRef.current.lineWidth = 18;
    } else {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = 3;
    }

    setDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();

    const cursor = getCursorPosition(e);
    rawX.set(cursor.x);
    rawY.set(cursor.y);

    if (!drawing) return;

    const { x, y } = getPointerPosition(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDrawing = (e) => {
    if (!drawing) return;

    canvasRef.current.releasePointerCapture(e.pointerId);
    ctxRef.current.closePath();
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.fillStyle = '#111111';
    ctxRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handlePointerEnter = (e) => {
    if (e.pointerType === 'mouse') {
      const cursor = getCursorPosition(e);
      rawX.jump(cursor.x);
      rawY.jump(cursor.y);
      setIsHoveringCanvas(true);
    }
  };

  const handlePointerLeave = () => {
    setIsHoveringCanvas(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">

      <div ref={wrapperRef} className="relative w-full max-w-5xl">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className={`border border-gray-700 rounded-xl w-full bg-[#111111] block ${
            isHoveringCanvas ? 'cursor-none' : 'cursor-default'
          }`}
          style={{ touchAction: 'none' }}
        />

        {isHoveringCanvas && (
          <motion.div
            style={{ x: springX, y: springY }}
            className="absolute top-0 left-0 pointer-events-none w-3 h-3 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 z-[999] shadow-[0_0_10px_rgba(255,255,255,0.9),0_0_20px_rgba(255,255,255,0.45)]"
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={clearCanvas}
          className="px-4 py-2 border border-gray-600 rounded-full text-white hover:bg-white hover:text-black transition"
        >
          Clear
        </button>

        <button
          onClick={() => setTool('pencil')}
          className={`px-4 py-2 border rounded-full transition ${
            tool === 'pencil'
              ? 'bg-white text-black border-white'
              : 'border-gray-600 text-white hover:bg-white hover:text-black'
          }`}
        >
          Pencil
        </button>

        <button
          onClick={() => setTool('eraser')}
          className={`px-4 py-2 border rounded-full transition ${
            tool === 'eraser'
              ? 'bg-white text-black border-white'
              : 'border-gray-600 text-white hover:bg-white hover:text-black'
          }`}
        >
          Eraser
        </button>
      </div>

      <div className="flex gap-3">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => {
              setColor(c);
              setTool('pencil');
            }}
            className={`w-8 h-8 rounded-full border-2 transition ${
              color === c && tool === 'pencil'
                ? 'border-white scale-110'
                : 'border-gray-600'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

    </div>
  );
}