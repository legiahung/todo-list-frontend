import {UniqueIdentifier, useDroppable} from '@dnd-kit/core';
import classNames from 'classnames';
import React from 'react';

import styles from './Droppable.module.scss';
import {droppable} from './droppable-svg';

interface Props {
  children: React.ReactNode;
  dragging: boolean;
  id: UniqueIdentifier;
}

export function Droppable({children, id, dragging}: Props) {
  const {isOver, setNodeRef} = useDroppable({
    id
  });

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        styles.Droppable,
        isOver && styles.over,
        dragging && styles.dragging,
        children && styles.dropped
      )}
      aria-label="Droppable region"
    >
      {children}
      {droppable}
    </div>
  );
}