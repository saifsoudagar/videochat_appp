// backend/utils/cosineSimilarity.js
const cosineSimilarity = (interests1, interests2) => {
    if (!interests1.length || !interests2.length) return 0;
    const set1 = new Set(interests1.map(i => i.toLowerCase().trim()));
    const set2 = new Set(interests2.map(i => i.toLowerCase().trim()));
    const intersection = [...set1].filter(item => set2.has(item)).length;
    const similarity = intersection / Math.sqrt(set1.size * set2.size);
    return similarity;
};

module.exports = cosineSimilarity;