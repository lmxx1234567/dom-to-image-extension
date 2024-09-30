let buttonDisabled = true;

// Function to load state from chrome.storage.local
function loadState() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('buttonDisabled', function (result) {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      if (result.buttonDisabled !== undefined) {
        buttonDisabled = result.buttonDisabled;
      }
      resolve();
    });
  });
}

// Event listener for DOMContentLoaded to load the state
document.addEventListener('DOMContentLoaded', function () {
  loadState().then(() => {
    document.getElementById('renderImage').disabled = buttonDisabled;
    document.getElementById('renderPDF').disabled = buttonDisabled;
  });
});

// Add event listener for 'Select Element' button
document.getElementById('selectElement').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'startSelectingElement' }, function (response) {
      console.log(response.status); // Handle the response, e.g., "selection_started"
    });
  });

  // Close the popup after initiating the selection
  window.close();
});

// Add event listener for 'Render as Image' button
document.getElementById('renderImage').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'renderImage' }, function (response) {
      console.log(response.status); // Handle the response, e.g., "rendering_started"
    });
  });
});

// Add event listener for 'Render as PDF' button
document.getElementById('renderPDF').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'renderPDF' }, function (response) {
      console.log(response.status); // Handle the response, e.g., "rendering_started"
    });
  });
});