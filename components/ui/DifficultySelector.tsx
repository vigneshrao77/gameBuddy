"use client";

import React, { useId } from 'react';
import styles from './DifficultySelector.module.css';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  name?: string;
  className?: string;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  value,
  onChange,
  name,
  className = '',
}) => {
  const autoId = useId();
  const groupName = name || `diff-${autoId}`;

  return (
    <div className={`${styles.glassRadioGroup} ${className}`.trim()}>
      <input
        type="radio"
        name={groupName}
        id={`${autoId}-easy`}
        value="easy"
        checked={value === 'easy'}
        onChange={() => onChange('easy')}
      />
      <label htmlFor={`${autoId}-easy`}>Easy</label>

      <input
        type="radio"
        name={groupName}
        id={`${autoId}-medium`}
        value="medium"
        checked={value === 'medium'}
        onChange={() => onChange('medium')}
      />
      <label htmlFor={`${autoId}-medium`}>Medium</label>

      <input
        type="radio"
        name={groupName}
        id={`${autoId}-hard`}
        value="hard"
        checked={value === 'hard'}
        onChange={() => onChange('hard')}
      />
      <label htmlFor={`${autoId}-hard`}>Hard</label>

      <div className={styles.glassGlider} />
    </div>
  );
};

export default DifficultySelector;
