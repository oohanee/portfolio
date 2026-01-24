'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface Props {
    screenshots: string[]
    title: string
}

const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
}
const isYouTubeShort = (url: string) => url.includes('/shorts/')
const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('/').pop()?.split('?')[0]
    return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : url
}

export default function ScreenshotSlider({ screenshots, title }: Props) {
    const sliderRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
    const [isSelectedVideo, setIsSelectedVideo] = useState(false)

    const scroll = (direction: 'left' | 'right') => {
        if (!sliderRef.current) return

        const scrollAmount = 340
        sliderRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        })
    }

    const updateScrollButtons = () => {
        const el = sliderRef.current
        if (!el) return

        setCanScrollLeft(el.scrollLeft > 0)
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }

    const handleMediaClick = (media: string) => {
        setSelectedMedia(media)
        setIsSelectedVideo(isYouTubeUrl(media))
    }

    const closeModal = () => {
        setSelectedMedia(null)
        setIsSelectedVideo(false)
    }

    useEffect(() => {
        updateScrollButtons()
    }, [])

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Preview</h2>

            {/* Slider Wrapper */}
            <div className="relative group">
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-full w-16 flex items-center justify-center bg-gradient-to-r from-black/60 to-transparent text-white text-3xl"
                    >
                        ‹
                    </button>
                )}

                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-full w-16 flex items-center justify-center bg-gradient-to-l from-black/60 to-transparent text-white text-3xl"
                    >
                        ›
                    </button>
                )}

                {/* SLIDER */}
                <div
                    ref={sliderRef}
                    onScroll={updateScrollButtons}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                >
                    {screenshots.map((media, i) => {
                        const isVideo = isYouTubeUrl(media)
                        const isShort = isYouTubeShort(media)
                        return (
                            <button
                                key={i}
                                onClick={() => handleMediaClick(media)}
                                className={`bg-[#181818] rounded-lg overflow-hidden flex-shrink-0 cursor-pointer focus:outline-none
                                ${isVideo
                                    ? isShort
                                        ? 'h-[220px] aspect-[9/16]'
                                        : 'h-[220px] aspect-video'
                                    : 'h-[220px] min-w-[90px] max-w-[360px]'
                                }`}
                            >
                                {isVideo ? (
                                    <iframe
                                        src={getYouTubeEmbedUrl(media)}
                                        className="w-full h-full pointer-events-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <Image
                                        src={media}
                                        alt={`${title} screenshot ${i + 1}`}
                                        width={800}
                                        height={450}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* MODAL */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-[80vw] max-h-[80vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute -top-12 right-0 text-white text-3xl hover:opacity-80"
                        >
                            ✕
                        </button>

                        <div className="ax-h-[80vh] rounded-lg overflow-y-auto flex items-center justify-center">
                            {isSelectedVideo ? (
                                <iframe
                                    src={getYouTubeEmbedUrl(selectedMedia)}
                                    className={
                                        isYouTubeShort(selectedMedia)
                                            ? 'h-[80vh] w-auto max-w-[80vw]'
                                            : 'w-[80vw] max-h-[80vh] aspect-video'
                                    }
                                    allowFullScreen
                                />
                            ) : (
                                <Image
                                    src={selectedMedia}
                                    alt="Preview"
                                    width={1600}
                                    height={1600}
                                    className="max-w-[80vw] max-h-[80vh] w-auto h-auto object-contain"
                                    priority
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}