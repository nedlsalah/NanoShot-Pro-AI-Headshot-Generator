import React from 'react';
import { stylePresets, StylePreset } from '../constants';
import { BriefcaseIcon, BuildingIcon, LightbulbIcon, MuseumIcon } from './icons';

interface StyleSelectorProps {
  selectedPresetId: StylePreset['id'] | null;
  onSelectPreset: (id: StylePreset['id']) => void;
  disabled: boolean;
}

type IconProps = { className?: string };

const presetIcons: Record<StylePreset['id'], React.FC<IconProps>> = {
  corporate: BriefcaseIcon,
  creative: LightbulbIcon,
  modern: BuildingIcon,
  classic: MuseumIcon,
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedPresetId, onSelectPreset, disabled }) => {
  return (
    <div className={`w-full ${disabled ? 'opacity-50' : ''}`}>
      <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Step 2: Choose Your Style</h3>
      <div className="grid grid-cols-2 gap-3">
        {stylePresets.map((preset) => {
          const Icon = presetIcons[preset.id];
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              disabled={disabled}
              className={`p-3 rounded-lg border-2 text-left transition-all duration-200 group
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500/50'
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`
              }
              aria-pressed={isSelected}
            >
              <div className="flex items-center space-x-2">
                <Icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-blue-500'}`} />
                <h4 className="font-bold text-slate-800 dark:text-slate-100">{preset.name}</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{preset.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
