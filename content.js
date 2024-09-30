// This script runs in the context of the current webpage and persists
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// addEventListener only once
let isListenerAdded = false;

// Start element selection mode
function startSelectingElement() {
    document.body.style.cursor = 'crosshair';

    function onMouseOver(event) {
        event.target.style.outline = '2px solid blue';  // Highlight element on hover
    }

    function onMouseOut(event) {
        event.target.style.outline = '';  // Remove highlight when not hovering
    }

    function onClick(event) {
        event.preventDefault();
        event.stopPropagation();

        const element = event.target;
        element.style.outline = '2px solid red';  // Highlight selected element
        let elementId = element.id;  // Store selected element's id

        if (!elementId) {
            // If the element doesn't have an id, assign a unique id
            elementId = 'selected-element-' + Date.now();
            element.id = elementId;
        }

        document.body.style.cursor = 'default';  // Reset cursor
        document.removeEventListener('mouseover', onMouseOver);
        document.removeEventListener('mouseout', onMouseOut);
        document.removeEventListener('click', onClick);  // Remove the click event listener

        isListenerAdded = false; // Reset the flag

        chrome.storage.local.set({
            selectedElementId: elementId,
            buttonDisabled: false
        });  // Persist the selected element

        console.log('Element selected:', selectedElement);
        alert("Element selected! You can now render it as an image or PDF.");
    }

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('click', onClick);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startSelectingElement') {
        if (isListenerAdded) {
            sendResponse({ status: 'selection_already_started' });
            return;
        }
        startSelectingElement();
        sendResponse({ status: 'selection_started' });
    }
});

// Injected function to render the selected element as an image
function renderImage(selectedElementId) {
    const selectedElement = document.getElementById(selectedElementId);

    getCanvas(selectedElement).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL("image/png");
        link.download = 'dom_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// Listen for messages renderImage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'renderImage') {
        chrome.storage.local.get('selectedElementId', function (data) {
            renderImage(data.selectedElementId);
        });
        sendResponse({ status: 'rendering_started' });
    }
});

// Injected function to render the selected element as a PDF
function renderPDF(selectedElementId) {
    const selectedElement = document.getElementById(selectedElementId);

    getCanvas(selectedElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save("dom_element.pdf");
    });
}

// Get canvas from selected element
function getCanvas(selectedElement) {
    return html2canvas(selectedElement,{
        useCORS: true,
        allowTaint: true,
    });
}

// Listen for messages renderPDF
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'renderPDF') {
        chrome.storage.local.get('selectedElementId', function (data) {
            renderPDF(data.selectedElementId);
        });
        sendResponse({ status: 'rendering_started' });
    }
});

// Reset storage after page refresh
chrome.storage.local.clear();
console.log('Content script loaded');