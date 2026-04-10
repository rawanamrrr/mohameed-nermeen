"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PhotoSharingSection() {
  return (
    <section 
      id="photos" 
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
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-800 leading-tight mb-4">Share Your Photos</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">Upload your party photos to our shared album!</p>
          </motion.div>
          
          <div>
            <div className="text-center">
              <a
                href="https://drive.google.com/drive/folders/1kZtNu9zuTAPpdIHPNe7bVfxpU8DcpA5p?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg text-lg font-medium"
              >
                Open Photo Album
              </a>
              <div className="mt-6">
                <div className="inline-block p-6 bg-white/80 rounded-lg shadow-md">
                  <div className="w-32 h-32 relative rounded-lg overflow-hidden mb-3 mx-auto">
                    <Image
                      src="/qr-code.png"
                      alt="QR Code for Photo Album"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Scan QR Code</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mt-4 max-w-md mx-auto">
                Click the button above or scan the QR code to access our shared Google Drive folder where you can upload all your photos from the celebration!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
