import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WhatsAppQRCode = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [prefilled_message, setPreFilled_message] = useState('')

  // Function to generate a unique session ID that starts with "*/"
  const generateSessionId = () => {
    const uniqueId = `*/${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    return uniqueId;
  };

  // Use useEffect to generate and store the session ID in localStorage when the component mounts
  useEffect(() => {
    const existingSessionId = localStorage.getItem('sessionId');
    
    if (!existingSessionId) {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem('sessionId', newSessionId);
    } else {
      setSessionId(existingSessionId);  // If session already exists, use it
    }
  }, []);

  const storedSessionId = localStorage.getItem('sessionId');
  useEffect(() => {
    if (!sessionId) return; 
    let code;
    const generateQRCode = async () => {
      try {
        const response = await axios.post(
          'https://graph.facebook.com/v20.0/241683569037594/message_qrdls',
          {
            prefilled_message: `${storedSessionId} Hi! How can your chatbot automation help grow my business?`,
            generate_qr_image: "SVG"
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer EAAVZBobCt7AcBO8trGDsP8t4bTe2mRA7sNdZCQ346G9ZANwsi4CVdKM5MwYwaPlirOHAcpDQ63LoHxPfx81tN9h2SUIHc1LUeEByCzS8eQGH2J7wwe9tqAxZAdwr4SxkXGku2l7imqWY16qemnlOBrjYH3dMjN4gamsTikIROudOL3ScvBzwkuShhth0rR9P'
            }
          }
        );

      //  console.log("Response QR: ", response.data)

        if (response.data && response.data.qr_image_url) {
          setQrCodeUrl(response.data.qr_image_url);
          code = response.data.code
        } else {
          setError('Failed to generate QR code');
        }
      } catch (err) {
        setError('Error generating QR code');
      //  console.error('QR code generation error:', err);
      }
      finally {
        setTimeout(() => {
          axios.delete(`https://graph.facebook.com/v20.0/241683569037594/message_qrdls?code=${code}`, {
              headers: {
                  'Authorization': 'Bearer EAAVZBobCt7AcBO8trGDsP8t4bTe2mRA7sNdZCQ346G9ZANwsi4CVdKM5MwYwaPlirOHAcpDQ63LoHxPfx81tN9h2SUIHc1LUeEByCzS8eQGH2J7wwe9tqAxZAdwr4SxkXGku2l7imqWY16qemnlOBrjYH3dMjN4gamsTikIROudOL3ScvBzwkuShhth0rR9P'
              }
          })
      }, 30000); //30 seconds timer to delete QR automatically
      }
    };

    generateQRCode();
  }, [sessionId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center">
      {qrCodeUrl ? (
        <img src={qrCodeUrl} alt="WhatsApp QR Code" className="w-48 h-48" />
      ) : (
        <div className="text-gray-500">Loading QR Code...</div>
      )}
    </div>
  );
};

export default WhatsAppQRCode;