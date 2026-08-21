document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("casualProducts"); // product container
    const count = document.getElementById("productCount"); // product count
    const emptyState = document.getElementById("emptyState"); //for the empty message
    const sortSelect = document.getElementById("sortSelect"); //sort dropdown
    const priceRange = document.getElementById("priceRange");
    const priceValue = document.getElementById("priceValue");
    const mobileFilterOpen = document.getElementById("mobileFilterOpen");//mobile open button
    const mobileFilterClose = document.getElementById("mobileFilterClose"); //mobile close button
    const filters = document.querySelector(".filters"); //filter sidebar
    let allProducts = []; //json
    let filteredProducts = []; //hold only filtered products
    function createCard(product) {
        const card = document.createElement("article");
        card.className = "category-card"; //add class to style

        let oldPriceHTML = "";
        if (product.oldPrice) {
            oldPriceHTML = `<span class="card-old-price">$${product.oldPrice}</span>`; //create old 
            // price span
        }
        let discountHTML = ""; 
        if (product.discount) {
            discountHTML = `<span class="card-discount">-${product.discount}%</span>`;
        }

        card.innerHTML = `
            <div class="category-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <div class="card-rating">
                ★★★★★
                <span>${product.rating}/5</span>
            </div>
            <div class="card-price">
                $${product.price}
                ${oldPriceHTML}
                ${discountHTML}
            </div>
        `;
        card.addEventListener("click", () => {
            window.location.href = `product.html?id=${product.id}`; // when clicked go to product page
        });

        return card;
    }

    function getSelectedCategories() { //for the checked categories in filter
        return [
            ...document.querySelectorAll(".category-filter:checked") //find all checked categories
        ].map(input => input.value); //get just the value
    }
    function getSelectedSize() {
        const activeSize = document.querySelector(".size-filter.active"); //find active size button
        if (!activeSize) return null; //if none return null
        return activeSize.dataset.size; //return size from data-size attribute
    }
    function applyFilters() {
        const selectedCategories = getSelectedCategories(); //get all checked categries
        const selectedSize = getSelectedSize();
        const maxPrice = Number(priceRange.value);// get max price from slider
        const selectedColor = document.querySelector(".color-dot.selected"); //get selected color dot
        const selectedStyleButtons = document.querySelectorAll(".style-filter.active"); // get all active style buttons
        const selectedStyles = Array.from(selectedStyleButtons).map(btn => btn.textContent.trim().replace('›', '').trim());

        filteredProducts = allProducts.filter(product => {
            // Category filter
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            // Price filter
            const priceMatch = product.price <= maxPrice;
            // Color filter
            let colorMatch = true;
            if (selectedColor) {
                const selectedColorValue = selectedColor.dataset.color.toLowerCase();
                const productColor = product.color ? product.color.toLowerCase() : '';
                colorMatch = productColor === selectedColorValue;
            }
            
            // Size filter
            const sizeMatch = !selectedSize || (product.sizes && product.sizes.includes(selectedSize));
            
            // Style filter
            const styleMatch = selectedStyles.length === 0 || selectedStyles.includes(product.style);

            return categoryMatch && priceMatch && colorMatch && sizeMatch && styleMatch;
        });

        sortProducts();
    }

    function sortProducts() {
        const sortValue = sortSelect.value;

        if (sortValue === "price-low") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === "price-high") {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortValue === "rating") {
            filteredProducts.sort((a, b) => b.rating - a.rating);
        } else {
            // Default - sort by rating
            filteredProducts.sort((a, b) => b.rating - a.rating);
        }

        renderProducts();
    }
    function renderProducts() {
        grid.innerHTML = "";

        if (filteredProducts.length === 0) {
            emptyState.classList.add("show");
        } else {
            emptyState.classList.remove("show");
            filteredProducts.forEach(product => {
                grid.appendChild(createCard(product));
            });
        }

        const total = filteredProducts.length;
        if (total === 0) {
            count.textContent = "Showing 0 Products";
        } else {
            count.textContent = `Showing 1-${total} of ${total} Products`;
        }
    }
    document.querySelectorAll(".color-dot").forEach(dot => {
        dot.addEventListener("click", () => {
            const wasSelected = dot.classList.contains("selected");
            
            document.querySelectorAll(".color-dot").forEach(item => {
                item.classList.remove("selected");
            });

            if (!wasSelected) {
                dot.classList.add("selected");
            }

            applyFilters();
        });
    });
    document.querySelectorAll(".size-filter").forEach(button => {
        button.addEventListener("click", () => {
            const wasActive = button.classList.contains("active");
            
            document.querySelectorAll(".size-filter").forEach(item => {
                item.classList.remove("active");
            });

            if (!wasActive) {
                button.classList.add("active");
            }

            applyFilters();
        });
    });

    document.querySelectorAll(".style-filter").forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("active");
            applyFilters();
        });
    });
    document.querySelectorAll(".category-filter").forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            applyFilters();
        });
    });
    document.querySelectorAll(".filter-title").forEach(title => {
        title.addEventListener("click", () => {
            const group = title.parentElement.querySelector(
                ".filter-options, .price-filter, .color-list, .size-list, .style-options"
            );
            if (!group) return;

            if (group.style.display === "none") {
                group.style.display = "";
            } else {
                group.style.display = "none";
            }
        });
    });

    sortSelect.addEventListener("change", sortProducts);

    priceRange.addEventListener("input", () => {
        priceValue.textContent = `$${priceRange.value}`;
        applyFilters();
    });


    document.getElementById("applyFilter").addEventListener("click", () => {
        applyFilters();
        filters.classList.remove("open");
    });

    if (mobileFilterOpen) {
        mobileFilterOpen.addEventListener("click", () => {
            filters.classList.add("open");
        });
    }

    if (mobileFilterClose) {
        mobileFilterClose.addEventListener("click", () => {
            filters.classList.remove("open");
        });
    }


    const previousPage = document.getElementById("previousPage");
    const nextPage = document.getElementById("nextPage");

    if (previousPage) {
        previousPage.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (nextPage) {
        nextPage.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
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
            allProducts = products;
            filteredProducts = [...allProducts];
            sortProducts();
        })
        .catch(error => {
            console.error("Error loading products:", error);
            grid.innerHTML = `
                <p class="text-danger">
                    Unable to load products. Please refresh the page.
                </p>
            `;
        });

});