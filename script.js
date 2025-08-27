const API_BASE = "http://localhost:8080";

let currentUser = null;

const el = (id) => document.getElementById(id);

async function postJson(path, body) {
    const res = await fetch(`${API_BASE}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function get(path) {
    const res = await fetch(`${API_BASE}/${path}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

el("registerBtn").addEventListener("click", async () => {
    try {
        const data = await postJson("register", {
            username: el("reg-username").value.trim(),
            email: el("reg-email").value.trim(),
            password: el("reg-password").value
        });
        currentUser = data;
        el("login-status").textContent = `Registered as ${data.username}`;
        el("buyBtn").disabled = false;
        el("refreshTicketsBtn").disabled = false;
    } catch (e) {
        alert(e.message || "Registration failed");
    }
});

el("loginBtn").addEventListener("click", async () => {
    try {
        const data = await postJson("login", {
            usernameOrEmail: el("login-username").value.trim(),
            password: el("login-password").value
        });
        currentUser = data;
        el("login-status").textContent = `Logged in as ${data.username}`;
        el("buyBtn").disabled = false;
        el("refreshTicketsBtn").disabled = false;
    } catch (e) {
        el("login-status").textContent = "Invalid credentials";
    }
});

el("buyBtn").addEventListener("click", async () => {
    if (!currentUser) return alert("Login first");
    try {
        const price = parseFloat(el("ticket-price").value);
        const data = await postJson("buyTicket", {
            userId: currentUser.userId,
            price: isNaN(price) ? undefined : price
        });
        el("ticket-status").textContent = `Bought ticket ${data.ticketNumber}`;
    } catch (e) {
        alert("Failed to buy ticket");
    }
});

el("refreshTicketsBtn").addEventListener("click", async () => {
    if (!currentUser) return alert("Login first");
    try {
        const items = await get(`tickets/${currentUser.userId}`);
        const ul = el("ticketsList");
        ul.innerHTML = "";
        items.forEach(t => {
            const li = document.createElement("li");
            li.textContent = `${t.ticketNumber} - $${t.price}`;
            ul.appendChild(li);
        });
    } catch (e) {
        alert("Failed to load tickets");
    }
});

el("winnerBtn").addEventListener("click", async () => {
    try {
        const winner = await get("winner");
        const w = el("winnerInfo");
        if (!winner || !winner.id) {
            w.textContent = "No winner yet";
        } else {
            w.textContent = `Winner: User ${winner.user.id}, Ticket ${winner.ticket.ticketNumber}`;
        }
    } catch (e) {
        alert("Failed to load winner");
    }
});


