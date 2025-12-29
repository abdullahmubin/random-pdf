"use client"

import React, { useRef, useEffect } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
}

function wrapIfSection(node, key) {
  if (!React.isValidElement(node)) return node
  const { type, props } = node
  // if this is a native 'section' element, wrap it
  if (typeof type === 'string' && type.toLowerCase() === 'section') {
    function SectionMotion({ children, ...rest }) {
      const ref = useRef(null)
      const inView = useInView(ref, { amount: 0.15 })
      const controls = useAnimation()

      // install a single global scroll listener (on window) that marks that
      // the user has interacted by scrolling. We store the flag on window
      // to avoid adding many listeners for multiple sections.
      useEffect(() => {
        if (typeof window === 'undefined') return
        if (!window.__bottopdf_scroll_listener_installed) {
          window.__bottopdf_has_scrolled = false
          const onScroll = () => {
            window.__bottopdf_has_scrolled = true
            // once set, we can remove the listener
            window.removeEventListener('scroll', onScroll)
          }
          window.addEventListener('scroll', onScroll, { passive: true })
          window.__bottopdf_scroll_listener_installed = true
        }
      }, [])

      useEffect(() => {
        const userScrolled = typeof window !== 'undefined' && !!window.__bottopdf_has_scrolled
        if (inView && userScrolled) {
          controls.start('show')
        }
        // If not in view or user hasn't scrolled yet, keep hidden. We intentionally
        // do NOT flip back to hidden after showing, and we don't start show on load
        // unless the user has scrolled.
      }, [inView, controls])

      return (
        <motion.section ref={ref} key={key} initial="hidden" animate={controls} variants={item} {...rest}>
          {children}
        </motion.section>
      )
    }

    return (
      <SectionMotion key={key} {...props}>
        {React.Children.map(props.children, (c, i) => wrapIfSection(c, i))}
      </SectionMotion>
    )
  }

  // otherwise, clone element and recurse into children
  const children = props && props.children
  if (!children) return node

  const newChildren = React.Children.map(children, (child, i) => wrapIfSection(child, i))

  return React.cloneElement(node, { ...props, key }, newChildren)
}

export default function SectionAnimator({ children }) {
  // wrap top-level children as needed
  const wrapped = React.Children.map(children, (child, i) => wrapIfSection(child, i))
  return <>{wrapped}</>
}
