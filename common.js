document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");

    if (header) {
        fetch("components/header.html")
            .then(response => response.text())
            .then(data => {
                header.innerHTML = data;
            })
            .catch(error => {
                console.error("Error loading header:", error);
            });
    }

    if (footer) {
        fetch("components/footer.html")
            .then(response => response.text())
            .then(data => {
                footer.innerHTML = data;
            })
            .catch(error => {
                console.error("Error loading footer:", error);
            });
    }

});