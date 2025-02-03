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
        fill: var(--apollonian-gasket-color, white);
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
      this.createCircle(x, y, 100)
    }
  }

  createCircle(x, y, r = 0) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', x)
    circle.setAttribute('cy', y)
    circle.setAttribute('r', r)
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
