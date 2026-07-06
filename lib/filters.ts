export type SortField = 'id' | 'year' | 'title'
export type SortDir = 'asc' | 'desc'
export type BoolOp = 'AND' | 'OR'

export interface TechStack {
    name: string
    icon: string
}

export interface Category {
    id: number
    name: string
    slug: string
    icon?: string
    icon_active?: string
}

export interface Project {
    id: number
    title: string
    slug: string
    category_id: number
    description: string | null
    tags: string[] | null
    thumbnail: string
    screenshots?: string[] | null
    what_i_did?: string[] | null
    icon: string | null
    year: number | null
    action?: string | null
    tech_stack: TechStack[] | null
    categories: Category
}

export interface DiscoverFilters {
    q?: string
    cat?: string[]
    tech?: string[]
    techx?: string[]
    techop?: BoolOp
    tag?: string[]
    tagx?: string[]
    tagop?: BoolOp
    yfrom?: number
    yto?: number
    sort?: SortField
    dir?: SortDir
}

type RawSearchParams = Record<string, string | string[] | undefined>

const toArr = (v?: string) => (v ? v.split(',').filter(Boolean) : undefined)
const lower = (arr?: string[]) => arr?.map((s) => s.toLowerCase())

/** Reads Next.js searchParams (already awaited) into a typed filter object. */
export function parseFilters(sp: RawSearchParams): DiscoverFilters {
    const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined

    return {
        q: get('q')?.trim() || undefined,
        cat: toArr(get('cat')),
        tech: toArr(get('tech')),
        techx: toArr(get('techx')),
        techop: (get('techop') as BoolOp) || 'OR',
        tag: toArr(get('tag')),
        tagx: toArr(get('tagx')),
        tagop: (get('tagop') as BoolOp) || 'OR',
        yfrom: get('yfrom') ? Number(get('yfrom')) : undefined,
        yto: get('yto') ? Number(get('yto')) : undefined,
        sort: (get('sort') as SortField) || 'id',
        dir: (get('dir') as SortDir) || 'desc',
    }
}

/** Returns true if any filter (other than sort) is currently active. */
export function hasActiveFilters(f: DiscoverFilters): boolean {
    return Boolean(
        f.q || f.cat?.length || f.tech?.length || f.techx?.length || f.tag?.length || f.tagx?.length || f.yfrom || f.yto
    )
}

export function applyFilters(projects: Project[], f: DiscoverFilters): Project[] {
    const q = f.q?.toLowerCase()
    const cat = lower(f.cat)
    const tech = lower(f.tech)
    const techx = lower(f.techx)
    const tag = lower(f.tag)
    const tagx = lower(f.tagx)

    const filtered = projects.filter((p) => {
        if (q) {
            const haystack = `${p.title} ${p.description ?? ''}`.toLowerCase()
            if (!haystack.includes(q)) return false
        }

        if (cat?.length && !cat.includes(p.categories.slug.toLowerCase())) return false

        if (f.yfrom != null && (p.year == null || p.year < f.yfrom)) return false
        if (f.yto != null && (p.year == null || p.year > f.yto)) return false

        const pTechs = (p.tech_stack ?? []).map((t) => t.name.toLowerCase())
        if (tech?.length) {
            const matches = f.techop === 'AND' ? tech.every((t) => pTechs.includes(t)) : tech.some((t) => pTechs.includes(t))
            if (!matches) return false
        }
        if (techx?.length && techx.some((t) => pTechs.includes(t))) return false

        const pTags = (p.tags ?? []).map((t) => t.toLowerCase())
        if (tag?.length) {
            const matches = f.tagop === 'AND' ? tag.every((t) => pTags.includes(t)) : tag.some((t) => pTags.includes(t))
            if (!matches) return false
        }
        if (tagx?.length && tagx.some((t) => pTags.includes(t))) return false

        return true
    })

    const dirMul = f.dir === 'asc' ? 1 : -1

    return [...filtered].sort((a, b) => {
        switch (f.sort) {
            case 'title':
                return a.title.localeCompare(b.title) * dirMul
            case 'year':
                return ((a.year ?? 0) - (b.year ?? 0)) * dirMul
            case 'id':
            default:
                return (a.id - b.id) * dirMul
        }
    })
}

/** Aggregates all unique techs/tags/years across a project list, for building filter UI options. */
export function aggregateOptions(projects: Project[]) {
    const techMap = new Map<string, TechStack>()
    const tagSet = new Set<string>()
    const yearSet = new Set<number>()

    projects.forEach((p) => {
        p.tech_stack?.forEach((t) => {
            if (!techMap.has(t.name)) techMap.set(t.name, t)
        })
        p.tags?.forEach((t) => tagSet.add(t))
        if (p.year) yearSet.add(p.year)
    })

    return {
        techs: Array.from(techMap.values()).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })),
        tags: Array.from(tagSet).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
        years: Array.from(yearSet).sort((a, b) => b - a),
    }
}