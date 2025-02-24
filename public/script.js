
document.addEventListener("DOMContentLoaded", async () => {
    // Charger la dernière phrase envoyée
    try {
        const response = await fetch("/last-line");
        const data = await response.json();
        document.getElementById("last-line").textContent = data.lastLine || "Aucune contribution pour l'instant.";
    } catch (error) {
        console.error("Erreur lors du chargement de la dernière entrée :", error);
    }

    document.getElementById("submit").addEventListener("click", async () => {
        const name = document.getElementById("name").value.trim();
        const text = document.getElementById("text").value.trim();

        if (!name || !text) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        try {
            const response = await fetch("/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, text })
            });

            if (response.ok) {
                window.location.reload();  // Recharge la page pour afficher la mise à jour
            } else {
                alert("Erreur lors de l'envoi du message.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi des données :", error);
            alert("Impossible de se connecter au serveur.");
        }
    });
});