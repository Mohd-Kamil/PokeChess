import React from 'react';
import { useDragLayer } from 'react-dnd';
import { PIECE_ASSETS } from '../../utils/assets';

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
};

function getItemStyles(initialOffset, currentOffset) {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        };
    }
    let { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform,
    };
}

export const CustomDragLayer = () => {
    const { isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    if (!isDragging || !item || !item.piece) {
        return null;
    }

    const { piece } = item;
    const pieceImage = PIECE_ASSETS[piece.color]?.[piece.type];

    if (!pieceImage) return null;

    return (
        <div style={layerStyles}>
            <div style={getItemStyles(initialOffset, currentOffset)}>
                {/* Render the piece preview */}
                <img
                    src={pieceImage}
                    alt="drag-preview"
                    className="w-16 h-16 md:w-20 md:h-20 object-contain pixelated drop-shadow-2xl"
                    style={{
                        // Center the image relative to the cursor if needed, 
                        // but getSourceClientOffset expects top-left of the dragged item.
                        // We can adjust size here.
                    }}
                />
            </div>
        </div>
    );
};
