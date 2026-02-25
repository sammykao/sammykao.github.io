'use client'

import { useEffect, useRef } from 'react'

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_mouse_vel;
uniform float u_time;
uniform float u_dark_mode;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p = mat2(1.6, -1.2, 1.2, 1.6) * p;
    amp *= 0.5;
  }
  return value;
}

float lineSegment(vec2 p, vec2 a, vec2 b, float w) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return smoothstep(w, 0.0, length(pa - ba * h));
}

float asciiGlyph(vec2 cell, float level) {
  float g = 0.0;
  if (level < 0.2) {
    g += smoothstep(0.11, 0.0, length(cell));
  } else if (level < 0.4) {
    g += lineSegment(cell, vec2(-0.25, 0.0), vec2(0.25, 0.0), 0.055);
    g += lineSegment(cell, vec2(0.0, -0.25), vec2(0.0, 0.25), 0.055);
  } else if (level < 0.6) {
    g += lineSegment(cell, vec2(-0.28, -0.28), vec2(0.28, 0.28), 0.05);
    g += lineSegment(cell, vec2(-0.28, 0.28), vec2(0.28, -0.28), 0.05);
  } else if (level < 0.8) {
    g += lineSegment(cell, vec2(-0.28, -0.18), vec2(0.28, -0.18), 0.05);
    g += lineSegment(cell, vec2(-0.28, 0.18), vec2(0.28, 0.18), 0.05);
    g += lineSegment(cell, vec2(-0.18, -0.28), vec2(-0.18, 0.28), 0.05);
    g += lineSegment(cell, vec2(0.18, -0.28), vec2(0.18, 0.28), 0.05);
  } else {
    g += lineSegment(cell, vec2(-0.3, -0.3), vec2(0.3, 0.3), 0.045);
    g += lineSegment(cell, vec2(-0.3, 0.3), vec2(0.3, -0.3), 0.045);
    g += lineSegment(cell, vec2(-0.3, 0.0), vec2(0.3, 0.0), 0.045);
    g += lineSegment(cell, vec2(0.0, -0.3), vec2(0.0, 0.3), 0.045);
  }
  return clamp(g, 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 centered = uv * 2.0 - 1.0;
  centered.x *= u_resolution.x / u_resolution.y;

  vec2 mouse = u_mouse;
  vec2 mouseCentered = mouse * 2.0 - 1.0;
  mouseCentered.x *= u_resolution.x / u_resolution.y;

  float speed = length(u_mouse_vel);
  float flowTime = u_time * (0.25 + min(speed * 2.2, 1.0));
  float wiggleTime = u_time * 0.09;

  float distFromMouse = length(centered - mouseCentered);
  float ripple = sin(22.0 * distFromMouse - u_time * 6.0) * exp(-2.2 * distFromMouse);

  vec2 flow = centered * 2.8;
  flow += vec2(
    fbm(flow + vec2(0.0, flowTime * 0.8)),
    fbm(flow + vec2(3.2, -flowTime * 0.8))
  ) * (0.35 + min(speed * 2.0, 0.45));
  flow += normalize(centered - mouseCentered + 0.0001) * ripple * 0.08;

  float grains = fbm(flow * 1.35 + vec2(flowTime * 0.45, -flowTime * 0.35));
  float ribbons = sin((flow.x + grains * 0.9) * 6.5 - wiggleTime) * 0.5 + 0.5;

  vec2 mouseVec = centered - mouseCentered;
  float mouseDist = length(mouseVec);
  float mouseGlow = exp(-5.2 * mouseDist);
  float mouseRing = smoothstep(0.34, 0.0, abs(mouseDist - (0.12 + speed * 0.15)));

  float pattern = grains * 0.45 + ribbons * 0.55;
  pattern += ripple * 0.28;
  pattern += mouseGlow * (0.4 + min(speed * 0.9, 0.5));
  pattern += mouseRing * 0.35;
  float vignette = smoothstep(1.45, 0.25, length(centered));
  pattern *= vignette;

  float grid = mix(40.0, 68.0, min(speed * 5.0, 1.0));
  vec2 asciiUv = centered * vec2(1.0, 1.0) + flow * 0.08;
  vec2 cellUv = asciiUv * grid;
  vec2 local = fract(cellUv) - 0.5;
  vec2 cellId = floor(cellUv);

  float cellNoise = hash(cellId * 0.71 + vec2(flowTime * 0.25, -flowTime * 0.18));
  float glyphLevel = clamp(pattern * 0.8 + cellNoise * 0.45, 0.0, 1.0);
  float glyph = asciiGlyph(local, glyphLevel);
  float glyphMask = smoothstep(0.06, 0.95, glyph);

  vec3 lightBase = vec3(0.965, 0.965, 0.965);
  vec3 lightAccent = vec3(0.56, 0.56, 0.56);
  vec3 darkBase = vec3(0.035, 0.035, 0.035);
  vec3 darkAccent = vec3(0.42, 0.42, 0.42);

  vec3 base = mix(lightBase, darkBase, u_dark_mode);
  vec3 accent = mix(lightAccent, darkAccent, u_dark_mode);
  vec3 waveColor = mix(base, accent, clamp(pattern, 0.0, 1.0));
  vec3 asciiColor = mix(accent, base, u_dark_mode);
  vec3 color = mix(waveColor, asciiColor, glyphMask * 0.72);

  gl_FragColor = vec4(color, 1.0);
}
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  if (!vertexShader || !fragmentShader) return null

  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  return program
}

export function MouseReactiveWebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    })
    if (!gl) return

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)
    if (!program) return

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse')
    const mouseVelLocation = gl.getUniformLocation(program, 'u_mouse_vel')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const darkModeLocation = gl.getUniformLocation(program, 'u_dark_mode')

    const buffer = gl.createBuffer()
    if (!buffer) return

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1,
      ]),
      gl.STATIC_DRAW
    )

    const darkModeMedia = window.matchMedia('(prefers-color-scheme: dark)')
    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    let isDarkMode = darkModeMedia.matches
    let reducedMotion = reducedMotionMedia.matches
    let frame = 0

    let mouseX = window.innerWidth * 0.5
    let mouseY = window.innerHeight * 0.5
    let targetX = mouseX
    let targetY = mouseY
    let velX = 0
    let velY = 0

    const draw = (timeMs: number) => {
      const width = window.innerWidth
      const height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nextWidth = Math.floor(width * dpr)
      const nextHeight = Math.floor(height * dpr)

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        gl.viewport(0, 0, nextWidth, nextHeight)
      }

      // Spring-damped pointer simulation for smoother, physics-like response.
      const stiffness = 0.11
      const damping = 0.82
      velX = (velX + (targetX - mouseX) * stiffness) * damping
      velY = (velY + (targetY - mouseY) * stiffness) * damping
      mouseX += velX
      mouseY += velY

      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

      if (resolutionLocation) gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      if (mouseLocation) gl.uniform2f(mouseLocation, mouseX / width, 1 - mouseY / height)
      if (mouseVelLocation) gl.uniform2f(mouseVelLocation, velX / width, -velY / height)
      if (timeLocation) gl.uniform1f(timeLocation, reducedMotion ? 0 : timeMs * 0.001)
      if (darkModeLocation) gl.uniform1f(darkModeLocation, isDarkMode ? 1 : 0)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    const loop = (timeMs: number) => {
      draw(timeMs)
      frame = window.requestAnimationFrame(loop)
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      if (reducedMotion) draw(performance.now())
    }

    const onResize = () => draw(performance.now())
    const onThemeChange = (event: MediaQueryListEvent) => {
      isDarkMode = event.matches
      draw(performance.now())
    }
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      if (reducedMotion) {
        if (frame) window.cancelAnimationFrame(frame)
        frame = 0
        draw(performance.now())
      } else if (!frame) {
        frame = window.requestAnimationFrame(loop)
      }
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('resize', onResize)
    darkModeMedia.addEventListener('change', onThemeChange)
    reducedMotionMedia.addEventListener('change', onMotionChange)

    draw(0)
    if (!reducedMotion) {
      frame = window.requestAnimationFrame(loop)
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('resize', onResize)
      darkModeMedia.removeEventListener('change', onThemeChange)
      reducedMotionMedia.removeEventListener('change', onMotionChange)
      if (frame) window.cancelAnimationFrame(frame)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}
