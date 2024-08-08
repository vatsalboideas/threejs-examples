import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

interface CustomCursorProps {
  text: string;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ text }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="custom-cursor"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {text}
    </div>
  );
};

export default CustomCursor;
