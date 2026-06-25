import {
  assessmentQuestions,
  assessmentTypes,
  recommendationRules,
  riskLevels,
} from '../../data/assessments/assessmentData.js'

function buildResponse(message, data) {
  return {
    success: true,
    message,
    data,
  }
}

function getRiskLevelByPercentage(percentageScore) {
  return (
    riskLevels.find(
      (item) => percentageScore >= item.min && percentageScore <= item.max,
    ) || riskLevels[riskLevels.length - 1]
  )
}

export async function getAssessmentTypes() {
  return Promise.resolve(buildResponse('Jenis asesmen berhasil dimuat.', assessmentTypes))
}

export async function getAssessmentQuestions(assessmentTypeId) {
  const questions = assessmentQuestions.filter(
    (item) => item.assessmentTypeId === assessmentTypeId,
  )

  return Promise.resolve(buildResponse('Pertanyaan asesmen berhasil dimuat.', questions))
}

export function calculateAssessmentScore(answers, questions) {
  const totalScore = questions.reduce((sum, question) => {
    const selectedOptionId = answers[question.id]
    const selectedOption = question.options.find((option) => option.id === selectedOptionId)

    return sum + (selectedOption?.score || 0)
  }, 0)

  const maxScore = questions.reduce((sum, question) => {
    const highestScore = Math.max(...question.options.map((option) => option.score))
    return sum + highestScore
  }, 0)

  const percentageScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  const riskLevel = getRiskLevelByPercentage(percentageScore)

  return {
    totalScore,
    maxScore,
    percentageScore,
    riskLevel,
  }
}

export function getRecommendations(score, answers, questions) {
  const riskLevel = getRiskLevelByPercentage(score)
  const lowThreshold = 5

  const answeredQuestions = questions.map((question) => {
    const selectedOptionId = answers[question.id]
    const selectedOption = question.options.find((option) => option.id === selectedOptionId)

    return {
      ...question,
      selectedOption,
    }
  })

  const improvementAreas = answeredQuestions
    .filter((question) => (question.selectedOption?.score ?? 0) <= lowThreshold)
    .map((question) => ({
      category: question.category,
      recommendation: question.recommendationIfLow,
    }))

  const strongAreas = answeredQuestions
    .filter((question) => (question.selectedOption?.score ?? 0) >= 10)
    .map((question) => question.category)

  const recommendations = [
    ...recommendationRules.universal,
    ...(recommendationRules.scoreBands[riskLevel.id] || []),
    ...improvementAreas.map((item) => item.recommendation),
  ].filter((item, index, list) => list.indexOf(item) === index)

  return {
    riskLevel,
    summary: riskLevel.summary,
    strongAreas: strongAreas.length > 0 ? strongAreas : ['Belum ada area yang benar-benar konsisten kuat'],
    improvementAreas:
      improvementAreas.length > 0
        ? improvementAreas
        : [{ category: 'Konsistensi Keamanan', recommendation: 'Pertahankan kebiasaan yang sudah baik.' }],
    recommendations,
  }
}

export async function submitAssessmentResult(result) {
  return Promise.resolve(
    buildResponse('Mode demo: hasil asesmen berhasil diproses secara lokal.', result),
  )
}
