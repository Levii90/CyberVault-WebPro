import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  assessmentStats,
} from '../../data/assessments/assessmentData.js'
import {
  calculateAssessmentScore,
  getAssessmentQuestions,
  getAssessmentTypes,
  getRecommendations,
  submitAssessmentResult,
} from '../../services/assessments/assessmentService.js'
import '../../styles/AsesmenPage.css'

function Asesmen() {
  const navigate = useNavigate()
  const [assessmentTypes, setAssessmentTypes] = useState([])
  const [selectedAssessment, setSelectedAssessment] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [result, setResult] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [validationError, setValidationError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isQuestionLoading, setIsQuestionLoading] = useState(false)

  useEffect(() => {
    async function loadAssessmentTypes() {
      setIsLoading(true)

      try {
        const response = await getAssessmentTypes()
        setAssessmentTypes(response.data || [])
      } finally {
        setIsLoading(false)
      }
    }

    loadAssessmentTypes()
  }, [])

  const currentQuestion = questions[currentIndex] || null
  const progressPercentage =
    questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0
  const selectedAnswerId = currentQuestion ? answers[currentQuestion.id] || '' : ''

  const assessmentOverview = useMemo(() => {
    return assessmentStats.map((item) => {
      if (item.id === 'types') {
        return { ...item, value: String(assessmentTypes.length || 0) }
      }

      if (item.id === 'questions') {
        const questionTotal = assessmentTypes.reduce(
          (sum, itemData) => sum + itemData.questionCount,
          0,
        )

        return { ...item, value: String(questionTotal) }
      }

      return item
    })
  }, [assessmentTypes])

  async function handleStartAssessment(type) {
    setIsQuestionLoading(true)

    try {
      const response = await getAssessmentQuestions(type.id)

      setSelectedAssessment(type)
      setQuestions(response.data || [])
      setAnswers({})
      setCurrentIndex(0)
      setResult(null)
      setValidationError('')
      setFeedbackMessage(`Asesmen "${type.title}" berhasil dimulai.`)
    } finally {
      setIsQuestionLoading(false)
    }
  }

  function handleChooseAnswer(optionId) {
    if (!currentQuestion) {
      return
    }

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionId,
    }))
    setValidationError('')
  }

  async function handleNextQuestion() {
    if (!currentQuestion || !selectedAnswerId) {
      setValidationError('Pilih satu jawaban terlebih dahulu sebelum melanjutkan.')
      return
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1)
      setValidationError('')
      return
    }

    const scoreResult = calculateAssessmentScore(answers, questions)
    const recommendationResult = getRecommendations(
      scoreResult.percentageScore,
      answers,
      questions,
    )

    const finalResult = {
      assessmentTypeId: selectedAssessment.id,
      assessmentTitle: selectedAssessment.title,
      totalScore: scoreResult.totalScore,
      maxScore: scoreResult.maxScore,
      percentageScore: scoreResult.percentageScore,
      riskLevel: scoreResult.riskLevel,
      summary: recommendationResult.summary,
      strongAreas: recommendationResult.strongAreas,
      improvementAreas: recommendationResult.improvementAreas,
      recommendations: recommendationResult.recommendations,
      answeredQuestions: Object.keys(answers).length,
    }

    const response = await submitAssessmentResult(finalResult)

    setResult(response.data)
    setFeedbackMessage(response.message)
    setValidationError('')
  }

  function handlePreviousQuestion() {
    setCurrentIndex((current) => Math.max(current - 1, 0))
    setValidationError('')
  }

  function handleResetAssessment() {
    setSelectedAssessment(null)
    setQuestions([])
    setAnswers({})
    setCurrentIndex(0)
    setResult(null)
    setValidationError('')
    setFeedbackMessage('Flow asesmen berhasil direset. Pilih asesmen untuk memulai lagi.')
  }

  return (
    <div className="cv-assessment-page">
      <section className="cv-assessment-hero cv-assessment-hero--interactive">
        <div className="cv-assessment-hero__copy">
          <span className="cv-assessment-eyebrow">Assessment Flow</span>
          <h1>Asesmen Keamanan Digital</h1>
          <p>
            Pilih jenis asesmen, jawab pertanyaan satu per satu, lalu lihat skor,
            level risiko, dan rekomendasi tindak lanjut secara lokal.
          </p>
        </div>

        <div className="cv-assessment-stat-grid">
          {assessmentOverview.map((item) => (
            <article key={item.id} className="cv-assessment-stat-card">
              <p>{item.title}</p>
              <h3>{item.value}</h3>
              <strong>{item.note}</strong>
            </article>
          ))}
        </div>
      </section>

      {feedbackMessage ? (
        <div className="cv-assessment-feedback" role="status">
          {feedbackMessage}
        </div>
      ) : null}

      <section className="cv-assessment-overview-grid cv-assessment-overview-grid--interactive">
        <article className="cv-assessment-panel cv-assessment-panel--types">
          <div className="cv-assessment-panel__head">
            <div>
              <h2>Pilih Jenis Asesmen</h2>
              <p>Setiap asesmen memiliki fokus, durasi, dan jumlah pertanyaan yang berbeda.</p>
            </div>
          </div>

          {isLoading ? (
            <div className="cv-assessment-empty-state">
              <i className="bi bi-arrow-repeat" aria-hidden="true" />
              <h3>Memuat daftar asesmen...</h3>
              <p>Jenis asesmen sedang disiapkan untuk mode demo.</p>
            </div>
          ) : null}

          {!isLoading ? (
            <div className="cv-assessment-start-grid cv-assessment-start-grid--interactive">
              {assessmentTypes.map((item) => (
                <article
                  key={item.id}
                  className={`cv-assessment-start-card${
                    selectedAssessment?.id === item.id ? ' is-selected' : ''
                  }`}
                >
                  <div className="cv-assessment-icon-badge cv-assessment-icon-badge--large" aria-hidden="true">
                    <i className={`bi ${item.icon}`} />
                  </div>

                  <div className="cv-assessment-start-card__body">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="cv-assessment-start-card__meta">
                    <span>{item.duration}</span>
                    <span>{item.questionCount} pertanyaan</span>
                    <span>{item.difficulty}</span>
                  </div>

                  <button
                    type="button"
                    className="cv-assessment-outline-button"
                    onClick={() => handleStartAssessment(item)}
                  >
                    Mulai Asesmen
                  </button>
                </article>
              ))}
            </div>
          ) : null}
        </article>

        <article className="cv-assessment-panel cv-assessment-panel--flow">
          <div className="cv-assessment-panel__head">
            <div>
              <h2>
                {selectedAssessment ? selectedAssessment.title : 'Flow Pertanyaan & Hasil'}
              </h2>
              <p>
                {selectedAssessment
                  ? `Jawab seluruh pertanyaan untuk melihat skor dan rekomendasi.`
                  : 'Pilih salah satu jenis asesmen di sebelah kiri untuk memulai.'}
              </p>
            </div>
          </div>

          {!selectedAssessment && !result ? (
            <div className="cv-assessment-empty-state cv-assessment-empty-state--tall">
              <i className="bi bi-clipboard2-pulse" aria-hidden="true" />
              <h3>Belum ada asesmen yang aktif</h3>
              <p>
                Setelah memilih asesmen, pertanyaan akan tampil bertahap di panel ini
                lengkap dengan progress dan hasil akhirnya.
              </p>
            </div>
          ) : null}

          {selectedAssessment && !result ? (
            <div className="cv-assessment-flow">
              <div className="cv-assessment-flow__progress">
                <div className="cv-assessment-flow__progress-head">
                  <span>
                    Pertanyaan {currentIndex + 1} dari {questions.length}
                  </span>
                  <strong>{progressPercentage}%</strong>
                </div>
                <div className="cv-assessment-progress cv-assessment-progress--large">
                  <span
                    className="cv-assessment-progress__fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {isQuestionLoading ? (
                <div className="cv-assessment-empty-state">
                  <i className="bi bi-arrow-repeat" aria-hidden="true" />
                  <h3>Menyiapkan pertanyaan...</h3>
                  <p>Pertanyaan asesmen sedang dimuat untuk mode demo.</p>
                </div>
              ) : null}

              {!isQuestionLoading && currentQuestion ? (
                <>
                  <div className="cv-assessment-question-card">
                    <span className="cv-assessment-question-card__category">
                      {currentQuestion.category}
                    </span>
                    <h3>{currentQuestion.question}</h3>
                  </div>

                  <div className="cv-assessment-answer-list">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`cv-assessment-answer-option${
                          selectedAnswerId === option.id ? ' is-selected' : ''
                        }`}
                        onClick={() => handleChooseAnswer(option.id)}
                      >
                        <span>{option.label}</span>
                        <strong>{option.score} pts</strong>
                      </button>
                    ))}
                  </div>

                  {validationError ? (
                    <div className="cv-assessment-error" role="alert">
                      {validationError}
                    </div>
                  ) : null}

                  <div className="cv-assessment-flow__actions">
                    <button
                      type="button"
                      className="cv-assessment-outline-button cv-assessment-outline-button--ghost"
                      onClick={handlePreviousQuestion}
                      disabled={currentIndex === 0}
                    >
                      Sebelumnya
                    </button>
                    <button
                      type="button"
                      className="cv-assessment-outline-button"
                      onClick={handleNextQuestion}
                    >
                      {currentIndex === questions.length - 1 ? 'Lihat Hasil' : 'Lanjut'}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {result ? (
            <div className={`cv-assessment-result is-${result.riskLevel.tone}`}>
              <div className="cv-assessment-result__hero">
                <span className="cv-assessment-result__eyebrow">Hasil Asesmen</span>
                <h3>{result.assessmentTitle}</h3>
                <div className="cv-assessment-result__score">
                  <strong>{result.percentageScore}</strong>
                  <span>/ 100</span>
                </div>
                <div className="cv-assessment-result__risk">
                  <span className={`cv-assessment-risk-chip is-${result.riskLevel.tone}`}>
                    {result.riskLevel.label}
                  </span>
                  <p>{result.summary}</p>
                </div>
              </div>

              <div className="cv-assessment-result__grid">
                <section className="cv-assessment-result__section">
                  <h4>Area Kuat</h4>
                  <ul>
                    {result.strongAreas.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>

                <section className="cv-assessment-result__section">
                  <h4>Area Perlu Diperbaiki</h4>
                  <ul>
                    {result.improvementAreas.map((item) => (
                      <li key={`${item.category}-${item.recommendation}`}>{item.category}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <section className="cv-assessment-result__section">
                <h4>Rekomendasi</h4>
                <ul>
                  {result.recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <div className="cv-assessment-result__actions">
                <button
                  type="button"
                  className="cv-assessment-outline-button"
                  onClick={handleResetAssessment}
                >
                  Ulangi Asesmen
                </button>
                <button
                  type="button"
                  className="cv-assessment-outline-button cv-assessment-outline-button--ghost"
                  onClick={() => navigate('/pusat-edukasi')}
                >
                  Pelajari Materi Terkait
                </button>
                <button
                  type="button"
                  className="cv-assessment-outline-button cv-assessment-outline-button--ghost"
                  onClick={() => navigate('/sertifikat-penilaian')}
                >
                  Lihat Sertifikat/Penilaian
                </button>
              </div>
            </div>
          ) : null}
        </article>
      </section>
    </div>
  )
}

export default Asesmen
