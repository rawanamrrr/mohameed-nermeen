"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RSVPSection() {
  const [rsvpAttending, setRsvpAttending] = useState('');
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPlusOne, setRsvpPlusOne] = useState('');
  const [rsvpGuestCount, setRsvpGuestCount] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const sendRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rsvpAttending) {
      setMessage({ text: 'Please select if you will attend', type: 'error' });
      return;
    }

    if (rsvpAttending === 'yes' && !rsvpName.trim()) {
      setMessage({ text: 'Please enter your name', type: 'error' });
      return;
    }

    setIsSending(true);
    setMessage({ text: 'Sending RSVP...', type: 'info' });

    try {
      const formData = new FormData();
      formData.append('name', rsvpName.trim());
      formData.append('to_email', 'nermenelkhamisy006@gmail.com');
      formData.append('message', 'RSVP Response');
      formData.append('message_type', 'rsvp');
      formData.append('rsvp_attending', rsvpAttending);
      formData.append('rsvp_name', rsvpName.trim());
      if (rsvpAttending === 'yes') {
        formData.append('rsvp_plus_one', rsvpPlusOne.trim());
        formData.append('rsvp_guest_count', rsvpGuestCount.toString());
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to send RSVP');
      }

      if (!responseData.success) {
        throw new Error(responseData.message || 'RSVP sending failed');
      }

      setMessage({ 
        text: 'RSVP sent successfully! Thank you!', 
        type: 'success' 
      });
      
      // Reset form
      setRsvpAttending('');
      setRsvpName('');
      setRsvpPlusOne('');
      setRsvpGuestCount(1);
      
    } catch (error) {
      console.error('Error sending RSVP:', error);
      setMessage({ 
        text: error instanceof Error ? error.message : 'Failed to send RSVP. Please try again later.', 
        type: 'error' 
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section 
      id="rsvp" 
      className="py-16 px-4 md:py-20"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-3xl p-8 md:p-12 shadow-2xl">
          <motion.div 
            className="text-center mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { 
                  duration: 0.8, 
                  ease: "easeOut"
                }
              }
            }}
          >
            <div className="w-16 h-px bg-accent/30 mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-800 leading-tight mb-4">RSVP</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">Let us know if you'll be joining us!</p>
          </motion.div>
          
          <div>
            <form onSubmit={sendRSVP} className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4 justify-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rsvp"
                      value="yes"
                      checked={rsvpAttending === 'yes'}
                      onChange={(e) => setRsvpAttending(e.target.value)}
                      className="text-pink-500"
                    />
                    <span className="text-gray-700 font-medium">Yes, I'll be there!</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rsvp"
                      value="no"
                      checked={rsvpAttending === 'no'}
                      onChange={(e) => setRsvpAttending(e.target.value)}
                      className="text-pink-500"
                    />
                    <span className="text-gray-700 font-medium">Sorry, can't make it</span>
                  </label>
                </div>

                {rsvpAttending === 'yes' && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <input
                      type="text"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-transparent"
                      required
                    />
                    <input
                      type="text"
                      value={rsvpPlusOne}
                      onChange={(e) => setRsvpPlusOne(e.target.value)}
                      placeholder="Plus one name (if bringing someone)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-transparent"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-gray-700 font-medium">Total guests:</label>
                      <select
                        value={rsvpGuestCount}
                        onChange={(e) => setRsvpGuestCount(parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300/50"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full px-8 py-3 text-white bg-gradient-to-r from-pink-400 to-orange-400 rounded-md hover:from-pink-500 hover:to-orange-500 disabled:opacity-50 transition-all font-medium shadow-lg"
                disabled={isSending}
              >
                {isSending ? 'Sending RSVP...' : 'Send RSVP'}
              </button>
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
      </div>
    </section>
  );
}
