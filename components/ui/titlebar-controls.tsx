"use client"

import React from 'react';
import { invoke } from '@tauri-apps/api/core';
import { X, Minus, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TitlebarControls: React.FC = () => {
  const handleMinimize = async () => {
    try {
      await invoke('minimize_window');
    } catch (error) {
    }
  };

  const handleMaximize = async () => {
    try {
      await invoke('maximize_window');
    } catch (error) {
    }
  };

  const handleClose = async () => {
    try {
      await invoke('close_window');
    } catch (error) {
    }
  };

  return (
    <header className="flex items-center justify-between px-2 py-1 bg-sidebar border-b-[3px] h-12 select-none" style={{ WebkitAppRegion: "drag" } as React.CSSProperties}>
      <div className='flex items-center gap-2'>
      </div>
      <div className=''>
        <Button 
          onClick={handleMinimize} 
          title="Minimaze" 
          variant="ghost"
          className='rounded-xs'
          >
          <Minus size={24} />
        </Button>
        <Button 
          onClick={handleMaximize} 
          title="Maximaze" 
          variant="ghost"
          className='rounded-xs'
        >
          <Square size={24} />
        </Button>
        <Button 
          onClick={handleClose} 
          title="Close"
          variant="ghost" 
          className='dark:hover:bg-red-600 rounded-xs'>
          <X size={24} />
        </Button>
      </div>
    </header>
  );
};

export default TitlebarControls;