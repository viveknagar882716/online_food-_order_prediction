// static/script.js
function openTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
  document.querySelector(`.tab:nth-child(${tabName === 'predict' ? 1 : 2})`).classList.add('active');
}

document.getElementById('predictionForm').onsubmit = async function(e) {
  e.preventDefault();
  const resultEl = document.getElementById('result');
  resultEl.style.display = 'none';

  const formData = {
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    marital: document.getElementById('marital').value,
    occupation: document.getElementById('occupation').value,
    income: document.getElementById('income').value,
    education: document.getElementById('education').value,
    family: document.getElementById('family').value,
    pincode: document.getElementById('pincode').value,
    feedback: document.getElementById('feedback').value
  };

  try {
    const res = await fetch('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (data.success) {
      resultEl.className = 'result ' + (data.prediction === 'Yes' ? 'yes' : 'no');
      resultEl.innerHTML = `
        <i class="fas fa-robot"></i> 
        <strong>Prediction:</strong> ${data.prediction === 'Yes' ? '✅ Likely to Order Again' : '❌ Unlikely to Order'}
        <br><small>Confidence: ${data.confidence.toFixed(1)}%</small>
      `;
      resultEl.style.display = 'block';
    } else {
      alert("Error: " + data.error);
    }
  } catch (err) {
    alert("Connection failed. Is the server running?");
  }
};

// Plotly visualizations
window.onload = function() {
  plotAgeBehavior();
  plotGenderPie();
  plotMaritalPie();
};

function plotAgeBehavior() {
  const xYes = Array.from({length: 50}, () => 20 + Math.random() * 20);
  const xNo = Array.from({length: 30}, () => 22 + Math.random() * 25);
  Plotly.newPlot('agePlot', [
    {x: xYes, name: 'Will Order', type: 'histogram', opacity: 0.7},
    {x: xNo, name: 'Won’t Order', type: 'histogram', opacity: 0.7}
  ], {title: 'Order Behavior by Age'});
}

function plotGenderPie() {
  Plotly.newPlot('genderPlot', [{
    labels: ['Male', 'Female'], values: [78, 22], type: 'pie',
    marker: {colors: ['gold','lightgreen'], line: {width: 2, color: 'black'}}
  }], {title: 'Orders by Gender'});
}

function plotMaritalPie() {
  Plotly.newPlot('maritalPlot', [{
    labels: ['Married', 'Single'], values: [65, 35], type: 'pie',
    marker: {colors: ['gold','lightgreen'], line: {width: 2, color: 'black'}}
  }], {title: 'Married vs Single Customers'});
}