"use client"

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function HandwrittenMessage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(3);
  const [messageType, setMessageType] = useState('handwritten'); // 'handwritten' or 'normal'
  const [normalMessage, setNormalMessage] = useState('');
  const toEmail = 'nermenelkhamisy006@gmail.com';

  // Pen color options
  const penColors = [
    { color: '#000000', name: 'Black' },
    { color: '#EF4444', name: 'Red' },
    { color: '#3B82F6', name: 'Blue' },
    { color: '#10B981', name: 'Green' },
    { color: '#8B5CF6', name: 'Purple' },
    { color: '#F59E0B', name: 'Orange' },
  ];

  // Pen width options
  const penWidths = [
    { width: 2, name: 'Thin' },
    { width: 3, name: 'Medium' },
    { width: 5, name: 'Thick' },
    { width: 8, name: 'Bold' },
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const setCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const width = Math.min(1000, rect.width * 0.95); // Increased max width
        canvas.width = width;
        canvas.height = 600; // Increased height for larger writing area
        canvas.style.border = '2px solid #e5e7eb';
        canvas.style.borderRadius = '0.5rem';
        canvas.style.backgroundColor = 'white';
      }
    };

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set initial drawing styles
    context.lineWidth = currentWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = currentColor;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    setCtx(context);
    setCanvasSize();

    const handleResize = () => setCanvasSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update drawing context when color or width changes
  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentWidth;
    }
  }, [currentColor, currentWidth, ctx]);

  // Refs for drawing state
  const points = useRef<Array<{x: number, y: number, pressure: number}>>([]);
  const rafId = useRef<number | null>(null);
  const lastWidth = useRef(currentWidth);

  const getPressure = (e: Touch | MouseEvent | React.Touch | React.MouseEvent): number => {
    // Check if the device supports pressure (like iPad with Apple Pencil)
    const event = e as any; // Type assertion to access force property
    if ('force' in event && event.force) {
      return Math.min(Math.max(event.force, 0.1), 1);
    }
    return 0.5; // Default pressure
  };

  const drawSmoothLine = () => {
    if (!canvasRef.current || points.current.length < 2) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const pointsToDraw = [...points.current];
    
    ctx.beginPath();
    ctx.moveTo(pointsToDraw[0].x, pointsToDraw[0].y);
    
    // Draw a smooth curve through the points
    for (let i = 1; i < pointsToDraw.length - 2; i++) {
      const xc = (pointsToDraw[i].x + pointsToDraw[i + 1].x) / 2;
      const yc = (pointsToDraw[i].y + pointsToDraw[i + 1].y) / 2;
      ctx.quadraticCurveTo(pointsToDraw[i].x, pointsToDraw[i].y, xc, yc);
    }
    
    // Connect the last two points
    if (pointsToDraw.length > 1) {
      const i = pointsToDraw.length - 2;
      ctx.quadraticCurveTo(
        pointsToDraw[i].x, 
        pointsToDraw[i].y, 
        pointsToDraw[i + 1].x, 
        pointsToDraw[i + 1].y
      );
    }
    
    // Use the average pressure of the points for the line width
    const avgPressure = pointsToDraw.reduce((sum, p) => sum + p.pressure, 0) / pointsToDraw.length;
    const targetWidth = currentWidth * (0.5 + avgPressure * 0.5);
    
    // Smooth width transition
    const width = lastWidth.current + (targetWidth - lastWidth.current) * 0.3;
    lastWidth.current = width;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const getCanvasCoordinates = (
    e: MouseEvent | React.MouseEvent<HTMLCanvasElement> | 
       Touch | React.TouchEvent<HTMLCanvasElement> | 
       { clientX: number; clientY: number }
  ) => {
  if (!canvasRef.current) return null;
  
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  let clientX: number;
  let clientY: number;

  // Handle different event types
  if ('touches' in e && e.touches) {
    // It's a TouchEvent with touches array
    const touch = e.touches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else if ('clientX' in e) {
    // It's a MouseEvent, Touch object, or similar
    clientX = e.clientX;
    clientY = e.clientY;
  } else if ('nativeEvent' in e) {
    // Handle React synthetic events
    const nativeEvent = e.nativeEvent as MouseEvent | TouchEvent;
    if ('touches' in nativeEvent && nativeEvent.touches.length > 0) {
      clientX = nativeEvent.touches[0].clientX;
      clientY = nativeEvent.touches[0].clientY;
    } else if ('clientX' in nativeEvent) {
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
    } else {
      return null;
    }
  } else {
    return null;
  }
  
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  
  return { x, y };
};

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    const coords = getCanvasCoordinates('touches' in e ? e.touches[0] : e.nativeEvent);
    if (!coords) return;
    
    const pressure = getPressure('touches' in e ? e.touches[0] : e.nativeEvent);
    points.current = [{ x: coords.x, y: coords.y, pressure }];
    setIsDrawing(true);
    
    // Start the drawing loop
    const drawLoop = () => {
      if (points.current.length > 1) {
        drawSmoothLine();
        // Keep only the last few points to maintain performance
        if (points.current.length > 10) {
          points.current = points.current.slice(-10);
        }
      }
      rafId.current = requestAnimationFrame(drawLoop);
    };
    
    rafId.current = requestAnimationFrame(drawLoop);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;
    
    const coords = getCanvasCoordinates('touches' in e ? e.touches[0] : e.nativeEvent);
    if (!coords) return;
    
    const pressure = getPressure('touches' in e ? e.touches[0] : e.nativeEvent);
    
    // Add the new point with scaled coordinates
    points.current.push({ x: coords.x, y: coords.y, pressure });
  };

  const stopDrawing = () => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    points.current = [];
    setIsDrawing(false);
  };

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setMessage({ text: 'Please enter your name', type: 'error' });
      return;
    }

    if (messageType === 'handwritten' && !canvasRef.current) {
      setMessage({ text: 'Canvas not available', type: 'error' });
      return;
    }

    if (messageType === 'normal' && !normalMessage.trim()) {
      setMessage({ text: 'Please enter your message', type: 'error' });
      return;
    }

    setIsSending(true);
    setMessage({ text: 'Sending your message...', type: 'info' });

    try {
      // Create form data
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('to_email', toEmail);
      
      if (messageType === 'handwritten') {
        // Convert canvas to blob for handwritten messages
        const blob = await new Promise<Blob | null>((resolve) => {
          canvasRef.current?.toBlob((blob) => {
            resolve(blob);
          }, 'image/png');
        });

        if (!blob) {
          throw new Error('Failed to create image from drawing');
        }

        formData.append('message', 'A handwritten message from the engagement website');
        formData.append('image', blob, 'drawing.png');
        formData.append('message_type', 'handwritten');
      } else {
        // Normal text message
        formData.append('message', normalMessage.trim());
        formData.append('message_type', 'normal');
      }


      // Send data to API route
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formData,
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        throw new Error('The server returned an invalid response');
      }

      if (!response.ok) {
        console.error('Server error:', responseData);
        throw new Error(responseData.error || responseData.message || 'Failed to send message');
      }

      if (!responseData.success) {
        console.error('API error:', responseData);
        throw new Error(responseData.message || 'Message sending failed');
      }

      setMessage({ 
        text: responseData.message || 'Message sent successfully! Thank you!', 
        type: 'success' 
      });
      
      // Reset form if successful
      if (messageType === 'handwritten') {
        clearCanvas();
      } else {
        setNormalMessage('');
      }
      setName('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'Failed to send message. Please try again later.', 
        type: 'error' 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="select-none">
      {/* Message Type Selection */}
      <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
              <button
                type="button"
                onClick={() => setMessageType('handwritten')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  messageType === 'handwritten'
                    ? 'bg-gradient-to-r from-pink-300 to-orange-300 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                Handwritten Message
              </button>
              <button
                type="button"
                onClick={() => setMessageType('normal')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  messageType === 'normal'
                    ? 'bg-gradient-to-r from-pink-300 to-orange-300 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                Normal Message
              </button>
            </div>

            {/* Handwritten Message Section */}
            {messageType === 'handwritten' && (
              <div>
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6 text-center">
                  Write your message below with your personal touch...
                </p>
                
                {/* Pen Options */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-4 justify-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Color:</span>
                      <div className="flex gap-1">
                        {penColors.map((pen) => (
                          <button
                            key={pen.color}
                            type="button"
                            onClick={() => setCurrentColor(pen.color)}
                            className={`w-8 h-8 rounded-full border-2 ${
                              currentColor === pen.color ? 'border-gray-800' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: pen.color }}
                            title={pen.name}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Width:</span>
                      <div className="flex gap-1">
                        {penWidths.map((pen) => (
                          <button
                            key={pen.width}
                            type="button"
                            onClick={() => setCurrentWidth(pen.width)}
                            className={`px-2 py-1 text-xs rounded-md transition-colors ${
                              currentWidth === pen.width
                                ? 'bg-gradient-to-r from-pink-300 to-orange-300 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {pen.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="relative border-2 border-gray-200 rounded-lg overflow-hidden mb-6"
                  style={{
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)'
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                    className="w-full h-[400px] bg-white touch-none cursor-crosshair"
                    style={{
                      touchAction: 'none',
                      WebkitUserSelect: 'none',
                      userSelect: 'none',
                      WebkitTapHighlightColor: 'rgba(0,0,0,0)'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Normal Message Section */}
            {messageType === 'normal' && (
              <div>
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6 text-center">
                  Type your message below...
                </p>
                <textarea
                  value={normalMessage}
                  onChange={(e) => setNormalMessage(e.target.value)}
                  placeholder="Share your thoughts, memories, or well wishes..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-transparent resize-none"
                  required={messageType === 'normal'}
                />
              </div>
            )}

            {/* Name Input */}
            <div className="mb-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-transparent"
                required
              />
            </div>

            <form onSubmit={sendEmail} className="space-y-4">
              <div className="flex justify-between items-center pt-2">
                {messageType === 'handwritten' && (
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors font-medium"
                    disabled={isSending}
                  >
                    Clear Canvas
                  </button>
                )}
                <button
                  type="submit"
                  className="px-8 py-3 text-white bg-gradient-to-r from-pink-400 to-orange-400 rounded-md hover:from-pink-500 hover:to-orange-500 disabled:opacity-50 transition-all font-medium shadow-lg"
                  disabled={isSending}
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>

            {message.text && (
              <div className={`mt-6 p-4 rounded-md text-center ${
                message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 
                message.type === 'info' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {message.text}
              </div>
            )}
      </div>
    </div>
  );
}