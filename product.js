const productName = document.getElementById("productName");
const productRating = document.getElementById("productRating");
const productPrice = document.getElementById("productPrice");
const oldPrice = document.getElementById("oldPrice");
const discount = document.getElementById("discount");
const mainProductImage = document.getElementById("mainProductImage");
const thumbnailList = document.getElementById("thumbnailList");
const breadcrumbProduct = document.getElementById("breadcrumbProduct");

const quantityElement = document.getElementById("quantity");
const minusButton = document.getElementById("minus");
const plusButton = document.getElementById("plus");
const addCart = document.getElementById("addCart");

let quantity = 1;

function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("id")) || 1;
}

function showProduct(product) {
    productName.textContent = product.name;
    breadcrumbProduct.textContent = product.name;
    productRating.textContent = `${product.rating}/5`;
    productPrice.textContent = `$${product.price}`;
    mainProductImage.src = product.image;
    mainProductImage.alt = product.name;

    if (product.oldPrice) {
        oldPrice.textContent = `$${product.oldPrice}`;
    }

    if (product.discount) {
        discount.textContent = `-${product.discount}%`;
    }

    const images = [
        product.image,
        product.image,
        product.image
    ];

    thumbnailList.innerHTML = "";

    images.forEach((image, index) => {
        const button = document.createElement("button");
        button.className = "thumbnail";

        if (index === 0) {
            button.classList.add("active");
        }

        button.innerHTML = `
            <img src="${image}" alt="${product.name}">
        `;

        button.addEventListener("click", () => {
            mainProductImage.src = image;
            document.querySelectorAll(".thumbnail").forEach(item => {
                item.classList.remove("active");
            });
            button.classList.add("active");
        });

        thumbnailList.appendChild(button);
    });
}

function loadRecommendations(currentId) {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            const recommendations = products.filter(product => product.id !== currentId).slice(0, 4);
            const container = document.getElementById("recommendationGrid");
            container.innerHTML = "";

            recommendations.forEach(product => {
                const card = document.createElement("div");
                card.className = "recommendation-card";

                let oldPriceHTML = "";
                if (product.oldPrice) {
                    oldPriceHTML = `<span class="recommendation-old-price">$${product.oldPrice}</span>`;
                }

                let discountHTML = "";
                if (product.discount) {
                    discountHTML = `<span class="recommendation-discount">-${product.discount}%</span>`;
                }

                card.innerHTML = `
                    <div class="recommendation-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <h4>${product.name}</h4>
                    <div class="recommendation-rating">
                        ★★★★★
                        <span>${product.rating}/5</span>
                    </div>
                    <div class="recommendation-price">
                        $${product.price}
                        ${oldPriceHTML}
                        ${discountHTML}
                    </div>
                `;

                card.addEventListener("click", () => {
                    window.location.href = `product.html?id=${product.id}`;
                });

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading recommendations:", error);
        });
}

fetch("products.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load products");
        }
        return response.json();
    })
    .then(products => {
        const id = getProductId();
        const product = products.find(item => item.id === id);

        if (product) {
            showProduct(product);
            loadRecommendations(id);
        }
    })
    .catch(error => {
        console.error(error);
    });

minusButton.addEventListener("click", () => {
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
    }
});

plusButton.addEventListener("click", () => {
    quantity++;
    quantityElement.textContent = quantity;
});

document.querySelectorAll(".color").forEach(color => {
    color.addEventListener("click", () => {
        document.querySelectorAll(".color").forEach(item => {
            item.classList.remove("selected");
        });
        color.classList.add("selected");
    });
});

document.querySelectorAll(".size").forEach(size => {
    size.addEventListener("click", () => {
        document.querySelectorAll(".size").forEach(item => {
            item.classList.remove("selected");
        });
        size.classList.add("selected");
    });
});

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        document.querySelectorAll(".tab").forEach(item => {
            item.classList.remove("active");
        });
        document.querySelectorAll(".tab-content").forEach(item => {
            item.classList.remove("active");
        });
        tab.classList.add("active");
        document.getElementById(target).classList.add("active");
    });
});

const loadReviews = document.getElementById("loadReviews");

loadReviews.addEventListener("click", () => {
    const hiddenReviews = document.querySelectorAll(".hidden-review");
    hiddenReviews.forEach(review => {
        review.classList.add("show");
    });
    loadReviews.style.display = "none";
});

addCart.addEventListener("click", () => {
    const selectedColor = document.querySelector(".color.selected");
    const selectedSize = document.querySelector(".size.selected");
    const color = selectedColor ? selectedColor.dataset.color : "Not selected";
    const size = selectedSize ? selectedSize.textContent : "Not selected";

    alert(`Added to cart\nQuantity: ${quantity}\nColor: ${color}\nSize: ${size}`);
});