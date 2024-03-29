import { useContext, useEffect, useRef } from "react";
import { videoContext } from "../../../context/videoContext";
import './Trimmer.css';
import { IDragStatus } from "./Trimmer.types";
import { TTarget } from "../../components/dragable/Draggable.types";

const MIN_TRIM_WIDTH = 40;

export const Trimmer = () => {
    const { video, startTime, setStartTime, endTime, setEndTime, setIsOnTrim } = useContext(videoContext);
    const gripRef = useRef<HTMLDivElement>(null);
    const spaceRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const dragRef = useRef<IDragStatus>({
        startPosition: 0,
        startWidth: 200,
        x: 0,
        isOn: false,
        currPosition: 0,
        currWidth: 0,
        target: 'drag'
    });

    useEffect(() => {
        if (gripRef?.current) {
            gripRef.current.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            if (gripRef?.current) {
                gripRef.current.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mouseup', handleMouseUp);
            }
        }
    }, []);

    useEffect(() => {
        if(video?.current) {
            video.current.addEventListener('loadedmetadata', handleInit);
        }
        return () => {
            if(video?.current) {
                video.current.removeEventListener('loadedmetadata', handleInit);
            }
        }
    }, [video?.current]);

    const handleInit = () => {
        setPosition();
    }

    const handleMouseDown = (e: MouseEvent) => {
        if (!spaceRef.current) { return; }
        const eTarget = e.target as HTMLElement;

        dragRef.current.startPosition = spaceRef.current.offsetLeft;
        dragRef.current.startWidth = spaceRef.current.offsetWidth;

        dragRef.current.x = e.x;
        dragRef.current.isOn = true;

        dragRef.current.target = eTarget.getAttribute('data-dir') as TTarget;

        if(dragRef.current.target === 'drag') {
            skipToPosition(e.x);
        } else {
            setIsOnTrim(true);
        }
    }

    const skipToPosition = (x: number) => {
        if(!wrapRef.current || !video?.current) { return; }

        const { left, width } = wrapRef.current.getBoundingClientRect();
        const pos = x - left;

        const per = pos / width;
        video.current.currentTime = per * video.current.duration;
    }

    const handleMouseUp = () => {
        if (!wrapRef.current || !dragRef.current.isOn) { return }

        dragRef.current.isOn = false;
        dragRef.current.startPosition = dragRef.current.currPosition;
        dragRef.current.startWidth = dragRef.current.currWidth;
        setIsOnTrim(false);
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!wrapRef.current || !dragRef.current.isOn) { return }

            const diff = e.x - dragRef.current.x;
            let leftWidth = dragRef.current.startPosition;
            let width = dragRef.current.startWidth;

            switch (dragRef.current.target) {
                case 'right': {
                    width += diff;

                    if(width < MIN_TRIM_WIDTH) {
                        width = MIN_TRIM_WIDTH;
                        leftWidth = dragRef.current.currPosition;
                    }

                    if (leftWidth + width > wrapRef.current.offsetWidth) {
                        width = dragRef.current.currWidth;
                        leftWidth = wrapRef.current.offsetWidth - width;
                    }

                    break;
                }
                case 'left': {
                    leftWidth += diff;

                    if (leftWidth < 0) {
                        leftWidth = 0;
                        width = dragRef.current.currWidth;
                    } else {
                        width -= diff;
                    }

                    if(width < MIN_TRIM_WIDTH) {
                        width = MIN_TRIM_WIDTH;
                        leftWidth = dragRef.current.currPosition;
                    }

                    break;
                }
            }

            setPosition(leftWidth, width);
        };

        const handleMouseMoveEvent = (e: MouseEvent) => {
            handleMouseMove(e);
        };

        window.addEventListener('mousemove', handleMouseMoveEvent);

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveEvent);
        };
    }, []);

    const setPosition = (left = dragRef.current.startPosition, width = dragRef.current.startWidth) => {
        if (!wrapRef.current) { return }
        const perLeft = (left /  wrapRef.current.offsetWidth) * 100;
        const perWidth = (width /  wrapRef.current.offsetWidth) * 100;

        wrapRef.current.style.gridTemplateColumns = `${perLeft}% ${perWidth}% auto`;
        dragRef.current.currPosition = left;
        dragRef.current.currWidth = width;

        if(video?.current) {
            const perLeft = left / wrapRef.current.offsetWidth;
            const startTime = perLeft * video.current.duration;
            setStartTime(startTime);

            const perWidth = (left + width) / wrapRef.current.offsetWidth;
            const endTime = perWidth * video.current.duration;
            setEndTime(endTime);
        }
    }

    function formatTime(time: number): string {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    return (
        <div className="Trimmer" ref={wrapRef}>
            <div></div>
            <div ref={spaceRef}>
                <div ref={gripRef} className="grip" data-dir="drag">
                    <div className="time-indicator-start">{formatTime(startTime)}</div>
                    <div data-dir="left"></div>
                    <div className="time-indicator-end">{formatTime(endTime)}</div>
                    <div data-dir="right"></div>
                </div>
            </div>
            <div></div>
        </div>
    )
}