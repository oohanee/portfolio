'use client'

import { useMemo, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { BoolOp, Category, TechStack } from '@/lib/filters'
import SortDropdown from "@/components/SortDropdown"

type TriState = 'none' | 'include' | 'exclude'

export default function FilterSidebar({
    categories,
    techs,
    tags,
}: {
    categories: Category[]
    techs: TechStack[]
    tags: string[]
}) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const parseList = (key: string) => searchParams.get(key)?.split(',').filter(Boolean) ?? []

    const [q, setQ] = useState(searchParams.get('q') ?? '')
    const [cat, setCat] = useState<string[]>(parseList('cat'))
    const [techInclude, setTechInclude] = useState<string[]>(parseList('tech'))
    const [techExclude, setTechExclude] = useState<string[]>(parseList('techx'))
    const [techOp, setTechOp] = useState<BoolOp>((searchParams.get('techop') as BoolOp) ?? 'OR')
    const [tagInclude, setTagInclude] = useState<string[]>(parseList('tag'))
    const [tagExclude, setTagExclude] = useState<string[]>(parseList('tagx'))
    const [tagOp, setTagOp] = useState<BoolOp>((searchParams.get('tagop') as BoolOp) ?? 'OR')
    const [yfrom, setYfrom] = useState(searchParams.get('yfrom') ?? '')
    const [yto, setYto] = useState(searchParams.get('yto') ?? '')
    const [sort, setSort] = useState(searchParams.get('sort') ?? 'year')
    const [dir, setDir] = useState(searchParams.get('dir') ?? 'desc')

    const [techQuery, setTechQuery] = useState('')
    const [tagQuery, setTagQuery] = useState('')

    const [mobileOpen, setMobileOpen] = useState(false)

    const triState = (name: string, include: string[], exclude: string[]): TriState =>
        include.includes(name) ? 'include' : exclude.includes(name) ? 'exclude' : 'none'

    // Click cycle: none -> include -> exclude -> none
    const cycle = (
        name: string,
        include: string[],
        exclude: string[],
        setInclude: (v: string[]) => void,
        setExclude: (v: string[]) => void
    ) => {
        const state = triState(name, include, exclude)
        if (state === 'none') {
            setInclude([...include, name])
        } else if (state === 'include') {
            setInclude(include.filter((n) => n !== name))
            setExclude([...exclude, name])
        } else {
            setExclude(exclude.filter((n) => n !== name))
        }
    }

    const toggleCat = (slug: string) =>
        setCat((s) => (s.includes(slug) ? s.filter((c) => c !== slug) : [...s, slug]))

    const filteredTechs = useMemo(
        () => techs.filter((t) => t.name.toLowerCase().includes(techQuery.toLowerCase())),
        [techs, techQuery]
    )
    const filteredTags = useMemo(
        () => tags.filter((t) => t.toLowerCase().includes(tagQuery.toLowerCase())),
        [tags, tagQuery]
    )

    const activeCount =
        (q ? 1 : 0) +
        cat.length +
        techInclude.length +
        techExclude.length +
        tagInclude.length +
        tagExclude.length +
        (yfrom ? 1 : 0) +
        (yto ? 1 : 0)

    const buildParams = () => {
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        if (cat.length) params.set('cat', cat.join(','))
        if (techInclude.length) params.set('tech', techInclude.join(','))
        if (techExclude.length) params.set('techx', techExclude.join(','))
        if (techInclude.length > 1) params.set('techop', techOp)
        if (tagInclude.length) params.set('tag', tagInclude.join(','))
        if (tagExclude.length) params.set('tagx', tagExclude.join(','))
        if (tagInclude.length > 1) params.set('tagop', tagOp)
        if (yfrom) params.set('yfrom', yfrom)
        if (yto) params.set('yto', yto)
        if (sort !== 'id') params.set('sort', sort)
        if (dir !== 'desc') params.set('dir', dir)
        return params
    }

    const apply = () => {
        const params = buildParams()
        startTransition(() => {
            router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname, { scroll: false })
        })
    }

    const clear = () => {
        setQ('')
        setCat([])
        setTechInclude([])
        setTechExclude([])
        setTechOp('OR')
        setTagInclude([])
        setTagExclude([])
        setTagOp('OR')
        setYfrom('')
        setYto('')
        setSort('id')
        setDir('desc')
        startTransition(() => {
            router.push(pathname, { scroll: false })
        })
    }

    const pillClass = (state: TriState) =>
        state === 'include'
            ? 'bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 text-white'
            : state === 'exclude'
                ? 'bg-red-500/15 text-red-400 line-through decoration-2'
                : 'bg-[#282828] text-[#B3B3B3] hover:text-white hover:bg-[#333]'

    const OpToggle = ({ value, onChange }: { value: BoolOp; onChange: (op: BoolOp) => void }) => (
        <div className="flex text-[11px] bg-[#282828] rounded-full p-0.5">
            {(['OR', 'AND'] as BoolOp[]).map((op) => (
                <button
                    key={op}
                    type="button"
                    onClick={() => onChange(op)}
                    className={`px-2 py-0.5 rounded-full transition-colors ${value === op ? 'bg-violet-500 text-white' : 'text-[#B3B3B3] hover:text-white'
                        }`}
                >
                    {op}
                </button>
            ))}
        </div>
    )

    return (
        <aside className="bg-[#181818] rounded-lg p-6 w-full lg:w-80 shrink-0 h-fit">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                    Filters{" "}
                    {activeCount > 0 && (
                        <span className="text-xs font-normal text-[#B3B3B3]">
                            ({activeCount})
                        </span>
                    )}
                </h2>
                <button
                    type="button"
                    onClick={() => setMobileOpen((v) => !v)}
                    className="lg:hidden text-xs text-violet-400 hover:text-violet-300"
                >
                    [{mobileOpen ? "Hide" : "Show"}]
                </button>
            </div>
            {/* Collapsible on mobile */}
            <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block space-y-7 mt-6`}>
                {/* Search */}
                <div>
                    <label className="text-sm font-semibold mb-2 block">Search</label>
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Title or description..."
                        className="w-full bg-[#282828] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-violet-400 placeholder:text-[#666]"
                    />
                </div>

                {/* Category (OR multi-select — a project only has one category) */}
                <div>
                    <label className="text-sm font-semibold mb-2 block">Category</label>
                    <div className="space-y-1.5">
                        {categories.map((c) => (
                            <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={cat.includes(c.slug)}
                                    onChange={() => toggleCat(c.slug)}
                                    className="accent-violet-500 w-3.5 h-3.5"
                                />
                                <span className={cat.includes(c.slug) ? 'text-white' : 'text-[#B3B3B3]'}>{c.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Year range */}
                <div>
                    <label className="text-sm font-semibold mb-2 block">Year</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            inputMode="numeric"
                            value={yfrom}
                            onChange={(e) => setYfrom(e.target.value)}
                            placeholder="From"
                            className="w-full bg-[#282828] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-violet-400 placeholder:text-[#666]"
                        />
                        <span className="text-[#666]">–</span>
                        <input
                            type="number"
                            inputMode="numeric"
                            value={yto}
                            onChange={(e) => setYto(e.target.value)}
                            placeholder="To"
                            className="w-full bg-[#282828] rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-violet-400 placeholder:text-[#666]"
                        />
                    </div>
                </div>

                {/* Tech stack */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold">Tech Stack</label>
                        {techInclude.length > 1 && <OpToggle value={techOp} onChange={setTechOp} />}
                    </div>
                    <input
                        value={techQuery}
                        onChange={(e) => setTechQuery(e.target.value)}
                        placeholder="Search tech..."
                        className="w-full bg-[#282828] rounded-md px-3 py-1.5 text-xs mb-2 outline-none focus:ring-1 focus:ring-violet-400 placeholder:text-[#666]"
                    />
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {filteredTechs.map((t) => (
                            <button
                                key={t.name}
                                type="button"
                                onClick={() => cycle(t.name, techInclude, techExclude, setTechInclude, setTechExclude)}
                                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${pillClass(
                                    triState(t.name, techInclude, techExclude)
                                )}`}
                            >
                                {t.name}
                            </button>
                        ))}
                        {filteredTechs.length === 0 && <p className="text-xs text-[#666]">No matches</p>}
                    </div>
                    <p className="text-[10px] text-[#666] mt-1.5">Click to include, click again to exclude</p>
                </div>

                {/* Tags */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold">Tags</label>
                        {tagInclude.length > 1 && <OpToggle value={tagOp} onChange={setTagOp} />}
                    </div>
                    <input
                        value={tagQuery}
                        onChange={(e) => setTagQuery(e.target.value)}
                        placeholder="Search tags..."
                        className="w-full bg-[#282828] rounded-md px-3 py-1.5 text-xs mb-2 outline-none focus:ring-1 focus:ring-violet-400 placeholder:text-[#666]"
                    />
                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {filteredTags.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => cycle(t, tagInclude, tagExclude, setTagInclude, setTagExclude)}
                                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${pillClass(
                                    triState(t, tagInclude, tagExclude)
                                )}`}
                            >
                                {t}
                            </button>
                        ))}
                        {filteredTags.length === 0 && <p className="text-xs text-[#666]">No matches</p>}
                    </div>
                    <p className="text-[10px] text-[#666] mt-1.5">Click to include, click again to exclude</p>
                </div>

                {/* Sort */}
                <div>
                    <label className="text-sm font-semibold mb-2 block">Sort by</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <SortDropdown
                                value={sort}
                                onChange={setSort}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#888]"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </div>
                        <div className="flex flex-col items-center justify-between h-[40px] gap-0.5">
                            <button
                                type="button"
                                onClick={() => setDir(dir === "asc" ? "desc" : "asc")}
                                title={dir === "asc" ? "Ascending" : "Descending"}
                                className="w-8 h-8 bg-[#282828] rounded-md border border-[#333]
               hover:border-violet-500 transition-all flex items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className={`w-4 h-4 text-violet-400 transition-transform duration-300 ${dir === "asc" ? "rotate-180" : ""
                                        }`}
                                >
                                    <path d="M12 5v14" />
                                    <path d="M19 12l-7 7-7-7" />
                                </svg>
                            </button>

                            <p className="text-[9px] leading-none text-[#777] whitespace-nowrap">
                                {sort === "title"
                                    ? dir === "asc"
                                        ? "A → Z"
                                        : "Z → A"
                                    : dir === "desc"
                                        ? "Newest first"
                                        : "Oldest first"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                    <button type="button" onClick={clear} className="text-xs text-violet-400 hover:text-violet-300">
                        Clear all
                    </button>
                    <button
                        type="button"
                        onClick={apply}
                        disabled={isPending}
                        className="bg-gradient-to-br from-indigo-500 via-violet-400 to-teal-100 text-white py-2.5 px-5 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform disabled:opacity-50"
                    >
                        {isPending ? 'Applying...' : 'Apply Filters'}
                    </button>
                </div>
            </div>
        </aside>
    )
}