

let loads = [];
let chart = null;
const storageLimit = 1000; // 1 TB in GB

// Show section
function showSection(section) {
    document.getElementById("dataSection").style.display = "none";

    if (section === "data") {
        document.getElementById("dataSection").style.display = "block";
    }
}

// Add data
function addData() {
    let input = document.getElementById("dataInput").value;

    if (!input) {
        alert("Enter data!");
        return;
    }

    // Convert input to numbers safely
    loads = input.split(",").map(x => parseFloat(x.trim())).filter(x => !isNaN(x));

    if (loads.length === 0) {
        alert("Invalid data!");
        return;
    }

    alert("Data Added Successfully!");
}

// Predict + Update UI + Draw chart
function predict() {

    if (loads.length === 0) {
        alert("Please add data first!");
        return;
    }

    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ loads: loads })
    })
    .then(async res => {
        if (!res.ok) {
            const message = await res.text();
            throw new Error(message || "Server error");
        }
        return res.json();
    })
    .then(data => {

        let growth = Number(data);

        if (isNaN(growth) || growth === 0) {
            alert("Invalid prediction from backend");
            return;
        }

        let used = loads.reduce((a,b)=>a+b,0);
        let total = storageLimit;
        let remaining = total - used;

        document.getElementById("used").innerText = used + " GB";
        document.getElementById("remaining").innerText = remaining.toFixed(2) + " GB";
        document.getElementById("growth").innerText = growth.toFixed(2) + " GB/day";

        let days = remaining / growth;
        let future = new Date();
        future.setDate(future.getDate() + Math.round(days));

        document.getElementById("date").innerText = future.toDateString();

        // Progress bar
        let percent = Math.min((used / total) * 100, 100);
        document.getElementById("bar").style.width = percent + "%";

        drawChart(loads, growth);
    })
    .catch(err => {
        console.error(err);
        alert("Prediction failed. Start the Spring Boot app and open http://localhost:8080/");
    });
}

// Draw chart
function drawChart(loads, predicted) {

    const ctx = document.getElementById("chart").getContext("2d");

    // Destroy old chart
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: loads.map((_, i) => "Day " + (i + 1)),
            datasets: [
                {
                    label: "Usage",
                    data: loads,
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: "Prediction",
                    data: Array(loads.length).fill(predicted),
                    borderWidth: 2,
                    borderDash: [5,5]
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Days"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Usage (GB)"
                    },
                    beginAtZero: true
                }
            }
        }
    });
}
