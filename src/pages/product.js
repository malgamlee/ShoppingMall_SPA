export const product = (rootEl, props) => {
  const prdtEl = document.createElement("div");
  prdtEl.innerHTML = `
      <li class="Product">
            <img src="${props.imageUrl}"/>
            <div class="Product__info">
              <div>${props.name}</div>
              <div>${(+props.price).toLocaleString("ko-KR")}원~</div>
            </div>
          </li>
    `;

  prdtEl.addEventListener("click", () => {
    props.onClick(props.id);
  });

  rootEl.appendChild(prdtEl);
};
