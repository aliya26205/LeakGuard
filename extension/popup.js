const app = document.getElementById("app");

const API = "http://localhost:5000/api";

chrome.storage.local.get(["employee"], ({ employee }) => {

    if (employee) {

        app.innerHTML = `

        <div class="card">

            <h2>🛡 LeakGuard</h2>

            <h3 class="success">✅ Device Registered</h3>

            <p><b>${employee.full_name}</b></p>

            <p>${employee.employee_id}</p>

            <p>${employee.department}</p>

            <p>${employee.email}</p>

            <hr>

            <small>
                This browser is securely linked to your company account.
            </small>

        </div>

        `;

        return;
    }

    app.innerHTML = `

    <div class="card">

        <h2>🛡 LeakGuard</h2>

        <h3>Register Device</h3>

        <input
            id="employeeId"
            placeholder="Employee ID"
        >

        <input
            id="activationKey"
            placeholder="Activation Key"
        >

        <button id="registerBtn">

            Register Device

        </button>

        <p id="status"></p>

    </div>

    `;

    document
        .getElementById("registerBtn")
        .onclick = registerDevice;

});

async function registerDevice() {

    const employee_id =
        document.getElementById("employeeId").value.trim();

    const activation_key =
        document.getElementById("activationKey").value.trim();

    const status =
        document.getElementById("status");

    status.innerHTML = "";

    if (!employee_id || !activation_key) {

        status.style.color = "red";

        status.innerHTML = "Please fill all fields.";

        return;

    }

    try {

        const response = await fetch(

            API + "/register",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    employee_id,

                    activation_key

                })

            }

        );

        const result = await response.json();

        if (!result.success) {

            status.style.color = "red";

            status.innerHTML = result.message;

            return;

        }

        chrome.storage.local.set({

            employee: result.employee

        });

        location.reload();

    }

    catch (err) {

        console.log(err);

        status.style.color = "red";

        status.innerHTML =

            "Backend not running.";

    }

}