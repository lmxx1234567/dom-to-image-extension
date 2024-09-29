let selectedElement = null;

// Add event listener for 'Select Element' button
document.getElementById('selectElement').addEventListener('click', () => {
  chrome.scripting.executeScript({
    target: { tabId: chrome.tabs.TAB_ID_NONE },
    func: startSelectingElement,
  }, () => {
    document.getElementById('renderImage').disabled = false;
    document.getElementById('renderPDF').disabled = false;
  });
});

// Add event listener for 'Render as Image' button
document.getElementById('renderImage').addEventListener('click', () => {
  chrome.scripting.executeScript({
    target: { tabId: chrome.tabs.TAB_ID_NONE },
    func: renderImage,
    args: [selectedElement]
  });
});

// Add event listener for 'Render as PDF' button
document.getElementById('renderPDF').addEventListener('click', () => {
  chrome.scripting.executeScript({
    target: { tabId: chrome.tabs.TAB_ID_NONE },
    func: renderPDF,
    args: [selectedElement]
  });
});

// Injected function to start selecting an element
function startSelectingElement() {
  document.body.style.cursor = 'crosshair';

  document.addEventListener('click', function onClick(event) {
    event.preventDefault();
    event.stopPropagation();

    const element = event.target;
    element.style.outline = '2px solid red';  // Highlight selected element
    selectedElement = element.outerHTML;      // Store selected element's HTML

    document.body.style.cursor = 'default';  // Reset cursor
    document.removeEventListener('click', onClick);  // Remove the click event listener
  });
}

// Injected function to render the selected element as an image
function renderImage(selectedElementHtml) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = selectedElementHtml;
  const selectedElement = tempDiv.firstChild;

  html2canvas(selectedElement).then(canvas => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL("image/png");
    link.download = 'dom_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// Injected function to render the selected element as a PDF
function renderPDF(selectedElementHtml) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = selectedElementHtml;
  const selectedElement = tempDiv.firstChild;

  html2canvas(selectedElement).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10);
    pdf.save("dom_element.pdf");
  });
}