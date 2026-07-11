const API_URL = "https://87frpah2gl.execute-api.ap-south-1.amazonaws.com/prod/complaints";

document.getElementById("complaintForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const payload = {
        Name: document.getElementById("name").value,
        Email: document.getElementById("email").value,
        Department: document.getElementById("department").value,
        Category: document.getElementById("category").value,
        Description: document.getElementById("description").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        document.getElementById("complaintId").textContent = result.ComplaintID;
        document.getElementById("successBox").classList.remove("hidden");

        this.reset();

    } catch (error) {
        console.error(error);
        alert("Error submitting complaint.");
    }
});