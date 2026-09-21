import React, { useState, useRef } from 'react';
import { ZoomIn } from 'lucide-react';
import styles from './ImageZoom.module.css';

export const ImageZoom = ({
  src,
  alt = '',
  className = '',
  zoomLevel = 2.5,
  lensSize = 130,
  onClick,
  showHint = true,
  objectFit = 'cover',
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });
  const containerRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Support mouse and touch pointer coordinates
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    if (clientX === undefined || clientY === undefined) return;

    let x = clientX - rect.left;
    let y = clientY - rect.top;

    // Constrain within bounds
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setLensPos({ x, y, percentX, percentY });
  };

  const handlePointerEnter = (e) => {
    setIsZoomed(true);
    handlePointerMove(e);
  };

  const handlePointerLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.zoomContainer} ${className}`}
      onMouseEnter={handlePointerEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      onTouchStart={handlePointerEnter}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerLeave}
      onClick={onClick}
    >
      {/* Base Product Image */}
      <img
        src={src}
        alt={alt}
        className={styles.baseImage}
        style={{ objectFit }}
        loading="lazy"
      />

      {/* Magnifying Glass Lens */}
      {isZoomed && (
        <div
          className={styles.magnifierLens}
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            left: `${lensPos.x}px`,
            top: `${lensPos.y}px`,
            backgroundImage: `url(${src})`,
            backgroundPosition: `${lensPos.percentX}% ${lensPos.percentY}%`,
            backgroundSize: `${zoomLevel * 100}%`,
          }}
        >
          <div className={styles.lensCrosshair} />
        </div>
      )}

      {/* Luxury Badge Hint */}
      {showHint && !isZoomed && (
        <div className={styles.zoomHintBadge}>
          <ZoomIn size={13} />
          <span>ذره‌بین جزئیات</span>
        </div>
      )}
    </div>
  );
};

export default ImageZoom;
