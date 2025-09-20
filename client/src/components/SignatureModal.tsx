import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, RotateCcw, Download, Upload, Image } from "lucide-react";
import { trackSignatureCreated } from "@/lib/analytics";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: { name: string; image: string }) => void;
  currentSignature?: { name: string; image: string };
}

export function SignatureModal({ isOpen, onClose, onSave, currentSignature }: SignatureModalProps) {
  const [name, setName] = useState(currentSignature?.name || "");
  const [signature, setSignature] = useState<string>(currentSignature?.image || "");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (currentSignature) {
      setName(currentSignature.name);
      setSignature(currentSignature.image);
      setHasSignature(!!currentSignature.image);
    }
  }, [currentSignature]);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventPos(e);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ปรับ settings สำหรับความแม่นยำ
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';

    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // วาดจุดเริ่มต้น
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.fill();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getEventPos(e);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL("image/png");
    setSignature(signatureData);
    setHasSignature(true);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature("");
    setHasSignature(false);
  };

  // ตั้งค่า canvas เมื่อเปิด modal
  useEffect(() => {
    if (isOpen) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // ตั้งค่า canvas สำหรับความแม่นยำ
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // ตั้งค่า canvas ให้รองรับ high DPI
      const devicePixelRatio = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      
      canvas.width = displayWidth * devicePixelRatio;
      canvas.height = displayHeight * devicePixelRatio;
      canvas.style.width = displayWidth + 'px';
      canvas.style.height = displayHeight + 'px';
      
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.lineWidth = 2;
    }
  }, [isOpen]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพ');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSignature(result);
        setHasSignature(true);
        
        // แสดงรูปภาพบน canvas
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = document.createElement('img');
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // คำนวณขนาดให้พอดีกับ canvas
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const loadSignature = () => {
    if (signature) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = document.createElement('img');
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = signature;
    }
  };

  useEffect(() => {
    if (isOpen && signature) {
      loadSignature();
    }
  }, [isOpen, signature]);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!hasSignature) {
      alert("Please draw your signature");
      return;
    }

    // Track signature creation
    trackSignatureCreated();

    onSave({ name: name.trim(), image: signature });
    onClose();
  };

  const handleClose = () => {
    setName(currentSignature?.name || "");
    setSignature(currentSignature?.image || "");
    setHasSignature(!!currentSignature?.image);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Digital Signature</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <Label htmlFor="signature-name">Full Name</Label>
            <Input
              id="signature-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* Upload Signature Image */}
          <div>
            <Label>Upload Signature Image</Label>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="signature-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('signature-upload')?.click()}
                className="flex-1 w-full sm:w-auto"
              >
                <Upload className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Choose Image File</span>
                <span className="sm:hidden">Choose File</span>
              </Button>
            </div>
          </div>

          {/* Signature Canvas */}
          <div>
            <Label>Or Draw Signature</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-4">
              <div className="overflow-x-auto">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="border border-gray-200 rounded cursor-crosshair w-full max-w-full touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    startDrawing(e);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    draw(e);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    stopDrawing();
                  }}
                  style={{ 
                    touchAction: "none",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    WebkitTouchCallout: "none",
                    WebkitTapHighlightColor: "transparent"
                  }}
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-2">
                <p className="text-sm text-gray-500">
                  Draw your signature above or upload an image
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    disabled={!hasSignature}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {hasSignature && (
            <div>
              <Label>Preview</Label>
              <div className="border border-gray-200 rounded p-2 sm:p-4 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Signature:</p>
                    <img
                      src={signature}
                      alt="Signature preview"
                      className="max-h-20 object-contain w-full"
                    />
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-medium">{name}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || !hasSignature} className="w-full sm:w-auto">
            Save Signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
