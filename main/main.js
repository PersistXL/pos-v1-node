module.exports = function printInventory(inputs) {
    const datbase = require('../main/datbase');
    const allItems = datbase.loadAllItems();
    const promotions = datbase.loadPromotions();
    var purchases = [];
    var sign = /-/;
    var promotionCode = [];
    var total = 0;
    var saving_money = 0;
    var endingDate = {};
    var receipt = '';
    var receipt_header = '***<没钱赚商店>购物清单***\n';
    var receipt_forEvery = '';
    var receipt_mm = '挥泪赠送商品：\n';
    var receipt_discount = '';
    var receipt_ending = '';
    var interval = '----------------------\n';
    var footer = '**********************';

    inputs.sort();
    for (let i = 0; i < inputs.length;) {
        let count = 0;
        for (let j = i; j < inputs.length; j++) {
            if (inputs[i] === inputs[j]) {
                count++;
            }
        }
        purchases.push({barcode: inputs[i], count: count});
        i += count;
    }
    for (let item of purchases) {
        if (sign.test(item.barcode)) {
            let arr = item.barcode.split('-');
            item.barcode = arr[0];
            item.count = Number(arr[1]);
        }
    }
    for (let i = 0; i < allItems.length; i++) {
        for (let item of purchases) {
            if (allItems[i].barcode === item.barcode) {
                item.subtotal = (allItems[i].price * item.count).toFixed(2);
                item.unit_price = item.count + allItems[i].unit
                Object.assign(item, allItems[i])
            }
        }
    }

    Array.from(promotions).forEach(function (pro) {
        promotionCode = (pro.barcodes);

    })
    for (let item of purchases) {
        total += Number(item.subtotal);
    }

    for (let i = 0; i < promotionCode.length; i++) {
        for (let j = 0; j < purchases.length; j++) {
            if (promotionCode[i] === purchases[j].barcode) {
                if (purchases[j].count >= 2) {
                    purchases[j].subtotal = (Number(purchases[j].subtotal) - purchases[j].price).toFixed(2);
                    saving_money += Number(purchases[j].price);
                }
            }
        }
    }

    total = total - saving_money;
    endingDate = {saving_money: saving_money.toFixed(2), total: total.toFixed(2), promotionCode: promotionCode};
    for (let item of purchases) {
        receipt_forEvery += '名称：' + item.name + '，数量：' + item.unit_price + '，单价：' + (item.price).toFixed(2) + '(元)，小计：' + item.subtotal + '(元)\n';
        for (let value of endingDate.promotionCode) {
            if (item.barcode === value) {
                receipt_discount += '名称：' + item.name + '，数量：1' + item.unit + '\n'
            }
        }
    }
    receipt_ending = '总计：' + endingDate.total + '(元)\n' +
        '节省：' + endingDate.saving_money + '(元)\n'
    receipt = receipt_header + receipt_forEvery + interval + receipt_mm + receipt_discount + interval + receipt_ending + footer;
    console.log(receipt)
};
Array.prototype.removeByValue = function (value) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] == value) {
            this.splice(i, 1);
            break;
        }
    }
}