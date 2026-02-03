export const FINLAND_NEWS_CONFIG = {
    // Core AI keywords to identify relevant articles
    aiKeywords: [
        'AI',
        '"Artificial Intelligence"',
        '"Machine Learning"',
        'tekoäly'
    ],

    // Geographic keywords to ensure the news is about Finland
    geoKeywords: [
        'Finland',
        'Finnish',
        'Suomi',
        'Helsinki',
        'Espoo',
        'Tampere',
        'Oulu',
        'Turku',
        'Vantaa',
        'Nokia',
        'VTT'
    ],

    // Reliable sources to prioritize (used for NewsAPI domain boosting)
    trustedDomains: [
        'yle.fi',
        'helsinkitimes.fi',
        'sitra.fi',
        'businessfinland.fi',
        'aalto.fi',
        'helsinki.fi',
        'kauppalehti.fi',
        'tekniikkatalous.fi',
        'tivi.fi',
        'talouselama.fi',
        'hs.fi',
        'is.fi',
        'svenska.yle.fi',
        'thelocal.fi',
        'techcrunch.com',
        'venturebeat.com',
        'europa.eu',
        'oecd.ai',
        'reuters.com',
        'bloomberg.com',
        'euronews.com',
        'politico.eu',
        'wired.com',
        'thenextweb.com'
    ],

    // Low quality or spammy domains to block
    excludedDomains: [
        'slashdot.org',
        'globenewswire.com',
        'prweb.com',
        'businesswire.com',
        'marketwatch.com',
        'pinterest.com'
    ],

    // Specific topics and their keywords
    categories: {
        research: {
            label: 'AI Development & Research',
            keywords: ['research', 'development', 'innovation', 'R&D', 'breakthrough', 'laboratory', 'university', 'tutkija', 'science', 'model']
        },
        adoption: {
            label: 'AI Adoption & Implementation',
            keywords: ['adoption', 'implementation', 'use-case', 'digital transformation', 'käyttöönotto', 'teollisuus', 'enterprise', 'business']
        },
        funding: {
            label: 'AI Funding & Investment',
            keywords: ['funding', 'investment', 'venture capital', 'grant', 'Business Finland', 'rahoitus', 'sijoitus', 'startup', 'VC', 'IPO']
        },
        jobs: {
            label: 'AI Job Market & Employment',
            keywords: ['jobs', 'employment', 'workforce', 'career', 'hiring', 'talent shortage', 'skills gap', 'työpaikat', 'rekrytointi', 'osaajat']
        },
        education: {
            label: 'AI Education & Training',
            keywords: ['education', 'training', 'course', 'university', 'Elements of AI', 'koulutus', 'oppiminen', 'learning']
        },
        policy: {
            label: 'AI Policy & Regulation',
            keywords: ['policy', 'regulation', 'AI Act', 'strategy', 'government', 'legislation', 'hallitus', 'lainsäädäntö', 'law']
        },
        ethics: {
            label: 'AI Ethics & Security',
            keywords: ['ethics', 'security', 'privacy', 'trust', 'bias', 'safety', 'turvallisuus', 'etiikka', 'deepfake']
        },
        public: {
            label: 'Public & Government Perspectives',
            keywords: ['society', 'public', 'opinion', 'perspective', 'civil society', 'yhteiskunta', 'kansalainen', 'impact', 'future']
        }
    }
} as const

// Helper to construct query strings from config
export function getFinlandQuery(category?: string) {
    const base = `(${FINLAND_NEWS_CONFIG.aiKeywords.join(' OR ')}) AND (${FINLAND_NEWS_CONFIG.geoKeywords.join(' OR ')})`

    if (category && category !== 'all' && category in FINLAND_NEWS_CONFIG.categories) {
        const cat = FINLAND_NEWS_CONFIG.categories[category as keyof typeof FINLAND_NEWS_CONFIG.categories]
        return `(${base}) AND (${cat.keywords.join(' OR ')})`
    }

    return base
}
