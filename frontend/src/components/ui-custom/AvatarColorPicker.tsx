
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui-custom/Button';
import { User } from 'lucide-react';

const colorOptions = [
  { name: 'green', color: '#1DB954', textColor: 'text-white', label: 'Green' },
  { name: 'blue', color: '#4287f5', textColor: 'text-white', label: 'Blue' },
  { name: 'purple', color: '#9966ff', textColor: 'text-white', label: 'Purple' },
  { name: 'pink', color: '#ff66b3', textColor: 'text-white', label: 'Pink' },
  { name: 'orange', color: '#ff9933', textColor: 'text-white', label: 'Orange' },
  { name: 'yellow', color: '#ffcc33', textColor: 'text-black', label: 'Yellow' },
  { name: 'gray', color: '#6b7280', textColor: 'text-white', label: 'Gray' },
  { name: 'peach', color: '#ffaa80', textColor: 'text-black', label: 'Peach' },
];

interface AvatarColorPickerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AvatarColorPicker: React.FC<AvatarColorPickerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const { themeColor, setThemeColor } = useTheme();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
  };
  
  const handleColorSelect = (colorName: string) => {
    setThemeColor(colorName as any);
  };
  
  const currentColor = colorOptions.find(option => option.name === themeColor)?.color || '#1DB954';
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className={`rounded-full p-0 ${sizeClasses[size]} ${className}`} 
          style={{ backgroundColor: currentColor }}
          variant="primary"
        >
          <User className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle>Choose Your Theme Color</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {colorOptions.map((option) => (
            <button
              key={option.name}
              className={`rounded-full w-12 h-12 flex items-center justify-center border-2 transition-all ${
                themeColor === option.name ? 'border-white scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: option.color }}
              onClick={() => handleColorSelect(option.name)}
              aria-label={`Select ${option.label} theme`}
            >
              {themeColor === option.name && (
                <div className={`w-3 h-3 rounded-full bg-white`}></div>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {colorOptions.map((option) => (
            <div 
              key={`label-${option.name}`} 
              className={`text-xs px-2 py-1 rounded-full ${
                themeColor === option.name ? 'bg-muted' : ''
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};