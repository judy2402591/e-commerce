const cartItemsContainer =
    document.getElementById("cartItems");

const subtotalElement =
    document.getElementById("subtotal");

const discountElement =
    document.getElementById("discount");

const deliveryElement =
    document.getElementById("delivery");

const totalElement =
    document.getElementById("total");

const promoCode =
    document.getElementById("promoCode");

const applyPromo =
    document.getElementById("applyPromo");

const promoMessage =
    document.getElementById("promoMessage");

const checkoutButton =
    document.getElementById("checkoutButton");


const DISCOUNT_RATE = 0.20;
const DELIVERY_FEE = 15;


function getCart() {

    return JSON.parse(
        localStorage.getItem("shopCart")
    ) || [];

}


function saveCart(cart) {

    localStorage.setItem(
        "shopCart",
        JSON.stringify(cart)
    );

}


function money(value) {

    return "$" + Math.round(value);

}


function renderEmptyCart() {

    cartItemsContainer.innerHTML = `

        <div class="empty-cart">

            <i class="bi bi-cart3"></i>

            <h2>
                Your cart is empty
            </h2>

            <p>
                Add some products and they will appear here.
            </p>

            <a
                href="index.html"
                class="shop-button">

                Continue Shopping

            </a>

        </div>

    `;

}


function updateSummary(cart) {

    let subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            item.price * item.quantity;

    });


    const discount =
        subtotal * DISCOUNT_RATE;


    const delivery =
        subtotal > 0
            ? DELIVERY_FEE
            : 0;


    const total =
        subtotal -
        discount +
        delivery;


    subtotalElement.textContent =
        money(subtotal);

    discountElement.textContent =
        "-" + money(discount);

    deliveryElement.textContent =
        money(delivery);

    totalElement.textContent =
        money(total);

}


function changeQuantity(id, color, size, change) {

    const cart = getCart();


    const item = cart.find(product => {

        return (
            product.id === id &&
            product.color === color &&
            product.size === size
        );

    });


    if (!item) {
        return;
    }


    item.quantity += change;


    if (item.quantity <= 0) {

        const index =
            cart.indexOf(item);

        cart.splice(index, 1);

    }


    saveCart(cart);

    loadCart();

}


function removeItem(id, color, size) {

    const cart = getCart().filter(item => {

        return !(
            item.id === id &&
            item.color === color &&
            item.size === size
        );

    });


    saveCart(cart);

    loadCart();

}


function renderCart(products) {

    const storedCart =
        getCart();


    const cart = storedCart
        .map(item => {

            const product =
                products.find(
                    product =>
                        product.id === item.id
                );


            if (!product) {
                return null;
            }


            return {

                ...product,

                quantity: item.quantity,

                size:
                    item.size ||
                    "Medium",

                color:
                    item.color ||
                    product.color

            };

        })
        .filter(item => item !== null);


    if (cart.length === 0) {

        renderEmptyCart();

        updateSummary([]);

        return;

    }


    cartItemsContainer.innerHTML = "";


    cart.forEach(item => {

        const cartItem =
            document.createElement("article");


        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}">

            </div>


            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    Size: ${item.size}
                </p>

                <p>
                    Color: ${item.color}
                </p>

                <div class="cart-item-price">
                    ${money(item.price)}
                </div>

            </div>


            <div class="cart-item-actions">

                <button
                    class="remove-item"
                    type="button"
                    aria-label="Remove item">

                    <i class="bi bi-trash3-fill"></i>

                </button>


                <div class="quantity-control">

                    <button
                        class="quantity-minus"
                        type="button">

                        −

                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        class="quantity-plus"
                        type="button">

                        +

                    </button>

                </div>

            </div>

        `;


        const removeButton =
            cartItem.querySelector(
                ".remove-item"
            );


        const minusButton =
            cartItem.querySelector(
                ".quantity-minus"
            );


        const plusButton =
            cartItem.querySelector(
                ".quantity-plus"
            );


        removeButton.addEventListener(
            "click",
            () => {

                removeItem(
                    item.id,
                    item.color,
                    item.size
                );

            }
        );


        minusButton.addEventListener(
            "click",
            () => {

                changeQuantity(
                    item.id,
                    item.color,
                    item.size,
                    -1
                );

            }
        );


        plusButton.addEventListener(
            "click",
            () => {

                changeQuantity(
                    item.id,
                    item.color,
                    item.size,
                    1
                );

            }
        );


        cartItemsContainer.appendChild(
            cartItem
        );

    });


    updateSummary(cart);

}


function loadCart() {

    fetch("products.json")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Products could not be loaded"
                );

            }

            return response.json();

        })

        .then(products => {

            renderCart(products);

        })

        .catch(error => {

            console.error(error);

            cartItemsContainer.innerHTML = `

                <div class="empty-cart">

                    <h2>
                        Unable to load your cart
                    </h2>

                    <p>
                        Please run the project using Live Server.
                    </p>

                </div>

            `;

        });

}


applyPromo.addEventListener(
    "click",
    () => {

        const code =
            promoCode.value
                .trim()
                .toUpperCase();


        if (code === "SAVE20") {

            promoMessage.textContent =
                "Promo code applied!";

        } else if (code === "") {

            promoMessage.textContent =
                "Please enter a promo code.";

        } else {

            promoMessage.textContent =
                "Invalid promo code.";

        }

    }
);


checkoutButton.addEventListener(
    "click",
    () => {

        const cart =
            getCart();


        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;

        }


        alert(
            "Checkout is ready!"
        );

    }
);


loadCart();