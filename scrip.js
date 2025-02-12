const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const pontorefInput = document.getElementById('pontoref');
const addressWarn = document.getElementById("address-warn");
const nameuserInput = document.getElementById('nameuser');
const nameuserWarn = document.getElementById('nameuser-warn');
const cashamountInput = document.getElementById('cash-amount');
const observacoesInput = document.getElementById('observacoes');
const trocoWarn = document.getElementById('troco-warn');
const deliveryFields = document.getElementById('delivery-fields');
const deliveryMethodRadios = document.querySelectorAll('input[name="delivery-method"]');
const paymentMethodRadios = document.querySelectorAll('input[name="payment"]');
const horarioFuncionamento = document.getElementById('horario-e-dia');
const opcoesAdicional = document.getElementById('adicionais');
const adicionalWarn = document.getElementById('adicional-warn');
const pagamentoWarn = document.getElementById('pagamento-warn');
const retiradaWarn = document.getElementById('retirada-warn');
const bairrosInput = document.getElementById('bairros');
const bairroWarn = document.getElementById('bairro-warn');
const freteInfo = document.getElementById('frete-info');

const fretePrecos = {
    Farolândia: 12.00,
    Jardins: 10.00,
    'Santa Luzia': 8.00,
    'Ponto Novo': 5.00,
};

let cart = [];
let paymentMethod = '';
let selectedBairro = ''; 

cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
});

document.addEventListener("click", function(event) {
    let target = event.target;
    
    while (target && !target.classList.contains("add-to-cart-btn")) {
        target = target.parentElement;
    }
    
    if (target) {
        const name = target.getAttribute("data-name");
        const price = parseFloat(target.getAttribute("data-price"));
        console.log(`Item adicionado: ${name} - R$${price}`); 
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    console.log(`Adicionando ao carrinho: ${name} - R$${price}`); 
    
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }
    
    updateCartModal();
}

function calculateFrete() {
    if (selectedBairro && fretePrecos.hasOwnProperty(selectedBairro)) {
        return fretePrecos[selectedBairro];
    }
    return 0;
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");  
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `;
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    if (selectedBairro) {
        const frete = calculateFrete();
        const freteElement = document.createElement("div");
        freteElement.classList.add("flex", "justify-between", "mb-4", "font-medium");
        freteElement.innerHTML = `
            <p>Frete (${selectedBairro}):</p>
            <p>R$ ${frete.toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(freteElement);
    }
    
    const totalComFrete = total + calculateFrete();
    
    cartTotal.textContent = totalComFrete.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    
    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

nameuserInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        nameuserInput.classList.remove("border-red-500");
        nameuserWarn.classList.add("hidden");
    }
});

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

cashamountInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        cashamountInput.classList.remove("border-red-500");
        trocoWarn.classList.add("hidden");
    }
});

const adicionalSimInput = document.getElementById('acrescentar-sim');
const adicionalNaoInput = document.getElementById('acrescentar-nao');

adicionalSimInput.addEventListener('change', function() {
    if (adicionalSimInput.checked) {
        opcoesAdicional.classList.remove('hidden'); 
        adicionalWarn.classList.add('hidden');       
    }
});

adicionalNaoInput.addEventListener('change', function() {
    if (adicionalNaoInput.checked) {
        opcoesAdicional.classList.add('hidden');    
        adicionalWarn.classList.add('hidden');    
    }
});

deliveryMethodRadios.forEach(input => {
    input.addEventListener('change', function() {
        const isDelivery = document.getElementById('delivery').checked;
        
        if (isDelivery) {
            deliveryFields.classList.remove('hidden');
            addressWarn.classList.add('hidden');
        } else {
            deliveryFields.classList.add('hidden');
            addressWarn.classList.add('hidden');
        }

        retiradaWarn.classList.add('hidden');
    });
});

bairrosInput.addEventListener('change', function() {
    selectedBairro = this.value.trim(); // Usa trim() para garantir que o valor do bairro esteja correto
    bairroWarn.classList.add('hidden');  
    updateCartModal(); 
});

paymentMethodRadios.forEach(input => {
    input.addEventListener('change', function() {
        if (input.value === 'cash') {
            paymentMethod = 'cash';  
        } else if (input.value === 'pix') {
            paymentMethod = 'pix';  
        }
        pagamentoWarn.classList.add('hidden');
    });
});

const valorWarn = document.getElementById('valor-warn');
cashamountInput.addEventListener("input", function() {
    const totalCompra = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + calculateFrete();
    const valorDigitado = parseFloat(cashamountInput.value) || 0; 

    if (valorDigitado < totalCompra) {
        valorWarn.classList.remove("hidden");
    } else {
        valorWarn.classList.add("hidden");
    }
});

checkoutBtn.addEventListener("click", function() {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    if (!adicionalSimInput.checked && !adicionalNaoInput.checked) {
        adicionalWarn.classList.remove('hidden'); 
        adicionalWarn.classList.add('border-red-500');
        return;
    }

    if (nameuserInput.value === "") {
        nameuserWarn.classList.remove("hidden");
        nameuserWarn.classList.add("border-red-500");
        return;
    }

    const deliveryMethodSelected = document.querySelector('input[name="delivery-method"]:checked');
    if (!deliveryMethodSelected) {
        retiradaWarn.classList.remove('hidden');
        retiradaWarn.classList.add('border-red-500');
        return;
    }

    if (document.getElementById('delivery').checked && addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressWarn.classList.add("border-red-500");
        return;
    }
    
    if (document.getElementById('delivery').checked && !selectedBairro) {  
        bairroWarn.classList.remove("hidden");
        bairroWarn.classList.add("border-red-500");
        return;
    }

    if (!document.querySelector('input[name="payment"]:checked')) {
        pagamentoWarn.classList.remove('hidden');  
        pagamentoWarn.classList.add('border-red-500');
        return;
    }

    if (paymentMethod === 'cash' && cashamountInput.value === "") {
        trocoWarn.classList.remove("hidden");
        trocoWarn.classList.add("border-red-500");
        return;
    }

    const cartItems = cart.map((item) => {
        return (
            `${item.name}, Quantidade: (${item.quantity})\nPreço: R$${item.price.toFixed(2)}\n`
        );
    }).join("\n");

    const totalCompra = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const frete = calculateFrete();
    const totalCompraComFrete = totalCompra + frete;

    const deliveryMethod = document.getElementById('delivery').checked ? "Delivery" : "Consumir/Retirar no local";
    const paymentInfo = paymentMethod === 'cash' ? `Dinheiro, precisa de troco: ${cashamountInput.value}` : "Pix";

    const msgInicial = 'Olá, gostaria de fazer um pedido!\n\nPedido:\n\n'
    const message = encodeURIComponent(`${msgInicial} ${cartItems} 

    Nome do cliente: ${nameuserInput.value}

    Método de retirada: ${deliveryMethod}
    ${deliveryMethod === "Delivery" ? `Endereço: ${addressInput.value}\nBairro: ${bairrosInput.value}\nPonto de Referência: ${pontorefInput.value}\nFrete: R$ ${frete.toFixed(2)}` : ''}

    Forma de pagamento: ${paymentInfo}

    Total do pedido: R$${totalCompraComFrete.toFixed(2)}

    Observações do cliente, caso tenha: ${observacoesInput.value}

    Faça novos pedidos em: https://sistema-de-lanchonete-heitorfv.vercel.app/`);

    const whatsappURL = `https://wa.me/5579996422951?text=${message}`;
    window.open(whatsappURL, "_blank");
    
    cart = [];
    updateCartModal();
});

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    const minutos = data.getMinutes();
    return (hora > 8 || (hora === 8 && minutos >= 0)) && (hora < 23 || (hora === 23 && minutos === 0));
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
    horarioFuncionamento.innerHTML = 'ABERTO - 08:00 às 23:00'
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
