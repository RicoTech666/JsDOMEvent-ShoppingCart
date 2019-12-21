var carProducts = [
  {
    "id": 1,
    "name": "英雄牌 钢笔",
    "count": 1,
    "price": 69,
    "checked": false
  },
  {
    "id": 2,
    "name": "晨光牌 铅字笔",
    "count": 2,
    "price": 5.5,
    "checked": true
  },
  {
    "id": 3,
    "name": "晨光牌 铅笔",
    "count": 1,
    "price": 2,
    "checked": false
  },
  {
    "id": 4,
    "name": "狗熊牌 橡皮擦",
    "count": 1,
    "price": 1,
    "checked": false
  },
  {
    "id": 5,
    "name": "瑞士牌 双肩书包",
    "count": 1,
    "price": 199,
    "checked": true
  },
  {
    "id": 6,
    "name": "晨光牌 作业本",
    "count": 5,
    "price": 2.5,
    "checked": false
  }
]
initShoppingCart();

function initShoppingCart() {
  var tbody = document.getElementsByTagName("tbody")[0];
  carProducts.forEach(stationary => {
    var productInfo = document.createElement("tr");
		productInfo.innerHTML = `<td class="select-column">
      <input type="checkbox" name="select-single-stationery"></td>
      <td>${stationary["name"]}</td>
      <td class="price-column">${stationary["price"]}</td>
      <td class="count-column"><button name="minus-btn">-</button> 
      <span class ="count-column-content">${stationary["count"]}</span>
      <button name="plus-btn">+</button>
      </td>
      <td class="total-price-column">${stationary["price"] * stationary["count"]}</td>`;
		tbody.appendChild(productInfo); 
  });
}

var staCount = 0; 
var allStaPrice = 0; 
var myTable = document.getElementsByTagName("table")[0];

myTable.addEventListener("click", clickCheckbox, false);
function clickCheckbox(event) {
  var currentCheckbox = event.target || window.event.srcElement;
  var currentInfoRow = currentCheckbox.parentNode.parentNode; 
	var isChecked = currentCheckbox.checked;
	
	if ("select-single-stationery" === currentCheckbox.name) {
    selectSingleStationery(isChecked,currentInfoRow);
	} else if ("select-all-stationery" === currentCheckbox.name) {
    selectAllStationery(isChecked);
}
}

function selectSingleStationery(checkedStatus, stationaryInfoRow) {
  var totalPricePerStationary = stationaryInfoRow.lastElementChild;
  var totalPricePerStaNum = parseFloat(totalPricePerStationary.innerHTML);
  var countPerSta = parseInt(stationaryInfoRow.querySelector("span").innerHTML);
  if (checkedStatus) {
    staCount = staCount + countPerSta;
    allStaPrice = allStaPrice + totalPricePerStaNum;
  } else {
    staCount = staCount - countPerSta;
    allStaPrice = allStaPrice - totalPricePerStaNum;
  }
  updateNeedToPayAndTotalCount(staCount, allStaPrice); 
}

function selectAllStationery(checkedStatus) {
  var selectColumn = myTable.getElementsByClassName("select-column");
  var totalPriceColumn = myTable.getElementsByClassName("total-price-column");
  var countColumn = myTable.getElementsByClassName("count-column-content");
  staCount = 0;
  allStaPrice = 0;
  if (checkedStatus) {
    for (let j = 0; j < totalPriceColumn.length; j++) {
      selectColumn[j].children[0].checked = true;
      allStaPrice = allStaPrice + parseFloat(totalPriceColumn[j].innerHTML);
      staCount = staCount + parseInt(countColumn[j].innerHTML);
    }
  } else {
    for (let j = 0; j < selectColumn.length; j++) {
      selectColumn[j].children[0].checked = false;
    }
  }
  updateNeedToPayAndTotalCount(staCount, allStaPrice); 
}


myTable.addEventListener("click", increaseOrDecreaseStationery, false);
function increaseOrDecreaseStationery(event) {
	var currentBtn = event.target || window.event.srcElement;
	if ("minus-btn" === currentBtn.name) {
		decreaseStationery(currentBtn);
	} else if ("plus-btn" === currentBtn.name) {
		increaseStationery(currentBtn);
	}
}

function decreaseStationery(currentBtn) {
	var countNode = currentBtn.parentNode;
	var currentStationaryInfoRow = countNode.parentNode;
  var isChecked = currentStationaryInfoRow.getElementsByTagName("input")[0].checked;
  console.log(isChecked);
	var countNumberPerRow = parseInt(countNode.children[1].innerHTML) - 1;
	countNode.children[1].innerHTML = countNumberPerRow;
	var totalPricePerStationary = currentStationaryInfoRow.lastElementChild;
	var priceNode = currentStationaryInfoRow.getElementsByClassName("price-column")[0];
	var priceNumberPerRow = parseFloat(priceNode.innerHTML);
	totalPricePerStationary.innerHTML = countNumberPerRow * priceNumberPerRow;
	
	if (0 === countNumberPerRow) {
    var tbody = document.getElementsByTagName("tbody")[0];
		tbody.removeChild(countNode.parentNode);
	}
	
	if (isChecked) {
		staCount = staCount - 1;
		allStaPrice = allStaPrice - priceNumberPerRow;
		updateNeedToPayAndTotalCount(staCount, allStaPrice);
	}
}

function increaseStationery(currentBtn) {
	var countNode = currentBtn.parentNode;
	var currentStationaryInfoRow = countNode.parentNode;
	var countNumberPerRow = parseInt(countNode.children[1].innerHTML) + 1;
	countNode.children[1].innerHTML = countNumberPerRow;
	var totalPricePerStationary = currentStationaryInfoRow.lastElementChild;
	var priceNode = currentStationaryInfoRow.getElementsByClassName("price-column")[0];
	var priceNumberPerRow = parseFloat(priceNode.innerHTML);
	totalPricePerStationary.innerHTML = countNumberPerRow * priceNumberPerRow;
	
	if (currentStationaryInfoRow.getElementsByTagName("input")[0].checked) {
		staCount = staCount + 1;
		allStaPrice = allStaPrice + priceNumberPerRow;
		updateNeedToPayAndTotalCount(staCount, allStaPrice);
	}
}

function updateNeedToPayAndTotalCount(staCount, allStaPrice) {
	var totalCount = document.getElementsByClassName("total-count")[0];
	var needToPay = document.getElementsByClassName("need-to-pay")[0];
	totalCount.innerHTML = staCount;
	needToPay.innerHTML = allStaPrice;
}