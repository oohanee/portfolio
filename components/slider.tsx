'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface Props {
    screenshots: string[]
    title: string
}

export default function ScreenshotSlider({ screenshots, title }: Props) {
    const sliderRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const [selectedImage, setSelectedImage] = useState<string | null>(null)

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
                    {screenshots.map((screenshot, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedImage(screenshot)}
                            className="aspect-video w-[320px] bg-[#181818] rounded-lg overflow-hidden flex-shrink-0 cursor-pointer focus:outline-none"
                        >
                            <Image
                                src={screenshot}
                                alt={`${title} screenshot ${i + 1}`}
                                width={800}
                                height={450}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* MODAL */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-6xl w-[70%]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white text-3xl hover:opacity-80"
                        >
                            ✕
                        </button>

                        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                            <Image
                                src={selectedImage}
                                alt="Preview"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}