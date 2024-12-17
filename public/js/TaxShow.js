// Add functionality to display the price with tax when the switch is turned on

let taxSwitch = document.getElementById('flexSwitchCheckDefault');

taxSwitch.addEventListener('change', () => {
  let priceElements = document.querySelectorAll('.price-info');

  priceElements.forEach((priceElement) => {
    let originalPrice = parseFloat(priceElement.dataset.original);
    let priceWithGST = parseFloat(priceElement.dataset.withGst);
    console.log(originalPrice, priceWithGST);

    if (taxSwitch.checked) {
      priceElement.innerText = priceWithGST.toLocaleString('en-IN');
    } else {
      priceElement.innerText = originalPrice.toLocaleString('en-IN');
    }
  });
});
