export const reputationStats = [
    { label: 'Accuracy', val: '99.2%' },
    { label: 'Data Points', val: '40K+' },
    { label: 'Avg. Speed', val: '2.8s' },
]

export const sentimentReviews = [
    { text: '"Delivered 3 days early, flawless work."', type: 'pos' as const },
    { text: '"Missed 2 deadlines in a row."', type: 'neg' as const },
    { text: '"Best React dev I\'ve ever hired."', type: 'pos' as const },
    { text: '"Communication was really poor."', type: 'neg' as const },
]

export const sentimentTags = ['NLP', 'Real-time', 'Auto-flag']

export const analyticsMetrics = [
    { label: 'On-time Delivery', val: 98, color: '#06b6d4' },
    { label: 'Client Satisfaction', val: 94, color: '#3b82f6' },
    { label: 'Repeat Hire Rate', val: 81, color: '#6366f1' },
    { label: 'Response Speed', val: 89, color: '#8b5cf6' },
]

export const comparisonFreelancers = [
    { name: 'john_dev', score: 96, rate: '$85', top: true },
    { name: 'sara_ux', score: 88, rate: '$70', top: false },
    { name: 'mk_code', score: 74, rate: '$55', top: false },
]

export const riskItems = [
    { label: 'Fake Reviews', status: 'Flagged', c: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { label: 'Rating Drop', status: 'Warning', c: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Identity', status: 'Verified', c: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
]

export const platforms = [
    { name: 'Upwork', score: 4.9, jobs: 142, color: '#14a800', glow: 'rgba(20,168,0,0.12)' },
    { name: 'Fiverr', score: 4.8, jobs: 88, color: '#1dbf73', glow: 'rgba(29,191,115,0.12)' },
    { name: 'Toptal', score: 4.7, jobs: 23, color: '#f26822', glow: 'rgba(242,104,34,0.12)' },
]