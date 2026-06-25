import { searchIndex } from '../../data/search/searchIndex.js'

export function searchCyberVault(query) {
  const normalizedQuery = String(query || '')
    .trim()
    .toLowerCase()
    .slice(0, 80)

  if (!normalizedQuery) {
    return []
  }

  const scoredResults = searchIndex
    .map((item) => {
      const title = item.title.toLowerCase()
      const description = item.description.toLowerCase()
      const keywords = item.keywords.map((keyword) => keyword.toLowerCase())

      let score = 0

      if (title.includes(normalizedQuery)) {
        score += 4
      }

      if (description.includes(normalizedQuery)) {
        score += 2
      }

      if (keywords.some((keyword) => keyword.includes(normalizedQuery))) {
        score += 3
      }

      const keywordStartsWith = keywords.some((keyword) => keyword.startsWith(normalizedQuery))
      if (keywordStartsWith || title.startsWith(normalizedQuery)) {
        score += 1
      }

      return {
        ...item,
        score,
      }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return left.title.localeCompare(right.title)
    })

  return scoredResults.slice(0, 6).map(({ score, ...item }) => item)
}
