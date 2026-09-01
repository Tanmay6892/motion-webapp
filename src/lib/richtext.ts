export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script, style, iframe, object, embed, form').forEach((el) =>
    el.remove(),
  )
  doc.querySelectorAll('*').forEach((el) => {
    ;[...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()
      if (name.startsWith('on')) el.removeAttribute(attr.name)
      if ((name === 'href' || name === 'src') && value.startsWith('javascript:')) {
        el.removeAttribute(attr.name)
      }
    })
  })
  return doc.body.innerHTML
}

export function escapeHtml(value: string): string {
  const div = document.createElement('div')
  div.textContent = value
  return div.innerHTML
}

export function isEditorEmpty(html: string): boolean {
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()
  return text.length === 0 && !html.includes('<img') && !html.includes('input')
}

export function buildChecklistItemHtml(label = 'List item'): string {
  return `<div class="motion-check-item" data-checked="false"><input type="checkbox" /><span>${escapeHtml(
    label,
  )}</span></div>`
}
