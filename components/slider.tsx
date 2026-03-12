'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface Props {
    screenshots: string[]
    title: string
}

const IMAGE_EXTENSIONS = ['.webp', '.png', '.jpg', '.jpeg']

const isImage = (url: string) => {
    const lower = url.toLowerCase()
    return IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext))
}

const isYouTubeUrl = (url: string) =>
    url.includes('youtube.com') || url.includes('youtu.be')

const isYouTubeShort = (url: string) => url.includes('/shorts/')

const getYouTubeEmbedUrl = (url: string) => {
    const id = url.split('/').pop()?.split('?')[0]
    return id ? `https://www.youtube.com/embed/${id}` : url
}

export default function ScreenshotSlider({ screenshots, title }: Props) {
    const sliderRef = useRef<HTMLDivElement>(null)

    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const selectedMedia =
        selectedIndex !== null ? screenshots[selectedIndex] : null

    const scroll = (direction: 'left' | 'right') => {
        const el = sliderRef.current
        if (!el) return

        el.scrollBy({
            left: direction === 'left' ? -340 : 340,
            behavior: 'smooth',
        })
    }

    const updateScrollButtons = () => {
        const el = sliderRef.current
        if (!el) return

        setCanScrollLeft(el.scrollLeft > 0)

        const threshold = 5
        setCanScrollRight(
            el.scrollLeft + el.clientWidth < el.scrollWidth - threshold
        )
    }

    const openMedia = (index: number) => setSelectedIndex(index)

    const closeModal = () => setSelectedIndex(null)

    const nextMedia = () => {
        setSelectedIndex(prev =>
            prev === null ? prev : (prev + 1) % screenshots.length
        )
    }

    const prevMedia = () => {
        setSelectedIndex(prev =>
            prev === null
                ? prev
                : (prev - 1 + screenshots.length) % screenshots.length
        )
    }

    useEffect(() => {
        updateScrollButtons()
    }, [])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (selectedIndex === null) return

            if (e.key === 'ArrowRight') nextMedia()
            if (e.key === 'ArrowLeft') prevMedia()
            if (e.key === 'Escape') closeModal()
        }

        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [selectedIndex, screenshots.length])

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
                        const video = isYouTubeUrl(media)
                        const short = isYouTubeShort(media)

                        return (
                            <button
                                key={i}
                                onClick={() => openMedia(i)}
                                className={`bg-[#181818] rounded-lg overflow-hidden flex-shrink-0 cursor-pointer focus:outline-none
                                ${video
                                        ? short
                                            ? 'h-[220px] aspect-[9/16]'
                                            : 'h-[220px] aspect-video'
                                        : 'h-[220px] min-w-[90px] max-w-[360px]'
                                    }`}
                            >
                                {video ? (
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
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={prevMedia}
                            className="absolute -left-10 top-1/2 -translate-y-1/2 text-white text-4xl px-4"
                        >
                            ‹
                        </button>

                        <button
                            onClick={nextMedia}
                            className="absolute -right-10 top-1/2 -translate-y-1/2 text-white text-4xl px-4"
                        >
                            ›
                        </button>

                        <button
                            onClick={closeModal}
                            className="absolute -top-12 right-0 text-white text-3xl hover:opacity-80"
                        >
                            ✕
                        </button>

                        <div className="max-h-[80vh] rounded-lg overflow-y-auto flex items-center justify-center">
                            {isImage(selectedMedia) ? (
                                <Image
                                    src={selectedMedia}
                                    alt="Preview"
                                    width={1600}
                                    height={1600}
                                    className="max-w-[80vw] max-h-[80vh] w-auto h-auto object-contain"
                                    priority
                                />
                            ) : (
                                <iframe
                                    src={getYouTubeEmbedUrl(selectedMedia)}
                                    className={
                                        isYouTubeShort(selectedMedia)
                                            ? 'h-[80vh] w-auto max-w-[80vw]'
                                            : 'w-[80vw] max-h-[80vh] aspect-video'
                                    }
                                    allowFullScreen
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}