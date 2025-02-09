/** @license MIT */

/** Implement an Apollonian Gasket animation via a WebComponent.
 *
 * @author Gianluca Casati
 *
 * The file is named abcd-i.js because the formula I found during my Degree Thesis to solve the Apollonian problem is:
 *
 *     (ABCD) = -i
 *
 * where A, B, C, D are four complex numbers;
 * A B and C are the vertices of a curved triangle;
 * the (ABCD) is their cross-ratio.
 *
 * If the cross-ratio equals to -i then D is a tangent point of a circle that solves the Apollonian problem.
 */
export class ApollonianGasket extends HTMLElement {
  static localName = 'apollonian-gasket'
  static defineHTMLElement() {
    if (customElements.get(ApollonianGasket.localName)) return
    customElements.define(ApollonianGasket.localName, ApollonianGasket)
  }

  static distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
  }

  animationStatus = 'paused'
  circlesSet = new Set()
  /** Frame-rate per second. */
  FPS = 20
  svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = document.createElement('template')
    template.innerHTML = `<style>
      :host {
        position: absolute;
        top: 0; left: 0;
        display: block;
        margin: 0; padding: 0; border: 0;
        width: 100%; height: 100%;
      }
      svg {
        background-color: var(--apollonian-gasket-background-color, black);
      }
      circle {
        fill: transparent;
        stroke: var(--apollonian-gasket-color, white);
        stroke-width: 1px;
        transition: all 450ms;
      }
      circle:hover {
        fill: var(--apollonian-gasket-color, white);
        opacity
      }
    </style>`
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.shadowRoot.appendChild(this.svg)
    // Resize according to parent element.
    this.parentObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (!entry.contentBoxSize) continue
        const { blockSize: height, inlineSize: width } = entry.contentBoxSize[0]
        this.svg.setAttribute('width', width)
        this.svg.setAttribute('height', height)
        this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        const { left, top } = this.getBoundingClientRect()
        this.left = left
        this.top = top
      }
    })
  }

  connectedCallback() {
    this.parentObserver.observe(this.parentElement)

    this.svg.addEventListener('click', this)
  }

  disconnectedCallback() {
    this.parentObserver.unobserve(this.parentElement)
  }

  handleEvent(event) {
    if (event.type == 'click') {
      const { x, y } = this.pointerCoordinates(event)
      // Check if click is inside some circle.
      let isInsideSomeCircle = false
      for (const circle of this.circlesSet) {
        const r = circle.getR()
        const cx = circle.getX()
        const cy = circle.getY()
        if (ApollonianGasket.distance(x, y, cx, cy) <= r) {
          isInsideSomeCircle = true
          break
        }
      }
      if (isInsideSomeCircle) {
        // Do nothing if click is inside some circle.
      } else {
        const circle = this.createCircle(x, y, 0)
        this.circlesSet.add(circle)
        this.startAnimation()
      }
    }
  }

  createCircle(x, y, r) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    const circle = Object.assign(element, {
      getX() { return Number(element.getAttribute('cx')) },
      getY() { return Number(element.getAttribute('cy')) },
      getR() { return Number(element.getAttribute('r')) },
      setX(value) { element.setAttribute('cx', value) },
      setY(value) { element.setAttribute('cy', value) },
      setR(value) { element.setAttribute('r', value) },
    })
    circle.setX(x)
    circle.setY(y)
    circle.setR(r)
    this.svg.appendChild(circle)
    return circle
  }

  /** Calculates the coordinates of a pointer event, relative to host DOM element. */
  pointerCoordinates({ clientX, clientY }) {
    return {
      x: Math.round(clientX - this.left),
      y: Math.round(clientY - this.top)
    }
  }

  startAnimation() {
    if (this.animationStatus == 'running') return
    this.animationStatus = 'running'

    const deltaR = 1

    function* animate(self) {
      const tangentCirclesSet = new Set()
      while (true) {
        for (const circle of self.circlesSet) {
          const r1 = circle.getR()
          const x1 = circle.getX()
          const y1 = circle.getY()
          // Loop over all other circles.
          for (const otherCircle of self.circlesSet) {
            if (circle === otherCircle) continue
            const r2 = otherCircle.getR()
            const x2 = otherCircle.getX()
            const y2 = otherCircle.getY()
            // Check if some circle is tangent.
            if (ApollonianGasket.distance(x1, y1, x2, y2) <= r1 + r2 + deltaR) {
              tangentCirclesSet.add(circle)
              tangentCirclesSet.add(otherCircle)
            }
          }
          // Expand circle if it is not tangent.
          if (!tangentCirclesSet.has(circle)) {
            circle.setR(r1 + deltaR)
          }
        }
        // If all circles are tangent, end animation.
        if (self.circlesSet.size == tangentCirclesSet.size) {
          return
        }
        yield
      }
    }

    const animation = animate(this)
    const deltaT = Math.floor(1000 / this.FPS)
    let lastFrameTime = document.timeline.currentTime - deltaT

    const loop = () => {
      if (document.timeline.currentTime > lastFrameTime + deltaT) {
        const { done } = animation.next()
        if (done) {
          this.animationStatus = 'paused'
          return
        }
        lastFrameTime = document.timeline.currentTime
      }
      requestAnimationFrame(loop)
    }

    loop()
  }
}

///////////\
// Anatema  \_______________
//                          \.
// Sulle rive di uno stagno  |_.
// passò un satiro e la vide,  |
// Reginella sempre bella      |
// è la Musica di Euclide.     |.
//                               \
// È all'Identità, il riflesso    |
// ciò a cui diede movimento.     |
// Ben tre sassi egli lanciò     /
// distribuendoli nel vento.     |
//                                \.
// Poi nell'onda nacque un fiore,  |
// tre fu il fischio della voce. _/
/////////////////////////////////
