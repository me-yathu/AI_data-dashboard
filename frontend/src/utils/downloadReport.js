import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const wait = (ms) => new Promise(r => setTimeout(r, ms))

const capture = async (id) => {
  const el = document.getElementById(id)
  if (!el) {
    console.log("Missing element:", id)
    return null
  }

  await wait(500) // allow render

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0a0a0f",
      allowTaint: true
    })

    return canvas.toDataURL("image/png")
  } catch (err) {
    console.log("Capture failed:", id, err)
    return null
  }
}

export const downloadPDF = async (data, chartsCount = 0) => {
  const doc = new jsPDF("p", "mm", "a4")

  const pageWidth = 210
  const pageHeight = 297
  let y = 10

  // ================= HEADER =================
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text("AI DATA REPORT", 10, y)
  y += 10

  doc.setFontSize(11)
  doc.text(`File: ${data.filename || "unknown"}`, 10, y)
  y += 10

  // ================= STATS =================
  const statsImg = await capture("stats-section")
  if (statsImg) {
    doc.addImage(statsImg, "PNG", 10, y, 190, 25)
    y += 30
  }

  // ================= INSIGHTS =================
  const insightsImg = await capture("insights-section")
  if (insightsImg) {
    doc.addImage(insightsImg, "PNG", 10, y, 190, 60)
    y += 65
  }

  // ================= TABLE =================
  const tableImg = await capture("table-section")
  if (tableImg) {
    doc.addImage(tableImg, "PNG", 10, y, 190, 70)
    y += 75
  }

  // ================= CHARTS =================
  for (let i = 0; i < chartsCount; i++) {
    const chartImg = await capture(`chart-${i}`)

    if (!chartImg) continue

    if (y > 220) {
      doc.addPage()
      y = 10
    }

    doc.addImage(chartImg, "PNG", 10, y, 190, 80)
    y += 85
  }

  doc.save("ai-data-report.pdf")
}