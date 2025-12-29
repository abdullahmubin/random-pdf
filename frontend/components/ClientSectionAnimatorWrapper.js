"use client"

import SectionAnimator from './SectionAnimator'

export default function ClientSectionAnimatorWrapper({ children }) {
  return (
    <SectionAnimator>
      {children}
    </SectionAnimator>
  )
}
