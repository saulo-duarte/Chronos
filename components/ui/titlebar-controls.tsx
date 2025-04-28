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
    <header className="flex items-center justify-end gap-8 bg-background border-b-[3px] h-12 select-none" style={{ WebkitAppRegion: "drag" } as React.CSSProperties}>
      <Button 
        onClick={handleMinimize} 
        title="Minimaze" 
        variant="ghost"
        >
        <Minus size={24} />
      </Button>
      <Button 
        onClick={handleMaximize} 
        title="Maximaze" 
        variant="ghost"
      >
        <Square size={24} />
      </Button>
      <Button 
        onClick={handleClose} 
        title="Close"
        variant="ghost" 
        className='hover:bg-destructive'>
        <X size={24} />
      </Button>
    </header>
  );
};

export default TitlebarControls;