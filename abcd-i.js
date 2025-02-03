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
        display: block;
        margin: 0; padding: 0; border: 0;
        width: fit-content; height: fit-content;
      }
      svg {
        background-color: black;
      }
    </style>`
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.shadowRoot.appendChild(this.svg)
  }

  connectedCallback() {
    this.resize()
  }

  resize() {
    const { width, height } = this.parentElement.getBoundingClientRect()
    this.svg.setAttribute('width', width)
    this.svg.setAttribute('height', height)
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  }
}
