import { useState } from "react";
import { QrCode, Download, Copy, Link, MessageSquare, Wifi, Mail } from "lucide-react";

export const QRCodeGenerator = () => {
  const [text, setText] = useState('');
  const [qrType, setQrType] = useState<'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi'>('text');
  const [qrData, setQrData] = useState('');
  const [size, setSize] = useState(200);

  // QR Code generation using a simple text-to-data URL scheme
  const generateQRData = () => {
    let data = text;
    
    switch (qrType) {
      case 'url':
        data = text.startsWith('http') ? text : `https://${text}`;
        break;
      case 'email':
        data = `mailto:${text}`;
        break;
      case 'phone':
        data = `tel:${text}`;
        break;
      case 'sms':
        data = `sms:${text}`;
        break;
      case 'wifi':
        // WiFi format: WIFI:T:WPA;S:network;P:password;;
        const [network, password] = text.split(',');
        data = `WIFI:T:WPA;S:${network || ''};P:${password || ''};;`;
        break;
      default:
        data = text;
    }
    
    setQrData(data);
    return data;
  };

  const getQRCodeURL = (data: string) => {
    // Using QR Server API for QR code generation
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  };

  const downloadQRCode = () => {
    if (!qrData) return;
    
    const link = document.createElement('a');
    link.href = getQRCodeURL(qrData);
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(qrData);
  };

  const qrTypes = [
    { value: 'text', label: 'Plain Text', icon: MessageSquare, placeholder: 'Enter any text' },
    { value: 'url', label: 'Website URL', icon: Link, placeholder: 'Enter website URL' },
    { value: 'email', label: 'Email Address', icon: Mail, placeholder: 'Enter email address' },
    { value: 'Phone', label: 'Phone Number', icon: MessageSquare, placeholder: 'Enter phone number' },
    { value: 'sms', label: 'SMS Number', icon: MessageSquare, placeholder: 'Enter SMS number' },
    { value: 'wifi', label: 'WiFi Network', icon: Wifi, placeholder: 'Network Name, Password' },
  ];

  const currentType = qrTypes.find(type => type.value === qrType);

  return (
    <div className="space-y-6">
      {/* QR Type Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          QR Code Type
        </label>
        <select
          value={qrType}
          onChange={(e) => setQrType(e.target.value as any)}
          className="tool-input"
        >
          {qrTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Input Field */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {currentType?.label} Content
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={currentType?.placeholder}
          className="tool-input h-24"
        />
        {qrType === 'wifi' && (
          <p className="text-xs text-muted-foreground mt-1">
            Format: Network Name, Password (separated by comma)
          </p>
        )}
      </div>

      {/* Size Control */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          QR Code Size: {size}x{size}px
        </label>
        <input
          type="range"
          min="100"
          max="500"
          step="50"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateQRData}
        disabled={!text.trim()}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <QrCode className="w-4 h-4" />
        Generate QR Code
      </button>

      {/* Generated QR Code */}
      {qrData && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-medium text-foreground mb-4 text-center">Generated QR Code</h3>
            
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-lg border">
                <img
                  src={getQRCodeURL(qrData)}
                  alt="Generated QR Code"
                  className="block"
                  style={{ width: size, height: size }}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={downloadQRCode}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              
              <button
                onClick={copyQRData}
                className="btn-secondary flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Data
              </button>
            </div>
          </div>

          {/* QR Data Display */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">QR Code Data</h4>
            <div className="bg-background rounded p-3 border border-input-border font-mono text-sm break-all">
              {qrData}
            </div>
          </div>
        </div>
      )}

      {/* Usage Examples */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Usage Examples</h4>
        <div className="space-y-3 text-sm">
          <div>
            <strong className="text-foreground">Website URL:</strong>
            <span className="text-muted-foreground ml-2">https://example.com</span>
          </div>
          <div>
            <strong className="text-foreground">Email:</strong>
            <span className="text-muted-foreground ml-2">contact@example.com</span>
          </div>
          <div>
            <strong className="text-foreground">Phone:</strong>
            <span className="text-muted-foreground ml-2">+1234567890</span>
          </div>
          <div>
            <strong className="text-foreground">WiFi:</strong>
            <span className="text-muted-foreground ml-2">MyNetwork, MyPassword123</span>
          </div>
          <div>
            <strong className="text-foreground">Plain Text:</strong>
            <span className="text-muted-foreground ml-2">Any text you want to encode</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        QR codes are generated using a secure third-party service. No data is stored or logged.
      </div>
    </div>
  );
};