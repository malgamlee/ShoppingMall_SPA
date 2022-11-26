interface ISelectOption {
  productId: number;
  optionId: number;
  quantity: number;
  price: number;
}

interface IPrdtOptions {
  created_at: string;
  id: number;
  name: string;
  price: number;
  stock: number;
  updated_at: string;
}

export const productDetail = (
  rootEl: HTMLElement | null,
  prdtId: number,
  func: (productOptions: ISelectOption[]) => void
) => {
  const prdtOption: Array<ISelectOption> = [];
  // fetch(`http://localhost:3000/products/${props.id}`)
  fetch(
    `https://my-json-server.typicode.com/malgamlee/ShoppingMall_SPA/products/${prdtId}`
  )
    .then((response) => response.json())
    .then((result) => {
      const prdtOptions = result.productOptions.map(
        (prdt: IPrdtOptions, idx: number) => {
          let prdtname = `${result.name} ${prdt.name}`;
          if (prdt.price > 0)
            prdtname += ` (+${(+prdt.price).toLocaleString("ko-KR")}원)`;
          return `<option ${
            prdt.stock === 0 ? " disabled " : ""
          } value='${idx},${prdt.id},${prdt.name},${
            +result.price + +prdt.price
          }'}>${prdt.stock === 0 ? "(품절) " + prdtname : prdtname}</option>`;
        }
      );

      rootEl!.innerHTML = `
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

      // 주문하기 버튼
      document
        .getElementsByClassName("OrderButton")[0]
        .addEventListener("click", () => {
          func(prdtOption);
        });
      const selectedOptionsList = document.getElementById(
        "selectedOptionsList"
      );
      const selectBox = document.getElementById(
        "selectbox"
      ) as HTMLSelectElement;

      const handlePickOption = () => {
        const selectValue = selectBox.options[selectBox.selectedIndex].value;
        const [idx, optionId, option, price] = selectValue.split(",");
        if (prdtOption.filter((el) => +el.optionId === +optionId).length > 0)
          return;
        prdtOption.push({
          productId: +result.id,
          optionId: +optionId,
          quantity: 1,
          price: +price,
        });
        let pickProduct = document.createElement("li");
        pickProduct.innerHTML = `${option} ${(+price).toLocaleString("ko-KR")}원
            <div><input class="inputStock_${optionId}" type="number" value="1" min="1" max="${
          result.productOptions[idx].stock
        }"/>개</div>`;
        selectedOptionsList!.append(pickProduct);

        const updateCost = () => {
          let totalPrice = 0;
          let prdtCount = +(
            document.getElementsByClassName(
              `inputStock_${optionId}`
            )[0] as HTMLInputElement
          ).value;
          prdtOption.map((el) => {
            if (el.optionId === +optionId) el.quantity = +prdtCount;
            totalPrice += +el.price * +el.quantity;
          });

          const priceContent = document.getElementsByClassName(
            "ProductDetail__totalPrice"
          )[0] as HTMLElement;
          priceContent.innerText = `${totalPrice.toLocaleString("ko-KR")}원`;
        };
        document
          .getElementsByClassName(`inputStock_${optionId}`)[0]
          .addEventListener("change", updateCost);
        updateCost();
      };
      selectBox!.addEventListener("change", handlePickOption);
    });
};
