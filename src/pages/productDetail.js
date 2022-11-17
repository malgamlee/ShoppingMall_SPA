export const productDetail = (rootEl, props) => {
  const selectedOption = [];
  fetch(`http://localhost:3000/products/${props.id}`)
    .then((response) => response.json())
    .then((result) => {
      let prdtOptions = result.productOptions.map((prdt, idx) => {
        let prdtname = `${result.name} ${prdt.name}`;
        if (prdt.price > 0)
          prdtname += ` (+${(+prdt.price).toLocaleString("ko-KR")}원)`;
        return `<option ${prdt.stock === 0 ? " disabled " : ""} value='${idx},${
          prdt.id
        },${prdt.name},${+result.price + +prdt.price}'}>${
          prdt.stock === 0 ? "(품절) " + prdtname : prdtname
        }</option>`;
      });

      rootEl.innerHTML = `
      <div class="ProductDetailPage">
      <h1>${result.name} 상품 정보</h1>
      <div class="ProductDetail">
        <img
          src="${result.imageUrl}"
        />
        <div class="ProductDetail__info">
          <h2>${result.name}</h2>
          <div class="ProductDetail__price">${result.price.toLocaleString(
            "ko-KR"
          )}원~</div>
          <select id="selectbox">
          <option>선택하세요.</option>
          ${prdtOptions}
          </select>
          <div class="ProductDetail__selectedOptions">
            <h3>선택된 상품</h3>
            <ul id="selectedOptionsList">
            </ul>
            <div class="ProductDetail__totalPrice">0원</div>
            <button class="OrderButton">주문하기</button>
          </div>
        </div>
      </div>
    </div>
        `;

      document
        .getElementsByClassName("OrderButton")[0]
        .addEventListener("click", () => {
          props.handleOrderClick(selectedOption);
        });
      const handlePickOption = () => {
        const select = document.getElementById("selectbox");
        const selectValue = select.options[select.selectedIndex].value;
        const [idx, optionId, option, price] = selectValue.split(",");
        if (
          selectedOption.filter((el) => +el.optionId === +optionId).length > 0
        )
          return;
        selectedOption.push({
          productId: +result.id,
          optionId: +optionId,
          quantity: 1,
          price: +price,
        });
        let selectbox = document.getElementById("selectedOptionsList");
        let pickProduct = document.createElement("li");
        pickProduct.innerHTML = `${option} ${(+price).toLocaleString("ko-KR")}원
            <div><input class="inputStock_${optionId}" type="number" value="1" min="1" max="${
          result.productOptions[idx].stock
        }"/>개</div>`;
        selectbox.append(pickProduct);

        const updateCost = () => {
          let totalPrice = 0;
          let prdtCount = +document.getElementsByClassName(
            `inputStock_${optionId}`
          )[0].value;
          selectedOption.map((el) => {
            if (el.optionId === +optionId) el.quantity = +prdtCount;
            totalPrice += +el.price * +el.quantity;
          });

          document.getElementsByClassName(
            "ProductDetail__totalPrice"
          )[0].innerText = `${totalPrice.toLocaleString("ko-KR")}원`;
        };
        document
          .getElementsByClassName(`inputStock_${optionId}`)[0]
          .addEventListener("change", updateCost);
        updateCost();
      };
      selectbox.addEventListener("change", handlePickOption);
    });
};
