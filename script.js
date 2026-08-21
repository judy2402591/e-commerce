document.addEventListener("DOMContentLoaded", () => {

    const newArrivalsContainer =
        document.getElementById("new-arrivals-products");

    const topSellingContainer =
        document.getElementById("top-selling-products");

    const viewAllBtn =
        document.getElementById("viewAllBtn");

    function createProductCard(product, index, isTopSelling = false) {

        const col = document.createElement("div");

        col.className = "col-6 col-lg-3";

        if (isTopSelling && index >= 4) {
            col.classList.add("extra-product");
        }

        let oldPriceHTML = "";

        if (product.oldPrice) {
            oldPriceHTML =
                `<span class="old-price">$${product.oldPrice}</span>`;
        }

        let discountHTML = "";

        if (product.discount) {
            discountHTML =
                `<span class="discount">-${product.discount}%</span>`;
        }

        col.innerHTML = `
            <div class="product-card">

                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <h5>${product.name}</h5>

                <div class="rating">
                    ★★★★★
                    <span>${product.rating}/5</span>
                </div>

                <div class="price">
                    $${product.price}
                    ${oldPriceHTML}
                    ${discountHTML}
                </div>

            </div>
        `;

        col.addEventListener("click", () => {
            window.location.href =
                `product.html?id=${product.id}`;
        });

        return col;
    }

    function renderProducts(products) {

        newArrivalsContainer.innerHTML = "";
        topSellingContainer.innerHTML = "";

        const newArrivals =
            products.filter(product =>
                product.section === "new-arrivals"
            );

        const topSelling =
            products.filter(product =>
                product.section === "top-selling"
            );

        newArrivals.forEach((product, index) => {

            newArrivalsContainer.appendChild(
                createProductCard(
                    product,
                    index,
                    false
                )
            );

        });

        topSelling.forEach((product, index) => {

            topSellingContainer.appendChild(
                createProductCard(
                    product,
                    index,
                    true
                )
            );

        });
    }

    fetch("products.json")

        .then(response => {

            if (!response.ok) {
                throw new Error("Could not load products.json");
            }

            return response.json();

        })

        .then(products => {

            renderProducts(products);

            const extraProducts =
                topSellingContainer.querySelectorAll(
                    ".extra-product"
                );

            extraProducts.forEach(product => {

                product.style.display = "none";
                product.style.opacity = "0";
                product.style.transform = "translateY(10px)";
                product.style.transition =
                    "opacity 0.45s ease, transform 0.45s ease";

            });

            if (viewAllBtn) {

                viewAllBtn.addEventListener("click", () => {

                    document.body.classList.add(
                        "page-leaving"
                    );

                    setTimeout(() => {

                        window.location.href =
                            "viewall.html";

                    }, 220);

                });

            }

        })

        .catch(error => {

            console.error(
                "Error loading products:",
                error
            );

            newArrivalsContainer.innerHTML =
                `<p class="text-center text-danger">
                    Unable to load products.
                </p>`;

        });

});


document.addEventListener("DOMContentLoaded", () => {

    const customersWrapper =
        document.getElementById("customersWrapper");

    const customerPrev =
        document.getElementById("customerPrev");

    const customerNext =
        document.getElementById("customerNext");

    if (
        !customersWrapper ||
        !customerPrev ||
        !customerNext
    ) {
        return;
    }

    const customerCards =
        customersWrapper.querySelectorAll(
            ".customer-card"
        );

    let customerIndex = 0;

    function getCardWidth() {

        if (!customerCards.length) {
            return 0;
        }

        const card = customerCards[0];

        const style =
            window.getComputedStyle(
                customersWrapper
            );

        const gap =
            parseFloat(style.columnGap) || 16;

        return card.offsetWidth + gap;
    }

    function updateCustomers() {

        const cardWidth = getCardWidth();

        customersWrapper.style.transform =
            `translateX(-${customerIndex * cardWidth}px)`;
    }

    customerNext.addEventListener("click", () => {

        if (
            customerIndex <
            customerCards.length - 3
        ) {

            customerIndex++;
            updateCustomers();

        }

    });

    customerPrev.addEventListener("click", () => {

        if (customerIndex > 0) {

            customerIndex--;
            updateCustomers();

        }

    });

    window.addEventListener(
        "resize",
        updateCustomers
    );

});