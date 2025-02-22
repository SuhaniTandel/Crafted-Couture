document.addEventListener("DOMContentLoaded", function () {
    updateCart();

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const name = this.getAttribute("data-name");
            const price = parseFloat(this.getAttribute("data-price"));
            addToCart(name, price);
        });
    });
});

function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(item => item.name === name);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
    updateCart();
}

function updateCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartTable = document.getElementById("cart-items");
    let totalPrice = 0;

    if (!cartTable) return;

    cartTable.innerHTML = "";
    cart.forEach((item, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <button class="decrease" data-index="${index}">-</button>
                ${item.quantity}
                <button class="increase" data-index="${index}">+</button>
            </td>
            <td>₹${item.price * item.quantity}</td>
            <td><button class="remove-item" data-index="${index}">Remove</button></td>
        `;
        cartTable.appendChild(row);
        totalPrice += item.price * item.quantity;
    });

    document.getElementById("total-price").textContent = totalPrice;

    document.querySelectorAll(".increase").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            cart[index].quantity += 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        });
    });

    document.querySelectorAll(".decrease").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        });
    });

    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCart();
        });
    });
}
