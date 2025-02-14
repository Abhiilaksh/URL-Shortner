import React, { useState } from 'react';
import { ClipboardCopy, Download } from 'lucide-react';

const URLShortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setQrCode('');
    setCopySuccess(false);

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    try {
      // First, get the shortened URL
      const shortenResponse = await fetch('https://babyurl.xyz/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!shortenResponse.ok) {
        throw new Error('Failed to shorten URL');
      }

      const shortenData = await shortenResponse.json();
      setShortUrl(shortenData.shortUrl);

      
      const qrResponse = await fetch('https://babyurl.xyz/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortUrl: shortenData.shortUrl })
      });

      if (!qrResponse.ok) {
        throw new Error('Failed to generate QR code');
      }

      const qrData = await qrResponse.json();
      setQrCode(qrData.qrCode);
    } catch (err) {
      setError('Failed to process URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-300 p-6">
      <div className="text-center pb-24">
        <h1 className="text-5xl font-extrabold text-white tracking-wide">
          URL Shortener
        </h1>
      </div>
  
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-5 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-500 transition ease-in-out duration-300"
            />
          </div>
  
          <button
            type="submit"
            className={`w-full py-3 text-xl rounded-lg font-semibold text-white transition-colors ease-in-out duration-300
              ${isLoading 
                ? 'bg-pink-300 cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Shorten URL'}
          </button>
        </form>
  
        {error && (
          <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg text-lg">
            {error}
          </div>
        )}
  
        {shortUrl && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg text-lg break-all">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-3 py-3 px-5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-200 transition-colors ease-in-out duration-300"
            >
              <ClipboardCopy className="w-5 h-5 text-gray-600" />
              {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
            </button>

            {qrCode && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
                <button
                  onClick={downloadQRCode}
                  className="w-full flex items-center justify-center gap-3 py-3 px-5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-200 transition-colors ease-in-out duration-300"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                  Download QR Code
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="pt-32">Made with Love Abhilaksh</div>
    </div>
  );
};

export default URLShortener;