import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportPDF(element, filename = 'curriculo.pdf') {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  })

  const imgWidth = 210
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageHeight = 297
  let position = 0

  const imgData = canvas.toDataURL('image/png')

  if (imgHeight <= pageHeight) {
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  } else {
    let remainingHeight = imgHeight
    while (remainingHeight > 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      remainingHeight -= pageHeight
      position -= pageHeight
      if (remainingHeight > 0) {
        pdf.addPage()
      }
    }
  }

  pdf.save(filename)
}
