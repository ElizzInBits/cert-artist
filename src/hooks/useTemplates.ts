import { useState, useEffect } from 'react'
import { CertificateConfig } from '@/types/certificate'

interface CertificateTemplate {
  id: string
  name: string
  courseData: any
  fontConfig: any
  instructors: any
  responsibles: any
  conformidade: string
  conteudo: string
  observacoes?: string
  useObservacoes: boolean
  createdAt: Date
  updatedAt: Date
}

export const useTemplates = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/templates')
      if (!response.ok) {
        console.warn('API not available, using local storage fallback')
        const localTemplates = JSON.parse(localStorage.getItem('certificate-templates') || '[]')
        setTemplates(localTemplates)
        return
      }
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Erro ao buscar templates:', error)
      // Fallback to localStorage
      const localTemplates = JSON.parse(localStorage.getItem('certificate-templates') || '[]')
      setTemplates(localTemplates)
    } finally {
      setLoading(false)
    }
  }

  const saveTemplate = async (name: string, config: CertificateConfig) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          courseData: config.courseData,
          fontConfig: config.fontConfig,
          instructors: config.instructors,
          responsibles: config.responsibles,
          conformidade: config.conformidade,
          conteudo: config.conteudo,
          observacoes: config.observacoes,
          useObservacoes: config.useObservacoes
        })
      })
      
      if (!response.ok) {
        throw new Error('API not available')
      }
      
      const template = await response.json()
      setTemplates(prev => [template, ...prev])
      return template
    } catch (error) {
      console.warn('API not available, saving to localStorage:', error)
      // Fallback to localStorage
      const template = {
        id: Date.now().toString(),
        name,
        courseData: config.courseData,
        fontConfig: config.fontConfig,
        instructors: config.instructors,
        responsibles: config.responsibles,
        conformidade: config.conformidade,
        conteudo: config.conteudo,
        observacoes: config.observacoes,
        useObservacoes: config.useObservacoes,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const localTemplates = JSON.parse(localStorage.getItem('certificate-templates') || '[]')
      localTemplates.unshift(template)
      localStorage.setItem('certificate-templates', JSON.stringify(localTemplates))
      setTemplates(prev => [template, ...prev])
      return template
    }
  }

  const loadTemplate = async (id: string): Promise<CertificateConfig> => {
    try {
      const response = await fetch(`/api/templates/${id}`)
      const template = await response.json()
      return {
        courseData: template.courseData,
        fontConfig: template.fontConfig,
        instructors: template.instructors,
        responsibles: template.responsibles,
        conformidade: template.conformidade,
        conteudo: template.conteudo,
        observacoes: template.observacoes,
        useObservacoes: template.useObservacoes
      }
    } catch (error) {
      console.error('Erro ao carregar template:', error)
      throw error
    }
  }

  const deleteTemplate = async (id: string) => {
    try {
      await fetch(`/api/templates/${id}`, { method: 'DELETE' })
      setTemplates(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Erro ao deletar template:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  return {
    templates,
    loading,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  }
}