'use client'

import dynamic from 'next/dynamic'

const MouseReactiveWebGLBackground = dynamic(
  () =>
    import('./MouseReactiveWebGLBackground').then(
      (module) => module.MouseReactiveWebGLBackground
    ),
  { ssr: false }
)

export default function BackgroundLayer() {
  return <MouseReactiveWebGLBackground />
}
