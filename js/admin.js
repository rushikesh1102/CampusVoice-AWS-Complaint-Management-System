const API_URL = "https://87frpah2gl.execute-api.ap-south-1.amazonaws.com/prod/complaints";

let allComplaints = [];

// Load all complaints
async function loadComplaints() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        allComplaints = await response.json();

        updateDashboard(allComplaints);

        displayComplaints(allComplaints);

    }

    catch (error) {

        console.error("Error loading complaints:", error);

    }

}



// Display complaints in table
function displayComplaints(complaints) {

    const table = document.getElementById("complaintsTable");

    table.innerHTML = "";

    complaints.forEach((complaint) => {

        const row = `

        <tr>

            <td>${complaint.ComplaintID}</td>

            <td>${complaint.Name}</td>

            <td>${complaint.Category}</td>

            <td>${complaint.CreatedDate}</td>

            <td>

                <select id="status-${complaint.ComplaintID}">

                    <option value="Pending"
                    ${complaint.Status==="Pending"?"selected":""}>
                    Pending
                    </option>

                    <option value="In Progress"
                    ${complaint.Status==="In Progress"?"selected":""}>
                    In Progress
                    </option>

                    <option value="Resolved"
                    ${complaint.Status==="Resolved"?"selected":""}>
                    Resolved
                    </option>

                </select>

            </td>

            <td>

                <button onclick="updateStatus('${complaint.ComplaintID}')">
                    Update
                </button>

                <button onclick="viewComplaint('${complaint.ComplaintID}')">
                    View
                </button>

            </td>

        </tr>

        `;

        table.innerHTML += row;

    });

}



// Dashboard cards
function updateDashboard(complaints) {

    document.getElementById("totalCount").textContent =
    complaints.length;

    document.getElementById("pendingCount").textContent =
    complaints.filter(c=>c.Status==="Pending").length;

    document.getElementById("progressCount").textContent =
    complaints.filter(c=>c.Status==="In Progress").length;

    document.getElementById("resolvedCount").textContent =
    complaints.filter(c=>c.Status==="Resolved").length;

}

// Update complaint status
async function updateStatus(id) {

    const status = document.getElementById(`status-${id}`).value;

    try {

        const response = await fetch(API_URL, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                ComplaintID: id,
                Status: status
            })

        });

        if (!response.ok) {
            throw new Error("Failed to update complaint");
        }

        const result = await response.json();

        alert(result.message);

        await loadComplaints();

    }

    catch (error) {

        console.error(error);

        alert("Failed to update complaint.");

    }

}



// Search complaints
function searchComplaints() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();

    const status =
        document.getElementById("statusFilter").value;

    let filtered = allComplaints;


    if(keyword !== ""){

        filtered = filtered.filter(c =>

            String(c.ComplaintID || "")
            .toLowerCase()
            .includes(keyword)

            ||

            String(c.Name || "")
            .toLowerCase()
            .includes(keyword)

        );

    }


    if(status !== "All"){

        filtered = filtered.filter(
            c => c.Status === status
        );

    }


    displayComplaints(filtered);

}



// Status Filter
function filterStatus(){

    searchComplaints();

}



// View Complaint
function viewComplaint(id){

    const complaint =
    allComplaints.find(
        c => c.ComplaintID === id
    );


    if(!complaint){

        alert("Complaint not found");

        return;

    }


    document.getElementById("modalBody").innerHTML = `

        <p><strong>Complaint ID:</strong> ${complaint.ComplaintID}</p>

        <p><strong>Name:</strong> ${complaint.Name}</p>

        <p><strong>Email:</strong> ${complaint.Email || "N/A"}</p>

        <p><strong>Category:</strong> ${complaint.Category}</p>

        <p><strong>Description:</strong><br><br>${complaint.Description}</p>

        <p><strong>Status:</strong> ${complaint.Status}</p>

        <p><strong>Date:</strong> ${complaint.CreatedDate}</p>

    `;


    document.getElementById("complaintModal").style.display="block";

}



// Close Modal
document.addEventListener("DOMContentLoaded",()=>{

    const modal =
    document.getElementById("complaintModal");

    const close =
    document.querySelector(".close");


    close.onclick=function(){

        modal.style.display="none";

    };


    window.onclick=function(event){

        if(event.target===modal){

            modal.style.display="none";

        }

    };

});



// Load dashboard
loadComplaints();