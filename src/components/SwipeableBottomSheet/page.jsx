import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

const SwipeableBottomSheet = ({ isOpen, onClose, children, isMobile }) => {
    const [scrollValue, setScrollValue] = useState(0);

    useEffect(() => {
        isOpen ? api.start({ y: 0 }) : api.start({ y: window.innerHeight });
    }, [isOpen]);

    const [{ y }, api] = useSpring(() => ({
        y: isOpen ? 0 : window.innerHeight,
        config: { tension: 300, friction: 30 },
    }));

    useEffect(() => {
        const scrollContainer = document.querySelector('.scroll-container');
        if (!scrollContainer) return;

        const handleScroll = () => {
            console.log('scrollTop:', scrollContainer.scrollTop);
            setScrollValue(scrollContainer.scrollTop);
        };

        scrollContainer.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const bind = useDrag(
        ({ last, movement: [, my], cancel }) => {
            if (my < 0) return cancel();
            if (scrollValue > 0 && isMobile) {
                cancel?.();
                return;
            }

            if (last) {
                if (Math.abs(my) < 5) return;
                if (my > 100) {
                    onClose();
                } else {
                    api.start({ y: 0 });
                }
            } else {
                api.start({ y: my, immediate: true });
            }
        },
        {
            from: () => [0, y.get()],
            filterTaps: true,
            pointer: { touch: true },
        }
    );


    return (
        <animated.div
            {...bind()}
            style={{
                transform: y.to((val) => `translateY(${val}px)`),
            }}
            className="fixed inset-0 z-20 touch-none mt-4 cursor-grab overflow-hidden rounded-t-2xl"
        >
            {children}
        </animated.div>
    );
};

SwipeableBottomSheet.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default SwipeableBottomSheet;
