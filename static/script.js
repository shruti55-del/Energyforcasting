async function loadModelInfo() {
    try {
        const response = await fetch("/api/model-info");

        if (!response.ok) {
            throw new Error("API response failed");
        }

        const data = await response.json();

        // Model name
        document.getElementById("modelName").textContent = data.model;

        // System status
        document.getElementById("status").textContent = "Model Loaded";

        // Model information
        document.getElementById("modelInfo").textContent = data.model;

        // Features
        const featureList = document.getElementById("featureList");

        featureList.innerHTML = "";

        data.features.forEach(function(feature) {
            const li = document.createElement("li");
            li.textContent = feature;
            featureList.appendChild(li);
        });

    } catch (error) {

        console.error(error);

        document.getElementById("modelName").textContent = "Error";
        document.getElementById("status").textContent = "Model Not Loaded";
        document.getElementById("modelInfo").textContent = "Unable to load model information";
    }
}


// Run when page loads
loadModelInfo();

async function predictEnergy() {

    const data = {
        Hour: Number(document.getElementById("Hour").value),
        Day: Number(document.getElementById("Day").value),
        Month: Number(document.getElementById("Month").value),
        Day_of_Week: Number(document.getElementById("Day_of_Week").value),
        Is_Weekend: Number(document.getElementById("Is_Weekend").value),

        Lag_1: Number(document.getElementById("Lag_1").value),
        Lag_24: Number(document.getElementById("Lag_24").value),
        Lag_168: Number(document.getElementById("Lag_168").value),

        Rolling_3: Number(document.getElementById("Rolling_3").value),
        Rolling_24: Number(document.getElementById("Rolling_24").value),
        Rolling_168: Number(document.getElementById("Rolling_168").value)
    };

    try {

        const response = await fetch("/api/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {

            document.getElementById("predictionValue").textContent =
                result.prediction.toFixed(3) + " kW";

        } else {

            document.getElementById("predictionValue").textContent =
                "Error: " + result.error;
        }

    } catch (error) {

        document.getElementById("predictionValue").textContent =
            "Prediction failed: " + error.message;
    }
}
function fillSampleValues() {

    document.getElementById("Hour").value = 18;
    document.getElementById("Day").value = 15;
    document.getElementById("Month").value = 9;
    document.getElementById("Day_of_Week").value = 1;
    document.getElementById("Is_Weekend").value = 0;

    document.getElementById("Lag_1").value = 3.2;
    document.getElementById("Lag_24").value = 3.0;
    document.getElementById("Lag_168").value = 2.8;

    document.getElementById("Rolling_3").value = 3.1;
    document.getElementById("Rolling_24").value = 3.0;
    document.getElementById("Rolling_168").value = 2.9;
}
document.getElementById("predictionDateTime").addEventListener("change", function () {

    const selectedDate = new Date(this.value);

    if (isNaN(selectedDate.getTime())) {
        return;
    }

    document.getElementById("Hour").value = selectedDate.getHours();
    document.getElementById("Day").value = selectedDate.getDate();
    document.getElementById("Month").value = selectedDate.getMonth() + 1;
    document.getElementById("Day_of_Week").value = selectedDate.getDay() === 0
        ? 6
        : selectedDate.getDay() - 1;

    const dayOfWeek = selectedDate.getDay();

    document.getElementById("Is_Weekend").value =
        (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : 0;
});